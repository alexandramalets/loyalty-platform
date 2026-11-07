package com.retail.loyalty.service.strategy;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Component;

import com.retail.loyalty.domain.Promotion;
import com.retail.loyalty.exception.BadRequestException;
import com.retail.loyalty.repository.PromotionRepository;

@Component
public class PurchasePercentAccrualStrategy implements BonusCalculationStrategy {

    private final PromotionRepository promotions;

    public PurchasePercentAccrualStrategy(PromotionRepository promotions) {
        this.promotions = promotions;
    }

    @Override
    public String code() {
        return "PURCHASE";
    }

    @Override
    public int calculate(BonusCalculationContext context) {
        Integer purchaseAmount = context.request().purchaseAmount();
        if (purchaseAmount == null || purchaseAmount <= 0) {
            throw new BadRequestException("Для начисления от покупки укажите сумму покупки");
        }
        int percent = context.level().getAccrualPercent() + extraPercent(context.level().getId());
        return Math.max(1, purchaseAmount * percent / 100);
    }

    private int extraPercent(String levelId) {
        return promotions.findActiveForLevel(levelId, LocalDate.now()).stream()
                .map(Promotion::getBonusValue)
                .filter(value -> value.compareTo(BigDecimal.valueOf(100)) <= 0)
                .mapToInt(BigDecimal::intValue)
                .sum();
    }
}
