package com.retail.loyalty.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.retail.loyalty.dto.AccrualRequest;
import com.retail.loyalty.dto.TransactionResponse;
import com.retail.loyalty.dto.WriteOffRequest;
import com.retail.loyalty.service.BonusTransactionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Бонусные операции")
public class TransactionController {

    private final BonusTransactionService transactions;

    public TransactionController(BonusTransactionService transactions) {
        this.transactions = transactions;
    }

    @GetMapping
    @Operation(summary = "Получить историю операций")
    public List<TransactionResponse> list() {
        return transactions.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить операцию")
    public TransactionResponse get(@PathVariable String id) {
        return transactions.find(id);
    }

    @PostMapping("/accrual")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Начислить бонусы")
    public TransactionResponse accrue(@Valid @RequestBody AccrualRequest request) {
        return transactions.accrue(request);
    }

    @PostMapping("/write-off")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Списать бонусы")
    public TransactionResponse writeOff(@Valid @RequestBody WriteOffRequest request) {
        return transactions.writeOff(request);
    }
}
