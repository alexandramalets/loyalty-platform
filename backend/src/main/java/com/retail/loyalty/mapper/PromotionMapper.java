package com.retail.loyalty.mapper;

import org.springframework.stereotype.Component;

import com.retail.loyalty.domain.Promotion;
import com.retail.loyalty.dto.PromotionResponse;

@Component
public class PromotionMapper {

    private final DateMapper dates;

    public PromotionMapper(DateMapper dates) {
        this.dates = dates;
    }

    public PromotionResponse toResponse(Promotion promotion) {
        return new PromotionResponse(
                promotion.getId(),
                promotion.getName(),
                promotion.getStatus(),
                promotion.getLevel() == null ? "all" : promotion.getLevel().getId(),
                dates.format(promotion.getStartDate()),
                dates.format(promotion.getEndDate()),
                promotion.getBonusValue().doubleValue(),
                promotion.getDescription()
        );
    }
}
