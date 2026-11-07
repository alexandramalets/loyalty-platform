package com.retail.loyalty.service;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.BonusTransaction;
import com.retail.loyalty.dto.AnalyticsResponse;
import com.retail.loyalty.repository.BonusTransactionRepository;
import com.retail.loyalty.repository.CustomerRepository;
import com.retail.loyalty.repository.LevelTransitionRepository;
import com.retail.loyalty.repository.LoyaltyLevelRepository;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private static final DateTimeFormatter MONTH = DateTimeFormatter.ofPattern("LLL", Locale.forLanguageTag("ru"));
    private final DecimalFormat integers;

    private final CustomerRepository customers;
    private final LoyaltyLevelRepository levels;
    private final BonusTransactionRepository transactions;
    private final LevelTransitionRepository transitions;

    public AnalyticsService(
            CustomerRepository customers,
            LoyaltyLevelRepository levels,
            BonusTransactionRepository transactions,
            LevelTransitionRepository transitions
    ) {
        this.customers = customers;
        this.levels = levels;
        this.transactions = transactions;
        this.transitions = transitions;
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.forLanguageTag("ru"));
        this.integers = new DecimalFormat("#,###", symbols);
    }

    public AnalyticsResponse build(int months) {
        int period = months <= 0 ? 6 : months;
        LocalDate today = LocalDate.of(2026, 10, 5);
        LocalDate from = today.minusMonths(period);
        long total = customers.count();
        long active = customers.countByStatus("active");
        long accrued = transactions.sumAccruedSince(from);
        long spent = transactions.sumRedeemedSince(from);
        long expired = transactions.sumExpiredSince(from);
        int rate = accrued == 0 ? 0 : (int) Math.round(spent * 100.0 / accrued);

        List<AnalyticsResponse.Kpi> kpis = List.of(
                new AnalyticsResponse.Kpi(
                        "Активных участников",
                        integers.format(active),
                        share(active, total) + "% от общего числа",
                        "neutral"
                ),
                new AnalyticsResponse.Kpi(
                        "Всего участников",
                        integers.format(total),
                        "в реестре программы",
                        "neutral"
                ),
                new AnalyticsResponse.Kpi(
                        "Начислено баллов",
                        integers.format(accrued),
                        "за выбранный период",
                        "neutral"
                ),
                new AnalyticsResponse.Kpi(
                        "Использовано бонусов",
                        rate + "%",
                        "— доля списанных от начисленных",
                        "neutral"
                )
        );

        return new AnalyticsResponse(
                period,
                kpis,
                activity(from, today, period),
                new AnalyticsResponse.BonusUsage(accrued, spent, expired, rate),
                transitions(from),
                distribution(),
                "Обновлено 05.10.2026 в 09:14"
        );
    }

    private AnalyticsResponse.Activity activity(LocalDate from, LocalDate today, int period) {
        List<BonusTransaction> rows = transactions.findByOperationDateGreaterThanEqualAndStatus(from, "done");
        Map<String, long[]> buckets = new LinkedHashMap<>();
        DateTimeFormatter formatter = period <= 1
                ? DateTimeFormatter.ofPattern("'нед.' w")
                : MONTH;
        LocalDate cursor = period <= 1 ? today.minusDays(27) : today.minusMonths(period - 1L).withDayOfMonth(1);
        while (!cursor.isAfter(today)) {
            String key = period <= 1
                    ? "нед. " + (((int) cursor.toEpochDay() - (int) today.minusDays(27).toEpochDay()) / 7 + 1)
                    : capitalize(cursor.format(MONTH));
            buckets.putIfAbsent(key, new long[]{0, 0});
            cursor = period <= 1 ? cursor.plusDays(7) : cursor.plusMonths(1);
        }
        for (BonusTransaction row : rows) {
            String key = period <= 1
                    ? "нед. " + Math.max(1, (int) ((row.getOperationDate().toEpochDay() - today.minusDays(27).toEpochDay()) / 7) + 1)
                    : capitalize(row.getOperationDate().format(MONTH));
            long[] values = buckets.computeIfAbsent(key, ignored -> new long[]{0, 0});
            if (row.getAmount() > 0) {
                values[0] += row.getAmount();
            } else if (row.getAmount() < 0) {
                values[1] += -row.getAmount();
            }
        }
        return new AnalyticsResponse.Activity(
                new ArrayList<>(buckets.keySet()),
                buckets.values().stream().map(item -> item[0]).toList(),
                buckets.values().stream().map(item -> item[1]).toList()
        );
    }

    private List<AnalyticsResponse.Transition> transitions(LocalDate from) {
        return transitions.findByChangedAtGreaterThanEqual(from).stream()
                .collect(Collectors.groupingBy(
                        item -> item.getFromLevel().getName() + "→" + item.getToLevel().getName(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> {
                    String[] parts = entry.getKey().split("→", 2);
                    return new AnalyticsResponse.Transition(parts[0], parts[1], entry.getValue());
                })
                .toList();
    }

    private List<AnalyticsResponse.Distribution> distribution() {
        return levels.findAllByOrderByThresholdPointsAsc().stream()
                .map(level -> new AnalyticsResponse.Distribution(
                        level.getId(),
                        level.getName(),
                        customers.countByAccount_Level_Id(level.getId()),
                        level.getColor()
                ))
                .toList();
    }

    private String share(long part, long total) {
        if (total == 0) {
            return "0";
        }
        return String.format(Locale.forLanguageTag("ru"), "%.1f", part * 100.0 / total).replace('.', ',');
    }

    private String capitalize(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        return value.substring(0, 1).toUpperCase(Locale.forLanguageTag("ru")) + value.substring(1);
    }
}
