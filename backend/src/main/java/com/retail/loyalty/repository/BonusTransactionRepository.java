package com.retail.loyalty.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.retail.loyalty.domain.BonusTransaction;

public interface BonusTransactionRepository extends JpaRepository<BonusTransaction, String> {

    @EntityGraph(attributePaths = {"customer"})
    List<BonusTransaction> findAllByOrderByOperationDateDescIdDesc();

    @EntityGraph(attributePaths = {"customer"})
    List<BonusTransaction> findByCustomerIdOrderByOperationDateDescIdDesc(String customerId);

    List<BonusTransaction> findByOperationDateGreaterThanEqualAndStatus(LocalDate from, String status);

    @Query("""
            select coalesce(sum(t.amount), 0)
            from BonusTransaction t
            where t.status = 'done' and t.amount > 0 and t.operationDate >= :from
            """)
    long sumAccruedSince(LocalDate from);

    @Query("""
            select coalesce(sum(-t.amount), 0)
            from BonusTransaction t
            where t.status = 'done' and t.amount < 0 and t.operationDate >= :from
            """)
    long sumRedeemedSince(LocalDate from);

    @Query("""
            select coalesce(sum(-t.amount), 0)
            from BonusTransaction t
            where t.status = 'cancelled' and t.reason like '%Сгорание%' and t.operationDate >= :from
            """)
    long sumExpiredSince(LocalDate from);
}
