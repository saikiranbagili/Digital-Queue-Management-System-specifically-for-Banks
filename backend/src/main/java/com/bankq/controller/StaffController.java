package com.bankq.controller;

import com.bankq.dto.CallNextRequest;
import com.bankq.dto.StaffDashboardResponse;
import com.bankq.dto.TokenResponse;
import com.bankq.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
public class StaffController {

    private final QueueService queueService;

    public StaffController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StaffDashboardResponse> getDashboard() {
        return ResponseEntity.ok(queueService.getStaffDashboard());
    }

    @GetMapping("/queue")
    public ResponseEntity<List<TokenResponse>> getQueue(@RequestParam(required = false) String serviceName) {
        return ResponseEntity.ok(queueService.getStaffQueue(serviceName));
    }

    @PostMapping("/queue/call-next")
    public ResponseEntity<TokenResponse> callNext(@Valid @RequestBody CallNextRequest request) {
        TokenResponse response = queueService.callNext(request.getServiceName(), request.getCounterName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tokens/{id}/complete")
    public ResponseEntity<TokenResponse> completeToken(@PathVariable Long id) {
        TokenResponse response = queueService.completeToken(id);
        return ResponseEntity.ok(response);
    }
}
