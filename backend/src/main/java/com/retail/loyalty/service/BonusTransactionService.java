package com.retail.loyalty.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.BonusTransaction;
import com.retail.loyalty.domain.Customer;
import com.retail.loyalty.domain.LoyaltyAccount;
import com.retail.loyalty.dto.AccrualRequest;
import com.retail.loyalty.dto.TransactionResponse;
import com.retail.loyalty.dto.WriteOffRequest;
import com.retail.loyalty.exception.NotFoundException;
import com.retail.loyalty.mapper.TransactionMapper;
import com.retail.loyalty.repository.BonusTransactionRepository;
import com.retail.loyalty.service.strategy.BonusCalculationContext;
import com.retail.loyalty.service.strategy.BonusCalculationDispatcher;

@Service
@Transactional
public class BonusTransactionService {

    private final BonusTransactionRepository transactions;
    private final CustomerService customers;
    private final AccountBalanceOperations balances;
    private final LoyaltyAccountService accounts;
    private final BonusCalculationDispatcher calculator;
    private final TransactionMapper mapper;
    private final CodeGenerator codes;

    public BonusTransactionService(
            BonusTransactionRepository transactions,
            CustomerService customers,
            AccountBalanceOperations balances,
            LoyaltyAccountService accounts,
            BonusCalculationDispatcher calculator,
            TransactionMapper mapper,
            CodeGenerator codes
    ) {
        this.transactions = transactions;
        this.customers = customers;
        this.balances = balances;
        this.accounts = accounts;
        this.calculator = calculator;
        this.mapper = mapper;
        this.codes = codes;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> findAll() {
        return transactions.findAllByOrderByOperationDateDescIdDesc().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TransactionResponse find(String id) {
        return mapper.toResponse(transactions.findById(id)
                .orElseThrow(() -> new NotFoundException("Операция не найдена: " + id)));
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> findByCustomer(String customerId) {
        customers.require(customerId);
        return transactions.findByCustomerIdOrderByOperationDateDescIdDesc(customerId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    public TransactionResponse accrue(AccrualRequest request) {
        Customer customer = customers.require(request.customerId());
        accounts.assertOperable(customer);
        LoyaltyAccount account = accounts.requireByCustomer(customer.getId());
        int amount = calculator.calculate(new BonusCalculationContext(request, account, account.getLevel()));
        LocalDate today = LocalDate.now();
        boolean purchase = "PURCHASE".equalsIgnoreCase(request.strategy());
        balances.credit(account, amount, today, purchase);
        return mapper.toResponse(save(
                customer,
                amount,
                "Начисление",
                request.reason().trim(),
                purchase ? "Покупка" : "Начисление",
                request.purchaseAmount(),
                today
        ));
    }

    public TransactionResponse writeOff(WriteOffRequest request) {
        Customer customer = customers.require(request.customerId());
        accounts.assertOperable(customer);
        LoyaltyAccount account = accounts.requireByCustomer(customer.getId());
        LocalDate today = LocalDate.now();
        balances.debit(account, request.amount(), today);
        return mapper.toResponse(save(
                customer,
                -request.amount(),
                "Списание",
                request.reason().trim(),
                "Списание",
                null,
                today
        ));
    }

    private BonusTransaction save(
            Customer customer,
            int amount,
            String type,
            String reason,
            String event,
            Integer purchaseAmount,
            LocalDate date
    ) {
        BonusTransaction transaction = new BonusTransaction();
        transaction.setId(codes.nextTransactionId());
        transaction.setCustomer(customer);
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setReason(reason);
        transaction.setEventName(event);
        transaction.setStatus("done");
        transaction.setPurchaseAmount(purchaseAmount);
        transaction.setOperationDate(date);
        return transactions.save(transaction);
    }
}
