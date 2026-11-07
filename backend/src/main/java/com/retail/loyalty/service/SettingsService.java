package com.retail.loyalty.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.domain.ProgramSettings;
import com.retail.loyalty.dto.SettingsRequest;
import com.retail.loyalty.dto.SettingsResponse;
import com.retail.loyalty.exception.NotFoundException;
import com.retail.loyalty.repository.LoyaltyLevelRepository;
import com.retail.loyalty.repository.ProgramSettingsRepository;

@Service
@Transactional
public class SettingsService {

    private final ProgramSettingsRepository settings;
    private final LoyaltyLevelRepository levels;

    public SettingsService(ProgramSettingsRepository settings, LoyaltyLevelRepository levels) {
        this.settings = settings;
        this.levels = levels;
    }

    @Transactional(readOnly = true)
    public SettingsResponse get() {
        return toResponse(require());
    }

    public SettingsResponse update(SettingsRequest request) {
        ProgramSettings entity = require();
        entity.setProgramName(request.programName().trim());
        entity.setCurrency(request.currency());
        entity.setBonusUnit(request.bonusUnit());
        entity.setRecalcPeriod(request.recalcPeriod());
        entity.setSessionMinutes(request.sessionMinutes());
        entity.setTwoFactor(request.twoFactor());
        if (request.bonusLifetime() != null && !request.bonusLifetime().isBlank()) {
            entity.setBonusLifetime(request.bonusLifetime());
        }
        if (request.nextRecalc() != null && !request.nextRecalc().isBlank()) {
            entity.setNextRecalc(request.nextRecalc());
        }
        entity.setNoticeSystem(request.noticeSystem());
        entity.setNoticeEmail(request.noticeEmail());
        return toResponse(settings.save(entity));
    }

    private ProgramSettings require() {
        return settings.findById(1)
                .orElseThrow(() -> new NotFoundException("Настройки программы не найдены"));
    }

    private SettingsResponse toResponse(ProgramSettings entity) {
        return new SettingsResponse(
                entity.getProgramName(),
                entity.getCurrency(),
                entity.getBonusUnit(),
                entity.getRecalcPeriod(),
                entity.getSessionMinutes(),
                entity.isTwoFactor(),
                entity.getSince(),
                accrualLabel(),
                entity.getBonusLifetime(),
                recalcLabel(entity.getRecalcPeriod()),
                entity.getNextRecalc(),
                new SettingsResponse.Notices(entity.isNoticeSystem(), entity.isNoticeEmail())
        );
    }

    private String accrualLabel() {
        var ordered = levels.findAllByOrderByThresholdPointsAsc();
        if (ordered.isEmpty()) {
            return "1–7% от суммы покупки";
        }
        int min = ordered.stream().mapToInt(LoyaltyLevel::getAccrualPercent).min().orElse(0);
        int max = ordered.stream().mapToInt(LoyaltyLevel::getAccrualPercent).max().orElse(0);
        return min + "–" + max + "% от суммы покупки";
    }

    private String recalcLabel(String period) {
        return switch (period) {
            case "monthly" -> "ежемесячно, 1-го числа";
            case "quarterly" -> "ежеквартально";
            case "yearly" -> "ежегодно";
            default -> period;
        };
    }
}
