package com.retail.loyalty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.retail.loyalty.domain.LoyaltyAccount;

public interface LoyaltyAccountRepository extends JpaRepository<LoyaltyAccount, Long> {

    @Override
    @EntityGraph(attributePaths = {"customer", "level"})
    List<LoyaltyAccount> findAll();

    @Override
    @EntityGraph(attributePaths = {"customer", "level"})
    Optional<LoyaltyAccount> findById(Long id);

    @EntityGraph(attributePaths = {"customer", "level"})
    Optional<LoyaltyAccount> findByCustomerId(String customerId);

    boolean existsByLevelId(String levelId);
}
