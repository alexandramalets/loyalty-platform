package com.retail.loyalty.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PromotionRequest(
        @NotBlank @Size(max = 180) String name,
        @NotBlank @Pattern(regexp = "active|scheduled|paused|finished") String status,
        String levelId,
        @NotBlank String start,
        @NotBlank String end,
        @NotNull @DecimalMin("0") Double bonusPercent,
        @Size(max = 500) String description
) {
}
