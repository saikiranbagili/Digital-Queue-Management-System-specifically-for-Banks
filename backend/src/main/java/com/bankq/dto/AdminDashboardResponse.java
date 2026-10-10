package com.bankq.dto;

import java.util.Map;

public class AdminDashboardResponse {
    private long totalTokensToday;
    private long waitingTokens;
    private long calledTokens;
    private long completedTokens;
    private Map<String, Long> queueCountsByService;
    private long totalRegisteredUsers;

    public AdminDashboardResponse() {}

    public long getTotalTokensToday() {
        return totalTokensToday;
    }

    public void setTotalTokensToday(long totalTokensToday) {
        this.totalTokensToday = totalTokensToday;
    }

    public long getWaitingTokens() {
        return waitingTokens;
    }

    public void setWaitingTokens(long waitingTokens) {
        this.waitingTokens = waitingTokens;
    }

    public long getCalledTokens() {
        return calledTokens;
    }

    public void setCalledTokens(long calledTokens) {
        this.calledTokens = calledTokens;
    }

    public long getCompletedTokens() {
        return completedTokens;
    }

    public void setCompletedTokens(long completedTokens) {
        this.completedTokens = completedTokens;
    }

    public Map<String, Long> getQueueCountsByService() {
        return queueCountsByService;
    }

    public void setQueueCountsByService(Map<String, Long> queueCountsByService) {
        this.queueCountsByService = queueCountsByService;
    }

    public long getTotalRegisteredUsers() {
        return totalRegisteredUsers;
    }

    public void setTotalRegisteredUsers(long totalRegisteredUsers) {
        this.totalRegisteredUsers = totalRegisteredUsers;
    }
}
