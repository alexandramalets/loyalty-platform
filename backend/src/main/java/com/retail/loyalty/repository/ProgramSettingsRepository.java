package com.retail.loyalty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retail.loyalty.domain.ProgramSettings;

public interface ProgramSettingsRepository extends JpaRepository<ProgramSettings, Integer> {
}
