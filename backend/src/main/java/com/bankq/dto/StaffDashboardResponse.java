package com.bankq.dto;

import java.util.Map;

public class StaffDashboardResponse {
    private long waitingCount;
    private long calledCount;
    private long completedTodayCount;
    private Map<String, Long> countsByService;
    private TokenResponse currentlyServingToken;

    public StaffDashboardResponse() {}

    public long getWaitingCount() {
        return waitingCount;
    }

    public void setWaitingCount(long waitingCount) {
        this.waitingCount = waitingCount;
    }

    public long getCalledCount() {
        return calledCount;
    }

    public void setCalledCount(long calledCount) {
        this.calledCount = calledCount;
    }

    public long getCompletedTodayCount() {
        return completedTodayCount;
    }

    public void setCompletedTodayCount(long completedTodayCount) {
        this.completedTodayCount = completedTodayCount;
    }

    public Map<String, Long> getCountsByService() {
        return countsByService;
    }

    public void setCountsByService(Map<String, Long> countsByService) {
        this.countsByService = countsByService;
    }

    public TokenResponse getCurrentlyServingToken() {
        return currentlyServingToken;
    }

    public void setCurrentlyServingToken(TokenResponse currentlyServingToken) {
        this.currentlyServingToken = currentlyServingToken;
    }
}
