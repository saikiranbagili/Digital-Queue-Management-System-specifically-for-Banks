package com.bankq.dto;

public class CustomerDashboardResponse {
    private String welcomeMessage;
    private long totalRequested;
    private TokenResponse activeToken;
    private int queuePosition;
    private int peopleAhead;
    private int estimatedWaitMinutes;
    private String assignedCounter;
    private String currentlyServingToken;
    private String currentTokenStatus;

    public CustomerDashboardResponse() {}

    public String getWelcomeMessage() {
        return welcomeMessage;
    }

    public void setWelcomeMessage(String welcomeMessage) {
        this.welcomeMessage = welcomeMessage;
    }

    public long getTotalRequested() {
        return totalRequested;
    }

    public void setTotalRequested(long totalRequested) {
        this.totalRequested = totalRequested;
    }

    public TokenResponse getActiveToken() {
        return activeToken;
    }

    public void setActiveToken(TokenResponse activeToken) {
        this.activeToken = activeToken;
    }

    public int getQueuePosition() {
        return queuePosition;
    }

    public void setQueuePosition(int queuePosition) {
        this.queuePosition = queuePosition;
    }

    public int getPeopleAhead() {
        return peopleAhead;
    }

    public void setPeopleAhead(int peopleAhead) {
        this.peopleAhead = peopleAhead;
    }

    public int getEstimatedWaitMinutes() {
        return estimatedWaitMinutes;
    }

    public void setEstimatedWaitMinutes(int estimatedWaitMinutes) {
        this.estimatedWaitMinutes = estimatedWaitMinutes;
    }

    public String getAssignedCounter() {
        return assignedCounter;
    }

    public void setAssignedCounter(String assignedCounter) {
        this.assignedCounter = assignedCounter;
    }

    public String getCurrentlyServingToken() {
        return currentlyServingToken;
    }

    public void setCurrentlyServingToken(String currentlyServingToken) {
        this.currentlyServingToken = currentlyServingToken;
    }

    public String getCurrentTokenStatus() {
        return currentTokenStatus;
    }

    public void setCurrentTokenStatus(String currentTokenStatus) {
        this.currentTokenStatus = currentTokenStatus;
    }
}
