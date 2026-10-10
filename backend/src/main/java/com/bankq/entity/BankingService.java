package com.bankq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "banking_services")
public class BankingService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, length = 10)
    private String code;

    @Column(nullable = false)
    private String assignedCounter;

    @Column(nullable = false)
    private Integer avgDurationMinutes = 5;

    public BankingService() {}

    public BankingService(String name, String code, String assignedCounter, Integer avgDurationMinutes) {
        this.name = name;
        this.code = code;
        this.assignedCounter = assignedCounter;
        this.avgDurationMinutes = avgDurationMinutes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAssignedCounter() {
        return assignedCounter;
    }

    public void setAssignedCounter(String assignedCounter) {
        this.assignedCounter = assignedCounter;
    }

    public Integer getAvgDurationMinutes() {
        return avgDurationMinutes;
    }

    public void setAvgDurationMinutes(Integer avgDurationMinutes) {
        this.avgDurationMinutes = avgDurationMinutes;
    }
}
