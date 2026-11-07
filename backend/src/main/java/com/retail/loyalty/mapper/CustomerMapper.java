package com.retail.loyalty.mapper;

import org.springframework.stereotype.Component;

import com.retail.loyalty.domain.Customer;
import com.retail.loyalty.domain.LoyaltyAccount;
import com.retail.loyalty.dto.CustomerResponse;
import com.retail.loyalty.dto.LoyaltyAccountResponse;

@Component
public class CustomerMapper {

    private final DateMapper dates;

    public CustomerMapper(DateMapper dates) {
        this.dates = dates;
    }

    public CustomerResponse toResponse(Customer customer) {
        LoyaltyAccount account = customer.getAccount();
        return new CustomerResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getFullName(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getStatus(),
                dates.format(customer.getRegistered()),
                account == null ? null : account.getLevel().getId(),
                account == null ? 0 : account.getPoints(),
                account == null ? 0 : account.getPurchases(),
                account == null ? null : dates.format(account.getLastActivity())
        );
    }

    public LoyaltyAccountResponse toAccountResponse(LoyaltyAccount account) {
        Customer customer = account.getCustomer();
        return new LoyaltyAccountResponse(
                account.getId(),
                customer.getId(),
                customer.getFullName(),
                account.getLevel().getId(),
                account.getLevel().getName(),
                account.getPoints(),
                account.getPurchases(),
                dates.format(account.getLastActivity())
        );
    }
}
