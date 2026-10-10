package com.bankq.config;

import com.bankq.entity.*;
import com.bankq.repository.BankingServiceRepository;
import com.bankq.repository.CounterRepository;
import com.bankq.repository.QueueTokenRepository;
import com.bankq.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BankingServiceRepository serviceRepository;
    private final CounterRepository counterRepository;
    private final QueueTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           BankingServiceRepository serviceRepository,
                           CounterRepository counterRepository,
                           QueueTokenRepository tokenRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.counterRepository = counterRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Seed demo users if not present
        User customer = userRepository.findByEmail("customer@bankq.demo").orElseGet(() -> {
            User u = new User("Alice Customer", "customer@bankq.demo", passwordEncoder.encode("Customer123"), Role.CUSTOMER);
            return userRepository.save(u);
        });

        if (!userRepository.existsByEmail("staff@bankq.demo")) {
            User staff = new User("Bob Staff", "staff@bankq.demo", passwordEncoder.encode("Staff123"), Role.STAFF);
            userRepository.save(staff);
        }

        if (!userRepository.existsByEmail("admin@bankq.demo")) {
            User admin = new User("Carol Administrator", "admin@bankq.demo", passwordEncoder.encode("Admin123"), Role.ADMIN);
            userRepository.save(admin);
        }

        // 2. Seed Counters if not present
        if (counterRepository.count() == 0) {
            counterRepository.save(new Counter("Counter 1", "ACTIVE", "Bob Staff"));
            counterRepository.save(new Counter("Counter 2", "ACTIVE", "Sarah Teller"));
            counterRepository.save(new Counter("Counter 3", "ACTIVE", "David Officer"));
        }

        // 3. Seed Banking Services if not present
        if (serviceRepository.count() == 0) {
            serviceRepository.save(new BankingService("Cash Deposit", "CD", "Counter 1", 5));
            serviceRepository.save(new BankingService("Cash Withdrawal", "CW", "Counter 2", 5));
            serviceRepository.save(new BankingService("Account Opening", "AO", "Counter 3", 15));
            serviceRepository.save(new BankingService("Passbook Update", "PB", "Counter 1", 3));
            serviceRepository.save(new BankingService("Cheque Services", "CH", "Counter 2", 8));
            serviceRepository.save(new BankingService("Loan Enquiry", "LE", "Counter 3", 20));
        }

        // 4. Seed example tokens if repository is empty
        if (tokenRepository.count() == 0) {
            QueueToken t1 = new QueueToken("CD-001", "Cash Deposit", "CD", customer, "Counter 1");
            t1.setStatus(TokenStatus.COMPLETED);
            t1.setCalledAt(LocalDateTime.now().minusMinutes(25));
            t1.setCompletedAt(LocalDateTime.now().minusMinutes(10));
            tokenRepository.save(t1);

            QueueToken t2 = new QueueToken("CW-001", "Cash Withdrawal", "CW", customer, "Counter 2");
            t2.setStatus(TokenStatus.CALLED);
            t2.setCalledAt(LocalDateTime.now().minusMinutes(5));
            tokenRepository.save(t2);

            QueueToken t3 = new QueueToken("AO-001", "Account Opening", "AO", customer, "Counter 3");
            t3.setStatus(TokenStatus.WAITING);
            tokenRepository.save(t3);
        }
    }
}
