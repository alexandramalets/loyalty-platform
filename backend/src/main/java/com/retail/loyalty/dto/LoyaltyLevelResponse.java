package com.retail.loyalty.dto;

public record LoyaltyLevelResponse(
        String id,
        String name,
        int points,
        int percent,
        long participants,
        String color,
        String effectiveFrom,
        String description
) {
}
