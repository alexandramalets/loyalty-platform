package com.retail.loyalty.dto;

public record CustomerResponse(
        String id,
        String firstName,
        String lastName,
        String name,
        String phone,
        String email,
        String status,
        String registered,
        String levelId,
        int points,
        int purchases,
        String lastActivity
) {
}
