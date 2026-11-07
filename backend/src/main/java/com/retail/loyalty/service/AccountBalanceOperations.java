package com.retail.loyalty.service;

import java.time.LocalDate;

import com.retail.loyalty.domain.LoyaltyAccount;

public interface AccountBalanceOperations {

    void credit(LoyaltyAccount account, int amount, LocalDate activityDate, boolean countPurchase);

    void debit(LoyaltyAccount account, int amount, LocalDate activityDate);
}
