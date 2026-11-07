package com.retail.loyalty.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retail.loyalty.domain.LevelTransition;

public interface LevelTransitionRepository extends JpaRepository<LevelTransition, Long> {

    List<LevelTransition> findByChangedAtGreaterThanEqual(LocalDate from);
}
