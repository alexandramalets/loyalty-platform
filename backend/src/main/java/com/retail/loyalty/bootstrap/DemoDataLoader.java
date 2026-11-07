package com.retail.loyalty.bootstrap;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.config.AppProperties;
import com.retail.loyalty.domain.BonusTransaction;
import com.retail.loyalty.domain.Customer;
import com.retail.loyalty.domain.LevelTransition;
import com.retail.loyalty.domain.LoyaltyAccount;
import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.domain.ProgramSettings;
import com.retail.loyalty.domain.Promotion;
import com.retail.loyalty.domain.StaffUser;
import com.retail.loyalty.repository.BonusTransactionRepository;
import com.retail.loyalty.repository.CustomerRepository;
import com.retail.loyalty.repository.LevelTransitionRepository;
import com.retail.loyalty.repository.LoyaltyLevelRepository;
import com.retail.loyalty.repository.ProgramSettingsRepository;
import com.retail.loyalty.repository.PromotionRepository;
import com.retail.loyalty.repository.StaffUserRepository;

@Component
@Profile("!test")
public class DemoDataLoader implements ApplicationRunner {

    private final StaffUserRepository users;
    private final LoyaltyLevelRepository levels;
    private final CustomerRepository customers;
    private final PromotionRepository promotions;
    private final ProgramSettingsRepository settings;
    private final BonusTransactionRepository transactions;
    private final LevelTransitionRepository transitions;
    private final AppProperties properties;
    private final PasswordEncoder encoder;

    public DemoDataLoader(
            StaffUserRepository users,
            LoyaltyLevelRepository levels,
            CustomerRepository customers,
            PromotionRepository promotions,
            ProgramSettingsRepository settings,
            BonusTransactionRepository transactions,
            LevelTransitionRepository transitions,
            AppProperties properties,
            PasswordEncoder encoder
    ) {
        this.users = users;
        this.levels = levels;
        this.customers = customers;
        this.promotions = promotions;
        this.settings = settings;
        this.transactions = transactions;
        this.transitions = transitions;
        this.properties = properties;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        ensureAdmin();
        if (levels.count() > 0) {
            return;
        }
        Map<String, LoyaltyLevel> catalog = seedLevels();
        seedCustomers(catalog);
        seedPromotions(catalog);
        seedSettings();
        seedTransactions();
        seedTransitions(catalog);
    }

    private void ensureAdmin() {
        AppProperties.Admin admin = properties.getAdmin();
        users.findByEmailIgnoreCase(admin.getEmail()).ifPresentOrElse(existing -> { }, () -> {
            StaffUser user = new StaffUser();
            user.setEmail(admin.getEmail());
            user.setPasswordHash(encoder.encode(admin.getPassword()));
            user.setName(admin.getName());
            user.setInitials(admin.getInitials());
            user.setRole(admin.getRole());
            user.setPhone(admin.getPhone());
            user.setPasswordChanged(LocalDate.of(2026, 3, 12));
            user.setLastLogin(LocalDate.of(2026, 10, 5).atTime(9, 14));
            users.save(user);
        });
    }

    private Map<String, LoyaltyLevel> seedLevels() {
        List<LoyaltyLevel> created = List.of(
                level("start", "Старт", 0, 1, "#C5D1C3",
                        "Стартовый уровень при регистрации. Начисление — 1% от суммы покупки. Порог перехода на следующий уровень — 5 000 баллов за 12 месяцев."),
                level("regular", "Постоянный", 5000, 3, "#8FA88F",
                        "Уровень для регулярных покупок. Начисление — 3% от суммы покупки. Порог перехода на «Премиум» — 15 000 баллов за 12 месяцев."),
                level("premium", "Премиум", 15000, 5, "#4F7A62",
                        "Порог перехода на уровень «Премиум» — 15 000 баллов за 12 месяцев. Начисление — 5% от суммы покупки."),
                level("vip", "VIP", 30000, 7, "#174D3A",
                        "Максимальный уровень программы. Начисление — 7% от суммы покупки. Порог — 30 000 баллов за 12 месяцев.")
        );
        levels.saveAll(created);
        return Map.of(
                "start", created.get(0),
                "regular", created.get(1),
                "premium", created.get(2),
                "vip", created.get(3)
        );
    }

    private void seedCustomers(Map<String, LoyaltyLevel> catalog) {
        Object[][] rows = {
                {"П-104582", "Анна", "Ковалёва", "premium", 18420, "active", "2026-10-04", 47, "2024-04-12"},
                {"П-104577", "Максим", "Орлов", "vip", 34910, "active", "2026-10-03", 96, "2023-11-02"},
                {"П-104561", "Елена", "Морозова", "regular", 7260, "inactive", "2026-08-12", 18, "2024-09-20"},
                {"П-104549", "Дмитрий", "Соколов", "start", 1180, "active", "2026-10-01", 6, "2026-02-14"},
                {"П-104532", "Виктория", "Романова", "premium", 16050, "blocked", "2026-09-28", 39, "2024-01-18"},
                {"П-104510", "Сергей", "Никитин", "vip", 31200, "active", "2026-10-04", 86, "2023-08-09"},
                {"П-104488", "Ольга", "Белова", "premium", 17240, "active", "2026-09-30", 41, "2024-06-03"},
                {"П-104470", "Павел", "Егоров", "regular", 6400, "active", "2026-09-22", 19, "2025-01-27"},
                {"П-104455", "Мария", "Кузнецова", "start", 890, "inactive", "2026-07-14", 4, "2025-11-11"},
                {"П-104441", "Игорь", "Лебедев", "premium", 19880, "blocked", "2026-09-02", 52, "2024-02-08"},
                {"П-104420", "Наталья", "Соколова", "regular", 8120, "active", "2026-10-01", 27, "2024-12-16"},
                {"П-104401", "Артём", "Волков", "start", 240, "active", "2026-10-05", 2, "2026-09-01"},
                {"П-104388", "Светлана", "Павлова", "vip", 40120, "active", "2026-09-29", 110, "2023-05-22"},
                {"П-104360", "Кирилл", "Новиков", "regular", 4550, "inactive", "2026-06-18", 11, "2025-03-30"},
                {"П-104344", "Юлия", "Федорова", "premium", 15110, "active", "2026-09-25", 33, "2024-08-19"},
                {"П-104320", "Роман", "Алексеев", "start", 3100, "active", "2026-08-30", 9, "2025-07-07"},
                {"П-104301", "Татьяна", "Орлова", "regular", 9900, "blocked", "2026-09-11", 22, "2024-10-05"},
                {"П-104288", "Андрей", "Морозов", "vip", 28750, "active", "2026-10-02", 74, "2023-12-28"},
                {"П-104270", "Екатерина", "Соловьёва", "premium", 13340, "inactive", "2026-05-20", 18, "2025-02-02"},
                {"П-104255", "Никита", "Васильев", "start", 150, "active", "2026-10-03", 1, "2026-08-16"},
                {"П-104240", "Алина", "Громова", "regular", 5680, "active", "2026-09-18", 15, "2025-04-21"},
                {"П-104228", "Денис", "Комаров", "start", 2040, "active", "2026-09-08", 7, "2025-09-14"},
                {"П-104211", "Полина", "Зайцева", "premium", 22150, "active", "2026-10-02", 58, "2024-03-11"},
                {"П-104198", "Илья", "Семёнов", "vip", 33640, "inactive", "2026-04-02", 64, "2023-09-30"}
        };
        int index = 0;
        for (Object[] row : rows) {
            Customer customer = new Customer();
            customer.setId((String) row[0]);
            customer.setFirstName((String) row[1]);
            customer.setLastName((String) row[2]);
            customer.setStatus((String) row[5]);
            customer.setRegistered(LocalDate.parse((String) row[8]));
            customer.setPhone(phone(index));
            customer.setEmail(email((String) row[1], index + 1));
            LoyaltyAccount account = new LoyaltyAccount();
            account.setLevel(catalog.get((String) row[3]));
            account.setPoints((Integer) row[4]);
            account.setPurchases((Integer) row[7]);
            account.setLastActivity(LocalDate.parse((String) row[6]));
            customer.setAccount(account);
            customers.save(customer);
            index++;
        }
    }

    private void seedPromotions(Map<String, LoyaltyLevel> catalog) {
        promotions.saveAll(List.of(
                promotion("promo-extra", "Дополнительные бонусы за покупки", "active", null,
                        "2026-09-01", "2026-11-30", 2,
                        "Дополнительно 2% бонусов при покупке от 100 000 ₽ в категориях «Одежда» и «Обувь». Условие суммируется с базовым процентом уровня."),
                promotion("promo-level", "Бонус за достижение нового уровня", "scheduled", catalog.get("premium"),
                        "2026-11-01", "2026-12-31", 500,
                        "Единовременное начисление при переходе на уровень «Премиум» или «VIP». Бонус применяется при ближайшем пересчёте уровней."),
                promotion("promo-personal", "Персональное предложение", "finished", catalog.get("regular"),
                        "2026-03-01", "2026-08-31", 4,
                        "Индивидуальные условия для участников уровня «Постоянный»: 4% вместо базовых 3% в период действия акции.")
        ));
    }

    private void seedSettings() {
        ProgramSettings entity = new ProgramSettings();
        entity.setId(1);
        entity.setProgramName("Программа лояльности");
        entity.setCurrency("BYN");
        entity.setBonusUnit("балл");
        entity.setRecalcPeriod("monthly");
        entity.setSessionMinutes("30");
        entity.setTwoFactor(false);
        entity.setSince("01.03.2024");
        entity.setBonusLifetime("12 месяцев");
        entity.setNextRecalc("01.11.2026 в 03:00");
        entity.setNoticeSystem(true);
        entity.setNoticeEmail(false);
        settings.save(entity);
    }

    private void seedTransactions() {
        Object[][] rows = {
                {"op-901", "П-104582", 420, "Начисление", "2026-10-04", "Покупка Ч-88341", "done", "Покупка"},
                {"op-902", "П-104577", -1500, "Списание", "2026-10-03", "Оплата бонусами", "done", "Списание"},
                {"op-903", "П-104549", 80, "Начисление", "2026-10-01", "Дополнительные бонусы за покупки", "processing", "Акция"},
                {"op-904", "П-104561", 200, "Начисление", "2026-08-12", "Бонус за достижение нового уровня", "error", "Акция"},
                {"op-905", "П-104532", -300, "Списание", "2026-09-28", "Отмена покупки Ч-87902", "cancelled", "Списание"},
                {"op-906", "П-104388", 960, "Начисление", "2026-09-29", "Покупка Ч-88110", "done", "Покупка"},
                {"op-907", "П-104211", 540, "Начисление", "2026-10-02", "Дополнительные бонусы за покупки", "done", "Акция"},
                {"op-908", "П-104420", -120, "Списание", "2026-10-01", "Оплата бонусами", "processing", "Списание"},
                {"op-909", "П-104288", 710, "Начисление", "2026-10-02", "Покупка Ч-88402", "done", "Покупка"},
                {"op-910", "П-104441", 150, "Начисление", "2026-09-02", "Корректировка начисления", "error", "Начисление"},
                {"op-911", "П-104401", 24, "Начисление", "2026-10-05", "Покупка Ч-88490", "done", "Покупка"},
                {"op-912", "П-104301", -80, "Списание", "2026-09-11", "Сгорание бонусов", "cancelled", "Списание"},
                {"op-913", "П-104510", 880, "Начисление", "2026-09-15", "Покупка Ч-88011", "done", "Покупка"},
                {"op-914", "П-104488", -400, "Списание", "2026-09-20", "Оплата бонусами", "done", "Списание"},
                {"op-915", "П-104470", 190, "Начисление", "2026-08-22", "Покупка Ч-87640", "done", "Покупка"},
                {"op-916", "П-104240", 160, "Начисление", "2026-07-18", "Покупка Ч-87002", "done", "Покупка"},
                {"op-917", "П-104344", 410, "Начисление", "2026-06-25", "Покупка Ч-86811", "done", "Покупка"},
                {"op-918", "П-104198", -700, "Списание", "2026-05-02", "Оплата бонусами", "done", "Списание"}
        };
        for (Object[] row : rows) {
            BonusTransaction transaction = new BonusTransaction();
            transaction.setId((String) row[0]);
            transaction.setCustomer(customers.getReferenceById((String) row[1]));
            transaction.setAmount((Integer) row[2]);
            transaction.setType((String) row[3]);
            transaction.setOperationDate(LocalDate.parse((String) row[4]));
            transaction.setReason((String) row[5]);
            transaction.setStatus((String) row[6]);
            transaction.setEventName((String) row[7]);
            transactions.save(transaction);
        }
    }

    private void seedTransitions(Map<String, LoyaltyLevel> catalog) {
        Object[][] rows = {
                {"П-104582", "regular", "premium", "2025-11-04"},
                {"П-104577", "premium", "vip", "2025-08-12"},
                {"П-104549", "start", "start", "2026-02-14"},
                {"П-104470", "start", "regular", "2025-09-01"},
                {"П-104211", "regular", "premium", "2025-12-20"}
        };
        for (Object[] row : rows) {
            if (row[1].equals(row[2])) {
                continue;
            }
            LevelTransition item = new LevelTransition();
            item.setCustomer(customers.getReferenceById((String) row[0]));
            item.setFromLevel(catalog.get((String) row[1]));
            item.setToLevel(catalog.get((String) row[2]));
            item.setChangedAt(LocalDate.parse((String) row[3]));
            transitions.save(item);
        }
    }

    private LoyaltyLevel level(String id, String name, int points, int percent, String color, String description) {
        LoyaltyLevel level = new LoyaltyLevel();
        level.setId(id);
        level.setName(name);
        level.setThresholdPoints(points);
        level.setAccrualPercent(percent);
        level.setColor(color);
        level.setEffectiveFrom(LocalDate.of(2024, 3, 1));
        level.setDescription(description);
        return level;
    }

    private Promotion promotion(
            String id,
            String name,
            String status,
            LoyaltyLevel level,
            String start,
            String end,
            int bonus,
            String description
    ) {
        Promotion promotion = new Promotion();
        promotion.setId(id);
        promotion.setName(name);
        promotion.setStatus(status);
        promotion.setLevel(level);
        promotion.setStartDate(LocalDate.parse(start));
        promotion.setEndDate(LocalDate.parse(end));
        promotion.setBonusValue(BigDecimal.valueOf(bonus));
        promotion.setDescription(description);
        return promotion;
    }

    private String phone(int index) {
        String digits = String.valueOf(9_001_120_000L + index * 137L);
        return "+7 " + digits.substring(0, 3) + " " + digits.substring(3, 6) + "-"
                + digits.substring(6, 8) + "-" + digits.substring(8, 10);
    }

    private String email(String first, int index) {
        Map<String, String> map = Map.ofEntries(
                Map.entry("Анна", "anna"),
                Map.entry("Максим", "maxim"),
                Map.entry("Елена", "elena"),
                Map.entry("Дмитрий", "dmitry"),
                Map.entry("Виктория", "victoria"),
                Map.entry("Сергей", "sergey"),
                Map.entry("Ольга", "olga"),
                Map.entry("Павел", "pavel"),
                Map.entry("Мария", "maria"),
                Map.entry("Игорь", "igor"),
                Map.entry("Наталья", "natalia"),
                Map.entry("Артём", "artem"),
                Map.entry("Светлана", "svetlana"),
                Map.entry("Кирилл", "kirill"),
                Map.entry("Юлия", "yulia"),
                Map.entry("Роман", "roman"),
                Map.entry("Татьяна", "tatiana"),
                Map.entry("Андрей", "andrey"),
                Map.entry("Екатерина", "ekaterina"),
                Map.entry("Никита", "nikita"),
                Map.entry("Алина", "alina"),
                Map.entry("Денис", "denis"),
                Map.entry("Полина", "polina"),
                Map.entry("Илья", "ilya")
        );
        return map.getOrDefault(first, "user" + index) + "." + index + "@loyalty.local";
    }
}
