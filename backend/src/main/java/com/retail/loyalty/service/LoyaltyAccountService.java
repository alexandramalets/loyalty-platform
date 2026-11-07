package com.retail.loyalty.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.Customer;
import com.retail.loyalty.domain.LevelTransition;
import com.retail.loyalty.domain.LoyaltyAccount;
import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.dto.LoyaltyAccountResponse;
import com.retail.loyalty.exception.ConflictException;
import com.retail.loyalty.exception.NotFoundException;
import com.retail.loyalty.mapper.CustomerMapper;
import com.retail.loyalty.repository.LevelTransitionRepository;
import com.retail.loyalty.repository.LoyaltyAccountRepository;

@Service
@Transactional
public class LoyaltyAccountService implements AccountBalanceOperations {

    private final LoyaltyAccountRepository accounts;
    private final LevelTransitionRepository transitions;
    private final LoyaltyLevelService levels;
    private final CustomerMapper mapper;

    public LoyaltyAccountService(
            LoyaltyAccountRepository accounts,
            LevelTransitionRepository transitions,
            LoyaltyLevelService levels,
            CustomerMapper mapper
    ) {
        this.accounts = accounts;
        this.transitions = transitions;
        this.levels = levels;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<LoyaltyAccountResponse> findAll() {
        return accounts.findAll().stream().map(mapper::toAccountResponse).toList();
    }

    @Transactional(readOnly = true)
    public LoyaltyAccountResponse find(Long id) {
        return mapper.toAccountResponse(accounts.findById(id)
                .orElseThrow(() -> new NotFoundException("Бонусный счёт не найден: " + id)));
    }

    @Transactional(readOnly = true)
    public LoyaltyAccountResponse findByCustomer(String customerId) {
        return mapper.toAccountResponse(requireByCustomer(customerId));
    }

    public LoyaltyAccount createFor(Customer customer) {
        LoyaltyLevel start = levels.resolveForPoints(0);
        LoyaltyAccount account = new LoyaltyAccount();
        account.setCustomer(customer);
        account.setLevel(start);
        account.setPoints(0);
        account.setPurchases(0);
        account.setLastActivity(customer.getRegistered());
        customer.setAccount(account);
        return account;
    }

    public LoyaltyAccount requireByCustomer(String customerId) {
        return accounts.findByCustomerId(customerId)
                .orElseThrow(() -> new NotFoundException("Бонусный счёт покупателя не найден: " + customerId));
    }

    public void assertOperable(Customer customer) {
        if ("blocked".equals(customer.getStatus())) {
            throw new ConflictException("Операции по заблокированной карте запрещены");
        }
    }

    @Override
    public void credit(LoyaltyAccount account, int amount, LocalDate activityDate, boolean countPurchase) {
        account.setPoints(account.getPoints() + amount);
        if (countPurchase) {
            account.setPurchases(account.getPurchases() + 1);
        }
        account.setLastActivity(activityDate);
        syncLevel(account, activityDate);
    }

    @Override
    public void debit(LoyaltyAccount account, int amount, LocalDate activityDate) {
        if (amount > account.getPoints()) {
            throw new ConflictException("Недостаточно баллов для списания: доступно " + account.getPoints());
        }
        account.setPoints(account.getPoints() - amount);
        account.setLastActivity(activityDate);
        syncLevel(account, activityDate);
    }

    public void syncLevel(LoyaltyAccount account, LocalDate changedAt) {
        LoyaltyLevel next = levels.resolveForPoints(account.getPoints());
        LoyaltyLevel current = account.getLevel();
        if (current.getId().equals(next.getId())) {
            return;
        }
        LevelTransition transition = new LevelTransition();
        transition.setCustomer(account.getCustomer());
        transition.setFromLevel(current);
        transition.setToLevel(next);
        transition.setChangedAt(changedAt);
        transitions.save(transition);
        account.setLevel(next);
    }
}
