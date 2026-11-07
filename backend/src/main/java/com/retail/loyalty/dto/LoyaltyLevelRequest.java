package com.retail.loyalty.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LoyaltyLevelRequest(
        @NotBlank @Size(max = 120) String name,
        @NotNull @Min(0) Integer points,
        @NotNull @Min(0) @Max(100) Integer percent,
        String color,
        @NotBlank String effectiveFrom,
        @Size(max = 500) String description
) {
}
