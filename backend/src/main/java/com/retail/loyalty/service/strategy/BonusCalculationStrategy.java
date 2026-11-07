package com.retail.loyalty.service.strategy;

public interface BonusCalculationStrategy {

    String code();

    int calculate(BonusCalculationContext context);
}
