package com.retail.loyalty.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.Customer;
import com.retail.loyalty.domain.LoyaltyAccount;
import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.dto.AccrualRequest;
import com.retail.loyalty.dto.CustomerRequest;
import com.retail.loyalty.dto.LoyaltyLevelRequest;
import com.retail.loyalty.dto.TransactionResponse;
import com.retail.loyalty.dto.WriteOffRequest;
import com.retail.loyalty.exception.ConflictException;
import com.retail.loyalty.exception.NotFoundException;
import com.retail.loyalty.repository.CustomerRepository;
import com.retail.loyalty.repository.LoyaltyLevelRepository;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class BonusTransactionServiceTest {

    @Autowired
    private BonusTransactionService transactions;

    @Autowired
    private CustomerService customers;

    @Autowired
    private LoyaltyLevelService levels;

    @Autowired
    private LoyaltyLevelRepository levelRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private LoyaltyAccountService accounts;

    @BeforeEach
    void setUp() {
        if (levelRepository.findAll().isEmpty()) {
            levels.create(new LoyaltyLevelRequest("Старт", 0, 1, "#C5D1C3", "2024-03-01", "Старт"));
            levels.create(new LoyaltyLevelRequest("Постоянный", 5000, 3, "#8FA88F", "2024-03-01", "Регулярный"));
        }
    }

    @Test
    void accrueIncreasesBalanceAndMayChangeLevel() {
        var customer = customers.create(new CustomerRequest("Анна", "Тестова", "+7 900 000-00-01", "anna@test.local", "active"));
        TransactionResponse result = transactions.accrue(new AccrualRequest(
                customer.id(), "FIXED", 5200, null, "Корректировка начисления"
        ));
        assertThat(result.amount()).isEqualTo(5200);
        assertThat(result.type()).isEqualTo("Начисление");
        var account = accounts.findByCustomer(customer.id());
        assertThat(account.points()).isEqualTo(5200);
        assertThat(account.levelName()).isEqualTo("Постоянный");
    }

    @Test
    void writeOffRejectsAmountGreaterThanBalance() {
        var customer = customers.create(new CustomerRequest("Игорь", "Тестов", "+7 900 000-00-02", "igor@test.local", "active"));
        transactions.accrue(new AccrualRequest(customer.id(), "FIXED", 100, null, "Начисление"));
        assertThatThrownBy(() -> transactions.writeOff(new WriteOffRequest(customer.id(), 250, "Оплата бонусами")))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Недостаточно баллов");
        assertThat(accounts.findByCustomer(customer.id()).points()).isEqualTo(100);
    }

    @Test
    void writeOffDecreasesBalance() {
        var customer = customers.create(new CustomerRequest("Ольга", "Тестова", "+7 900 000-00-03", "olga@test.local", "active"));
        transactions.accrue(new AccrualRequest(customer.id(), "FIXED", 300, null, "Начисление"));
        TransactionResponse result = transactions.writeOff(new WriteOffRequest(customer.id(), 120, "Оплата бонусами"));
        assertThat(result.amount()).isEqualTo(-120);
        assertThat(accounts.findByCustomer(customer.id()).points()).isEqualTo(180);
    }

    @Test
    void unknownCustomerIsNotFound() {
        assertThatThrownBy(() -> transactions.accrue(new AccrualRequest("П-000", "FIXED", 10, null, "Тест")))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void blockedCustomerCannotOperate() {
        var created = customers.create(new CustomerRequest("Виктор", "Блок", "+7 900 000-00-04", "block@test.local", "active"));
        customers.update(created.id(), new CustomerRequest("Виктор", "Блок", "+7 900 000-00-04", "block@test.local", "blocked"));
        assertThatThrownBy(() -> transactions.accrue(new AccrualRequest(created.id(), "FIXED", 10, null, "Тест")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void purchaseStrategyUsesLevelPercent() {
        var customer = customers.create(new CustomerRequest("Ника", "Покупкина", "+7 900 000-00-05", "nika@test.local", "active"));
        TransactionResponse result = transactions.accrue(new AccrualRequest(
                customer.id(), "PURCHASE", null, 10000, "Покупка Ч-1"
        ));
        assertThat(result.amount()).isEqualTo(100);
        Customer stored = customerRepository.findById(customer.id()).orElseThrow();
        LoyaltyAccount account = stored.getAccount();
        LoyaltyLevel level = account.getLevel();
        assertThat(level.getAccrualPercent()).isEqualTo(1);
        assertThat(account.getPurchases()).isEqualTo(1);
        assertThat(account.getLastActivity()).isEqualTo(LocalDate.now());
    }
}
