package com.bankq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tokens", indexes = {
    @Index(name = "idx_token_service_status", columnList = "serviceName, status"),
    @Index(name = "idx_token_status", columnList = "status"),
    @Index(name = "idx_token_number", columnList = "tokenNumber"),
    @Index(name = "idx_token_branch", columnList = "branch")
})
public class QueueToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String tokenNumber;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false, length = 10)
    private String serviceCode;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "branch")
    private String branch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenStatus status = TokenStatus.WAITING;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false)
    private String counterName;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime calledAt;

    private LocalDateTime completedAt;

    public QueueToken() {}

    public QueueToken(String tokenNumber, String serviceName, String serviceCode, User customer, String counterName) {
        this.tokenNumber = tokenNumber;
        this.serviceName = serviceName;
        this.serviceCode = serviceCode;
        this.customer = customer;
        this.counterName = counterName;
        this.status = TokenStatus.WAITING;
        this.createdAt = LocalDateTime.now();
    }

    public QueueToken(String tokenNumber, String serviceName, String serviceCode, String bankName, String branch, User customer, String counterName) {
        this.tokenNumber = tokenNumber;
        this.serviceName = serviceName;
        this.serviceCode = serviceCode;
        this.bankName = bankName;
        this.branch = branch;
        this.customer = customer;
        this.counterName = counterName;
        this.status = TokenStatus.WAITING;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(String tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public TokenStatus getStatus() {
        return status;
    }

    public void setStatus(TokenStatus status) {
        this.status = status;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public String getCounterName() {
        return counterName;
    }

    public void setCounterName(String counterName) {
        this.counterName = counterName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCalledAt() {
        return calledAt;
    }

    public void setCalledAt(LocalDateTime calledAt) {
        this.calledAt = calledAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
