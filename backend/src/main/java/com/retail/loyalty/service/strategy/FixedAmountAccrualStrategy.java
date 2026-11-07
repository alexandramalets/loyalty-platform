package com.retail.loyalty.service.strategy;

import org.springframework.stereotype.Component;

import com.retail.loyalty.exception.BadRequestException;

@Component
public class FixedAmountAccrualStrategy implements BonusCalculationStrategy {

    @Override
    public String code() {
        return "FIXED";
    }

    @Override
    public int calculate(BonusCalculationContext context) {
        Integer amount = context.request().amount();
        if (amount == null || amount <= 0) {
            throw new BadRequestException("Для фиксированного начисления укажите положительную сумму баллов");
        }
        return amount;
    }
}
