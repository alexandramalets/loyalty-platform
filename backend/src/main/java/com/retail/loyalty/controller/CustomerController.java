package com.retail.loyalty.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.retail.loyalty.dto.CustomerRequest;
import com.retail.loyalty.dto.CustomerResponse;
import com.retail.loyalty.dto.LoyaltyAccountResponse;
import com.retail.loyalty.dto.TransactionResponse;
import com.retail.loyalty.service.BonusTransactionService;
import com.retail.loyalty.service.CustomerService;
import com.retail.loyalty.service.LoyaltyAccountService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Покупатели")
public class CustomerController {

    private final CustomerService customers;
    private final LoyaltyAccountService accounts;
    private final BonusTransactionService transactions;

    public CustomerController(
            CustomerService customers,
            LoyaltyAccountService accounts,
            BonusTransactionService transactions
    ) {
        this.customers = customers;
        this.accounts = accounts;
        this.transactions = transactions;
    }

    @GetMapping
    @Operation(summary = "Получить список покупателей")
    public List<CustomerResponse> list() {
        return customers.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить покупателя по ID")
    public CustomerResponse get(@PathVariable String id) {
        return customers.find(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать покупателя")
    public CustomerResponse create(@Valid @RequestBody CustomerRequest request) {
        return customers.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить данные покупателя")
    public CustomerResponse update(@PathVariable String id, @Valid @RequestBody CustomerRequest request) {
        return customers.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить покупателя")
    public void delete(@PathVariable String id) {
        customers.delete(id);
    }

    @GetMapping("/{id}/loyalty-account")
    @Operation(summary = "Получить бонусный счёт покупателя")
    public LoyaltyAccountResponse account(@PathVariable String id) {
        return accounts.findByCustomer(id);
    }

    @GetMapping("/{id}/transactions")
    @Operation(summary = "История бонусных операций покупателя")
    public List<TransactionResponse> history(@PathVariable String id) {
        return transactions.findByCustomer(id);
    }
}
