package com.retail.loyalty.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retail.loyalty.dto.LoyaltyAccountResponse;
import com.retail.loyalty.service.LoyaltyAccountService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/loyalty-accounts")
@Tag(name = "Бонусные счета")
public class LoyaltyAccountController {

    private final LoyaltyAccountService accounts;

    public LoyaltyAccountController(LoyaltyAccountService accounts) {
        this.accounts = accounts;
    }

    @GetMapping
    @Operation(summary = "Получить бонусные счета")
    public List<LoyaltyAccountResponse> list() {
        return accounts.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить счёт")
    public LoyaltyAccountResponse get(@PathVariable Long id) {
        return accounts.find(id);
    }
}
