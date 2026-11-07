package com.retail.loyalty.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "loyalty_level")
public class LoyaltyLevel {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "threshold_points", nullable = false, unique = true)
    private int thresholdPoints;

    @Column(name = "accrual_percent", nullable = false)
    private int accrualPercent;

    @Column(nullable = false)
    private String color;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(nullable = false, length = 500)
    private String description;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getThresholdPoints() {
        return thresholdPoints;
    }

    public void setThresholdPoints(int thresholdPoints) {
        this.thresholdPoints = thresholdPoints;
    }

    public int getAccrualPercent() {
        return accrualPercent;
    }

    public void setAccrualPercent(int accrualPercent) {
        this.accrualPercent = accrualPercent;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public LocalDate getEffectiveFrom() {
        return effectiveFrom;
    }

    public void setEffectiveFrom(LocalDate effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
