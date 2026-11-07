package com.retail.loyalty.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "level_transition")
public class LevelTransition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_level_id", nullable = false)
    private LoyaltyLevel fromLevel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_level_id", nullable = false)
    private LoyaltyLevel toLevel;

    @Column(name = "changed_at", nullable = false)
    private LocalDate changedAt;

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LoyaltyLevel getFromLevel() {
        return fromLevel;
    }

    public void setFromLevel(LoyaltyLevel fromLevel) {
        this.fromLevel = fromLevel;
    }

    public LoyaltyLevel getToLevel() {
        return toLevel;
    }

    public void setToLevel(LoyaltyLevel toLevel) {
        this.toLevel = toLevel;
    }

    public LocalDate getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDate changedAt) {
        this.changedAt = changedAt;
    }
}
