package com.retail.loyalty.dto;

public record UserResponse(
        String name,
        String initials,
        String role,
        String email,
        String phone,
        String lastLogin,
        String passwordChanged
) {
}
