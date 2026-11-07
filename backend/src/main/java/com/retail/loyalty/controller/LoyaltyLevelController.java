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

import com.retail.loyalty.dto.LoyaltyLevelRequest;
import com.retail.loyalty.dto.LoyaltyLevelResponse;
import com.retail.loyalty.service.LoyaltyLevelService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/loyalty-levels")
@Tag(name = "Уровни лояльности")
public class LoyaltyLevelController {

    private final LoyaltyLevelService levels;

    public LoyaltyLevelController(LoyaltyLevelService levels) {
        this.levels = levels;
    }

    @GetMapping
    @Operation(summary = "Получить все уровни")
    public List<LoyaltyLevelResponse> list() {
        return levels.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить уровень")
    public LoyaltyLevelResponse get(@PathVariable String id) {
        return levels.find(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать уровень")
    public LoyaltyLevelResponse create(@Valid @RequestBody LoyaltyLevelRequest request) {
        return levels.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Изменить уровень")
    public LoyaltyLevelResponse update(@PathVariable String id, @Valid @RequestBody LoyaltyLevelRequest request) {
        return levels.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить уровень")
    public void delete(@PathVariable String id) {
        levels.delete(id);
    }
}
