package com.bankq.service;

import com.bankq.dto.*;
import com.bankq.entity.*;
import com.bankq.exception.BadRequestException;
import com.bankq.exception.ResourceNotFoundException;
import com.bankq.repository.BankingServiceRepository;
import com.bankq.repository.CounterRepository;
import com.bankq.repository.QueueTokenRepository;
import com.bankq.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QueueService {

    private final QueueTokenRepository tokenRepository;
    private final BankingServiceRepository serviceRepository;
    private final CounterRepository counterRepository;
    private final UserRepository userRepository;

    public QueueService(QueueTokenRepository tokenRepository,
                        BankingServiceRepository serviceRepository,
                        CounterRepository counterRepository,
                        UserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.serviceRepository = serviceRepository;
        this.counterRepository = counterRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public synchronized TokenResponse requestToken(User customer, String serviceName) {
        BankingService service = serviceRepository.findByName(serviceName)
                .orElseThrow(() -> new BadRequestException("Invalid banking service: " + serviceName));

        // Prevent customer from requesting another active token for the same service
        boolean hasWaiting = tokenRepository.existsByCustomerAndServiceNameAndStatus(customer, serviceName, TokenStatus.WAITING);
        boolean hasCalled = tokenRepository.existsByCustomerAndServiceNameAndStatus(customer, serviceName, TokenStatus.CALLED);
        if (hasWaiting || hasCalled) {
            throw new BadRequestException("You already have an active token for " + serviceName + ". Please wait until it is completed.");
        }

        // Generate unique token number using service code and sequence count
        long count = tokenRepository.countTokensByServiceCode(service.getCode());
        String tokenNumber = String.format("%s-%03d", service.getCode(), count + 1);

        QueueToken token = new QueueToken(
                tokenNumber,
                service.getName(),
                service.getCode(),
                customer,
                service.getAssignedCounter()
        );

        token = tokenRepository.save(token);
        return mapToTokenResponse(token);
    }

    @Transactional(readOnly = true)
    public List<TokenResponse> getCustomerTokens(User customer) {
        return tokenRepository.findByCustomerOrderByCreatedAtDesc(customer)
                .stream()
                .map(this::mapToTokenResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDashboardResponse getCustomerDashboard(User customer) {
        CustomerDashboardResponse response = new CustomerDashboardResponse();
        response.setWelcomeMessage("Welcome back, " + customer.getName());

        List<QueueToken> allTokens = tokenRepository.findByCustomerOrderByCreatedAtDesc(customer);
        response.setTotalRequested(allTokens.size());

        // Find current active token (CALLED first, then WAITING)
        Optional<QueueToken> activeOpt = allTokens.stream()
                .filter(t -> t.getStatus() == TokenStatus.CALLED || t.getStatus() == TokenStatus.WAITING)
                .findFirst();

        if (activeOpt.isPresent()) {
            QueueToken active = activeOpt.get();
            TokenResponse activeResp = mapToTokenResponse(active);
            response.setActiveToken(activeResp);
            response.setQueuePosition(activeResp.getQueuePosition());
            response.setPeopleAhead(activeResp.getPeopleAhead());
            response.setEstimatedWaitMinutes(activeResp.getEstimatedWaitMinutes());
            response.setAssignedCounter(active.getCounterName());
            response.setCurrentlyServingToken(activeResp.getCurrentlyServingToken());
            response.setCurrentTokenStatus(active.getStatus().name());
        } else {
            response.setQueuePosition(0);
            response.setPeopleAhead(0);
            response.setEstimatedWaitMinutes(0);
            response.setAssignedCounter("None");
            response.setCurrentlyServingToken("None");
            response.setCurrentTokenStatus("NONE");
        }

        return response;
    }

    @Transactional(readOnly = true)
    public TokenResponse getTokenById(Long id, User requester) {
        QueueToken token = tokenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found with ID: " + id));

        // Enforce customer ownership check if requester is a CUSTOMER
        if (requester.getRole() == Role.CUSTOMER && !token.getCustomer().getId().equals(requester.getId())) {
            throw new AccessDeniedException("You do not have permission to view this token.");
        }

        return mapToTokenResponse(token);
    }

    @Transactional(readOnly = true)
    public TokenResponse getTokenStatus(Long id, User requester) {
        return getTokenById(id, requester);
    }

    @Transactional(readOnly = true)
    public StaffDashboardResponse getStaffDashboard() {
        StaffDashboardResponse response = new StaffDashboardResponse();
        response.setWaitingCount(tokenRepository.countByStatus(TokenStatus.WAITING));
        response.setCalledCount(tokenRepository.countByStatus(TokenStatus.CALLED));

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        response.setCompletedTodayCount(tokenRepository.countByStatusAndCompletedAtAfter(TokenStatus.COMPLETED, startOfDay));

        Map<String, Long> serviceCounts = new HashMap<>();
        List<BankingService> services = serviceRepository.findAll();
        for (BankingService s : services) {
            long waitingForService = tokenRepository.countByServiceNameAndStatus(s.getName(), TokenStatus.WAITING);
            serviceCounts.put(s.getName(), waitingForService);
        }
        response.setCountsByService(serviceCounts);

        // Find any currently called token
        Optional<QueueToken> latestCalled = tokenRepository.findByStatusOrderByCreatedAtAsc(TokenStatus.CALLED)
                .stream().findFirst();
        latestCalled.ifPresent(token -> response.setCurrentlyServingToken(mapToTokenResponse(token)));

        return response;
    }

    @Transactional(readOnly = true)
    public List<TokenResponse> getStaffQueue(String serviceName) {
        List<QueueToken> list;
        if (serviceName != null && !serviceName.isBlank() && !serviceName.equalsIgnoreCase("all")) {
            list = tokenRepository.findByServiceNameAndStatusOrderByCreatedAtAsc(serviceName, TokenStatus.WAITING);
        } else {
            list = tokenRepository.findByStatusOrderByCreatedAtAsc(TokenStatus.WAITING);
        }
        return list.stream().map(this::mapToTokenResponse).collect(Collectors.toList());
    }

    @Transactional
    public synchronized TokenResponse callNext(String serviceName, String counterName) {
        List<QueueToken> waitingTokens = tokenRepository.findByServiceNameAndStatusOrderByCreatedAtAsc(serviceName, TokenStatus.WAITING);
        if (waitingTokens.isEmpty()) {
            throw new BadRequestException("No waiting tokens available for service: " + serviceName);
        }

        QueueToken nextToken = waitingTokens.get(0);
        nextToken.setStatus(TokenStatus.CALLED);
        nextToken.setCalledAt(LocalDateTime.now());
        if (counterName != null && !counterName.isBlank()) {
            nextToken.setCounterName(counterName);
        }

        nextToken = tokenRepository.save(nextToken);
        return mapToTokenResponse(nextToken);
    }

    @Transactional
    public synchronized TokenResponse completeToken(Long id) {
        QueueToken token = tokenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found with ID: " + id));

        if (token.getStatus() != TokenStatus.CALLED) {
            throw new BadRequestException("Only CALLED tokens can be marked as COMPLETED. Current status: " + token.getStatus());
        }

        token.setStatus(TokenStatus.COMPLETED);
        token.setCompletedAt(LocalDateTime.now());
        token = tokenRepository.save(token);

        return mapToTokenResponse(token);
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalTokensToday(tokenRepository.count());
        response.setWaitingTokens(tokenRepository.countByStatus(TokenStatus.WAITING));
        response.setCalledTokens(tokenRepository.countByStatus(TokenStatus.CALLED));
        response.setCompletedTokens(tokenRepository.countByStatus(TokenStatus.COMPLETED));
        response.setTotalRegisteredUsers(userRepository.count());

        Map<String, Long> serviceCounts = new HashMap<>();
        List<BankingService> services = serviceRepository.findAll();
        for (BankingService s : services) {
            long count = tokenRepository.countByServiceName(s.getName());
            serviceCounts.put(s.getName(), count);
        }
        response.setQueueCountsByService(serviceCounts);

        return response;
    }

    @Transactional(readOnly = true)
    public List<TokenResponse> getAdminTokens(String serviceName, TokenStatus status) {
        String filterService = (serviceName != null && !serviceName.isBlank() && !serviceName.equalsIgnoreCase("all")) ? serviceName : null;
        return tokenRepository.findWithFilters(filterService, status)
                .stream()
                .map(this::mapToTokenResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAdminUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BankingService> getAdminServices() {
        return serviceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Counter> getAdminCounters() {
        return counterRepository.findAll();
    }

    private TokenResponse mapToTokenResponse(QueueToken token) {
        TokenResponse resp = new TokenResponse();
        resp.setId(token.getId());
        resp.setTokenNumber(token.getTokenNumber());
        resp.setServiceName(token.getServiceName());
        resp.setServiceCode(token.getServiceCode());
        resp.setStatus(token.getStatus());
        resp.setCounterName(token.getCounterName());
        resp.setCreatedAt(token.getCreatedAt());
        resp.setCalledAt(token.getCalledAt());
        resp.setCompletedAt(token.getCompletedAt());

        if (token.getCustomer() != null) {
            resp.setCustomerName(token.getCustomer().getName());
            resp.setCustomerEmail(token.getCustomer().getEmail());
        }

        // Calculate queue position and people ahead
        if (token.getStatus() == TokenStatus.WAITING) {
            long peopleAhead = tokenRepository.countByServiceNameAndStatusAndCreatedAtBefore(
                    token.getServiceName(), TokenStatus.WAITING, token.getCreatedAt()
            );
            resp.setPeopleAhead((int) peopleAhead);
            resp.setQueuePosition((int) peopleAhead + 1);

            int avgDuration = serviceRepository.findByName(token.getServiceName())
                    .map(BankingService::getAvgDurationMinutes)
                    .orElse(5);
            resp.setEstimatedWaitMinutes(((int) peopleAhead + 1) * avgDuration);
        } else if (token.getStatus() == TokenStatus.CALLED) {
            resp.setPeopleAhead(0);
            resp.setQueuePosition(0);
            resp.setEstimatedWaitMinutes(0);
        } else {
            resp.setPeopleAhead(0);
            resp.setQueuePosition(0);
            resp.setEstimatedWaitMinutes(0);
        }

        // Find currently serving token for this counter
        Optional<QueueToken> serving = tokenRepository.findTopByCounterNameAndStatusOrderByCalledAtDesc(
                token.getCounterName(), TokenStatus.CALLED
        );
        resp.setCurrentlyServingToken(serving.map(QueueToken::getTokenNumber).orElse("None"));

        return resp;
    }
}
