package com.retail.loyalty.dto;

public record LoyaltyAccountResponse(
        Long id,
        String customerId,
        String customerName,
        String levelId,
        String levelName,
        int points,
        int purchases,
        String lastActivity
) {
}
