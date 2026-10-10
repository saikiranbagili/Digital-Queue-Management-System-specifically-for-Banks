package com.bankq.controller;

import com.bankq.dto.AdminDashboardResponse;
import com.bankq.dto.TokenResponse;
import com.bankq.dto.UserResponse;
import com.bankq.entity.BankingService;
import com.bankq.entity.Counter;
import com.bankq.entity.TokenStatus;
import com.bankq.service.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final QueueService queueService;

    public AdminController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(queueService.getAdminDashboard());
    }

    @GetMapping("/tokens")
    public ResponseEntity<List<TokenResponse>> getTokens(
            @RequestParam(required = false) String serviceName,
            @RequestParam(required = false) TokenStatus status) {
        return ResponseEntity.ok(queueService.getAdminTokens(serviceName, status));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(queueService.getAdminUsers());
    }

    @GetMapping("/services")
    public ResponseEntity<List<BankingService>> getServices() {
        return ResponseEntity.ok(queueService.getAdminServices());
    }

    @GetMapping("/counters")
    public ResponseEntity<List<Counter>> getCounters() {
        return ResponseEntity.ok(queueService.getAdminCounters());
    }
}
