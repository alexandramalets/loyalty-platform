package com.retail.loyalty.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AccrualRequest(
        @NotBlank String customerId,
        @NotBlank String strategy,
        @Min(0) Integer amount,
        @Min(0) Integer purchaseAmount,
        @NotBlank @Size(max = 255) String reason
) {
}
