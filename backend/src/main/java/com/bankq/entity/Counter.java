package com.bankq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "counters")
public class Counter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String status = "ACTIVE";

    private String currentStaffName;

    public Counter() {}

    public Counter(String name, String status, String currentStaffName) {
        this.name = name;
        this.status = status;
        this.currentStaffName = currentStaffName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCurrentStaffName() {
        return currentStaffName;
    }

    public void setCurrentStaffName(String currentStaffName) {
        this.currentStaffName = currentStaffName;
    }
}
