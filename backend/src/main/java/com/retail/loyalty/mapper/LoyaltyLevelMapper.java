package com.retail.loyalty.mapper;

import org.springframework.stereotype.Component;

import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.dto.LoyaltyLevelResponse;

@Component
public class LoyaltyLevelMapper {

    private final DateMapper dates;

    public LoyaltyLevelMapper(DateMapper dates) {
        this.dates = dates;
    }

    public LoyaltyLevelResponse toResponse(LoyaltyLevel level, long participants) {
        return new LoyaltyLevelResponse(
                level.getId(),
                level.getName(),
                level.getThresholdPoints(),
                level.getAccrualPercent(),
                participants,
                level.getColor(),
                dates.format(level.getEffectiveFrom()),
                level.getDescription()
        );
    }
}
