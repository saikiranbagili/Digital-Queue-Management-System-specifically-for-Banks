package com.bankq.dto;

import jakarta.validation.constraints.NotBlank;

public class TokenRequest {
    @NotBlank(message = "Service name is required")
    private String serviceName;

    public TokenRequest() {}

    public TokenRequest(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}
