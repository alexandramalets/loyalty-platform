package com.retail.loyalty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.retail.loyalty.domain.Customer;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    @Override
    @EntityGraph(attributePaths = {"account", "account.level"})
    List<Customer> findAll();

    @Override
    @EntityGraph(attributePaths = {"account", "account.level"})
    Optional<Customer> findById(String id);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhone(String phone);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, String id);

    boolean existsByPhoneAndIdNot(String phone, String id);

    long countByStatus(String status);

    long countByAccount_Level_Id(String levelId);
}
