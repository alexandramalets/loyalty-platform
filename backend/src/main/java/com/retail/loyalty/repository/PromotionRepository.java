package com.retail.loyalty.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.retail.loyalty.domain.Promotion;

public interface PromotionRepository extends JpaRepository<Promotion, String> {

    @EntityGraph(attributePaths = "level")
    List<Promotion> findAllByOrderByStartDateDesc();

    boolean existsByLevelId(String levelId);

    @Query("""
            select p from Promotion p
            left join p.level level
            where p.status = 'active'
              and p.startDate <= :today
              and p.endDate >= :today
              and (level is null or level.id = :levelId)
            """)
    List<Promotion> findActiveForLevel(String levelId, LocalDate today);
}
