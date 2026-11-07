package com.retail.loyalty.dto;

import java.util.List;

public record AnalyticsResponse(
        int periodMonths,
        List<Kpi> kpis,
        Activity activity,
        BonusUsage bonus,
        List<Transition> transitions,
        List<Distribution> distribution,
        String updatedAt
) {
    public record Kpi(String label, String value, String delta, String tone) {
    }

    public record Activity(List<String> labels, List<Long> accrual, List<Long> redeem) {
    }

    public record BonusUsage(long accrued, long spent, long expired, int rate) {
    }

    public record Transition(String from, String to, long count) {
    }

    public record Distribution(String id, String name, long value, String color) {
    }
}
