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

import com.retail.loyalty.dto.PromotionRequest;
import com.retail.loyalty.dto.PromotionResponse;
import com.retail.loyalty.service.PromotionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/promotions")
@Tag(name = "Акции")
public class PromotionController {

    private final PromotionService promotions;

    public PromotionController(PromotionService promotions) {
        this.promotions = promotions;
    }

    @GetMapping
    @Operation(summary = "Получить список акций")
    public List<PromotionResponse> list() {
        return promotions.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить акцию")
    public PromotionResponse get(@PathVariable String id) {
        return promotions.find(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать акцию")
    public PromotionResponse create(@Valid @RequestBody PromotionRequest request) {
        return promotions.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить акцию")
    public PromotionResponse update(@PathVariable String id, @Valid @RequestBody PromotionRequest request) {
        return promotions.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить акцию")
    public void delete(@PathVariable String id) {
        promotions.delete(id);
    }
}
