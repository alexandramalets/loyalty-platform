package com.retail.loyalty.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retail.loyalty.dto.SettingsRequest;
import com.retail.loyalty.dto.SettingsResponse;
import com.retail.loyalty.service.SettingsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Настройки программы")
public class SettingsController {

    private final SettingsService settings;

    public SettingsController(SettingsService settings) {
        this.settings = settings;
    }

    @GetMapping
    @Operation(summary = "Получить настройки программы")
    public SettingsResponse get() {
        return settings.get();
    }

    @PutMapping
    @Operation(summary = "Обновить настройки программы")
    public SettingsResponse update(@Valid @RequestBody SettingsRequest request) {
        return settings.update(request);
    }
}
