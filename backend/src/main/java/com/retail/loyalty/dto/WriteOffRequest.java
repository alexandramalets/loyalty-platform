package com.retail.loyalty.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record WriteOffRequest(
        @NotBlank String customerId,
        @NotNull @Min(1) Integer amount,
        @NotBlank @Size(max = 255) String reason
) {
}
