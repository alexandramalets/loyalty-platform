package com.retail.loyalty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retail.loyalty.domain.LoyaltyLevel;

public interface LoyaltyLevelRepository extends JpaRepository<LoyaltyLevel, String> {

    List<LoyaltyLevel> findAllByOrderByThresholdPointsAsc();

    Optional<LoyaltyLevel> findFirstByThresholdPointsLessThanEqualOrderByThresholdPointsDesc(int points);

    boolean existsByNameIgnoreCaseAndIdNot(String name, String id);

    boolean existsByThresholdPointsAndIdNot(int thresholdPoints, String id);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByThresholdPoints(int thresholdPoints);
}
