package com.retail.loyalty.service.strategy;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.retail.loyalty.exception.BadRequestException;

@Component
public class BonusCalculationDispatcher {

    private final Map<String, BonusCalculationStrategy> strategies;

    public BonusCalculationDispatcher(List<BonusCalculationStrategy> strategies) {
        this.strategies = strategies.stream()
                .collect(Collectors.toUnmodifiableMap(item -> item.code().toUpperCase(Locale.ROOT), Function.identity()));
    }

    public int calculate(BonusCalculationContext context) {
        String code = context.request().strategy() == null
                ? ""
                : context.request().strategy().trim().toUpperCase(Locale.ROOT);
        BonusCalculationStrategy strategy = strategies.get(code);
        if (strategy == null) {
            throw new BadRequestException("Неизвестная стратегия начисления: " + context.request().strategy());
        }
        return strategy.calculate(context);
    }
}
