package com.retail.loyalty.dto;

public record PromotionResponse(
        String id,
        String name,
        String status,
        String levelId,
        String start,
        String end,
        double bonusPercent,
        String description
) {
}
