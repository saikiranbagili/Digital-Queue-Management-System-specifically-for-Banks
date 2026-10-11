package com.bankq.dto;

import jakarta.validation.constraints.NotBlank;

public class CallNextRequest {
    @NotBlank(message = "Service name is required")
    private String serviceName;

    private String counterName;

    private String branch;

    public CallNextRequest() {}

    public CallNextRequest(String serviceName, String counterName) {
        this.serviceName = serviceName;
        this.counterName = counterName;
    }

    public CallNextRequest(String serviceName, String counterName, String branch) {
        this.serviceName = serviceName;
        this.counterName = counterName;
        this.branch = branch;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getCounterName() {
        return counterName;
    }

    public void setCounterName(String counterName) {
        this.counterName = counterName;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }
}
