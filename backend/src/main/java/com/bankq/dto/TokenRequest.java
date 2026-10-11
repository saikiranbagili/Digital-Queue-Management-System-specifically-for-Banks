package com.bankq.dto;

import jakarta.validation.constraints.NotBlank;

public class TokenRequest {
    @NotBlank(message = "Service name is required")
    private String serviceName;

    private String bankName;

    private String branch;

    public TokenRequest() {}

    public TokenRequest(String serviceName) {
        this.serviceName = serviceName;
    }

    public TokenRequest(String serviceName, String bankName, String branch) {
        this.serviceName = serviceName;
        this.bankName = bankName;
        this.branch = branch;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
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
}
