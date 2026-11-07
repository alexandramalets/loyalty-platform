package com.retail.loyalty.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SettingsRequest(
        @NotBlank @Size(max = 180) String programName,
        @NotBlank String currency,
        @NotBlank String bonusUnit,
        @NotBlank String recalcPeriod,
        @NotBlank String sessionMinutes,
        @NotNull Boolean twoFactor,
        String bonusLifetime,
        String nextRecalc,
        @NotNull Boolean noticeSystem,
        @NotNull Boolean noticeEmail
) {
}
