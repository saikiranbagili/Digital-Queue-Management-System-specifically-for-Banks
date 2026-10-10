package com.bankq.repository;

import com.bankq.entity.BankingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankingServiceRepository extends JpaRepository<BankingService, Long> {
    Optional<BankingService> findByName(String name);
    Optional<BankingService> findByCode(String code);
}
