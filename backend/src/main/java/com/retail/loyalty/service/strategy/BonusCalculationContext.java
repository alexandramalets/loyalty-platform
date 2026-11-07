package com.retail.loyalty.service.strategy;

import com.retail.loyalty.domain.LoyaltyAccount;
import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.dto.AccrualRequest;

public record BonusCalculationContext(
        AccrualRequest request,
        LoyaltyAccount account,
        LoyaltyLevel level
) {
}
