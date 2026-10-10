package com.bankq.controller;

import com.bankq.dto.CustomerDashboardResponse;
import com.bankq.dto.TokenRequest;
import com.bankq.dto.TokenResponse;
import com.bankq.entity.User;
import com.bankq.service.AuthService;
import com.bankq.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class CustomerController {

    private final QueueService queueService;
    private final AuthService authService;

    public CustomerController(QueueService queueService, AuthService authService) {
        this.queueService = queueService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<CustomerDashboardResponse> getDashboard(Authentication authentication) {
        User customer = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(queueService.getCustomerDashboard(customer));
    }

    @PostMapping("/tokens")
    public ResponseEntity<TokenResponse> requestToken(@Valid @RequestBody TokenRequest request,
                                                      Authentication authentication) {
        User customer = authService.getUserByEmail(authentication.getName());
        TokenResponse response = queueService.requestToken(customer, request.getServiceName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tokens")
    public ResponseEntity<List<TokenResponse>> getMyTokens(Authentication authentication) {
        User customer = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(queueService.getCustomerTokens(customer));
    }

    @GetMapping("/tokens/{id}")
    public ResponseEntity<TokenResponse> getTokenById(@PathVariable Long id, Authentication authentication) {
        User customer = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(queueService.getTokenById(id, customer));
    }

    @GetMapping("/tokens/{id}/status")
    public ResponseEntity<TokenResponse> getTokenStatus(@PathVariable Long id, Authentication authentication) {
        User customer = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(queueService.getTokenStatus(id, customer));
    }
}
