package com.retail.loyalty.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.retail.loyalty.dto.AnalyticsResponse;
import com.retail.loyalty.service.AnalyticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Аналитика")
public class AnalyticsController {

    private final AnalyticsService analytics;

    public AnalyticsController(AnalyticsService analytics) {
        this.analytics = analytics;
    }

    @GetMapping
    @Operation(summary = "Сводка показателей программы за период")
    public AnalyticsResponse get(@RequestParam(defaultValue = "6") int period) {
        return analytics.build(period);
    }
}
