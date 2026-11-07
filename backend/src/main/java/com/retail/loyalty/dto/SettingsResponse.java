package com.retail.loyalty.dto;

public record SettingsResponse(
        String programName,
        String currency,
        String bonusUnit,
        String recalcPeriod,
        String sessionMinutes,
        boolean twoFactor,
        String since,
        String accrualLabel,
        String bonusLifetime,
        String recalcLabel,
        String nextRecalc,
        Notices notices
) {
    public record Notices(boolean system, boolean email) {
    }
}
