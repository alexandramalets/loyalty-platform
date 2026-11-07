package com.retail.loyalty.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @NotBlank @Size(max = 32) String phone,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Pattern(regexp = "active|inactive|blocked", message = "Допустимые статусы: active, inactive, blocked")
        String status
) {
}
