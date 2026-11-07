package com.retail.loyalty.service;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class CodeGenerator {

    private final AtomicLong fallback = new AtomicLong(System.currentTimeMillis() % 1_000_000_000L);
    private final JdbcTemplate jdbc;

    public CodeGenerator(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public String nextCustomerId() {
        return "П-" + next("customer_code_seq");
    }

    public String nextTransactionId() {
        return "op-" + next("transaction_code_seq");
    }

    public String nextPromotionId() {
        return "promo-" + next("promotion_code_seq");
    }

    public String nextLevelId() {
        return "level-" + next("level_code_seq");
    }

    private long next(String sequence) {
        try {
            Long value = jdbc.queryForObject("select nextval('" + sequence + "')", Long.class);
            if (value != null) {
                return value;
            }
        } catch (DataAccessException ignored) {
            // H2 in tests may not have PostgreSQL sequences from Flyway.
        }
        return fallback.incrementAndGet();
    }
}
