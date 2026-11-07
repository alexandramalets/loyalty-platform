package com.retail.loyalty.mapper;

import org.springframework.stereotype.Component;

import com.retail.loyalty.domain.BonusTransaction;
import com.retail.loyalty.dto.TransactionResponse;

@Component
public class TransactionMapper {

    private final DateMapper dates;

    public TransactionMapper(DateMapper dates) {
        this.dates = dates;
    }

    public TransactionResponse toResponse(BonusTransaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getCustomer().getId(),
                transaction.getCustomer().getFullName(),
                transaction.getAmount(),
                transaction.getType(),
                dates.format(transaction.getOperationDate()),
                transaction.getReason(),
                transaction.getStatus(),
                transaction.getEventName()
        );
    }
}
