package com.bankq.repository;

import com.bankq.entity.QueueToken;
import com.bankq.entity.TokenStatus;
import com.bankq.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {

    List<QueueToken> findByCustomerOrderByCreatedAtDesc(User customer);

    List<QueueToken> findByCustomerAndStatusInOrderByCreatedAtDesc(User customer, Collection<TokenStatus> statuses);

    boolean existsByCustomerAndServiceNameAndStatus(User customer, String serviceName, TokenStatus status);

    long countByServiceNameAndStatusAndCreatedAtBefore(String serviceName, TokenStatus status, LocalDateTime createdAt);

    List<QueueToken> findByServiceNameAndStatusOrderByCreatedAtAsc(String serviceName, TokenStatus status);

    List<QueueToken> findByServiceNameOrderByCreatedAtDesc(String serviceName);

    List<QueueToken> findByStatusOrderByCreatedAtAsc(TokenStatus status);

    long countByStatus(TokenStatus status);

    long countByServiceName(String serviceName);

    long countByServiceNameAndStatus(String serviceName, TokenStatus status);

    long countByStatusAndCompletedAtAfter(TokenStatus status, LocalDateTime time);

    Optional<QueueToken> findTopByCounterNameAndStatusOrderByCalledAtDesc(String counterName, TokenStatus status);

    Optional<QueueToken> findTopByServiceNameAndStatusOrderByCalledAtDesc(String serviceName, TokenStatus status);

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.serviceCode = :serviceCode AND (:branch IS NULL OR q.branch = :branch)")
    long countTokensByBranchAndServiceCode(@Param("branch") String branch, @Param("serviceCode") String serviceCode);

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.serviceCode = :serviceCode")
    long countTokensByServiceCode(@Param("serviceCode") String serviceCode);

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.serviceName = :serviceName AND q.status = :status AND q.createdAt < :createdAt AND (:branch IS NULL OR q.branch = :branch)")
    long countPeopleAheadInBranch(@Param("branch") String branch, @Param("serviceName") String serviceName, @Param("status") TokenStatus status, @Param("createdAt") LocalDateTime createdAt);

    @Query("SELECT q FROM QueueToken q WHERE q.status = :status AND (:counterName IS NULL OR q.counterName = :counterName) AND (:branch IS NULL OR q.branch = :branch) ORDER BY q.calledAt DESC")
    List<QueueToken> findCalledByBranchAndCounter(@Param("branch") String branch, @Param("counterName") String counterName, @Param("status") TokenStatus status);

    @Query("SELECT q FROM QueueToken q WHERE q.status = :status AND (:serviceName IS NULL OR q.serviceName = :serviceName) AND (:branch IS NULL OR q.branch = :branch) ORDER BY q.createdAt ASC")
    List<QueueToken> findWaitingByBranchAndService(@Param("branch") String branch, @Param("serviceName") String serviceName, @Param("status") TokenStatus status);

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.status = :status AND (:branch IS NULL OR q.branch = :branch)")
    long countByStatusAndBranch(@Param("status") TokenStatus status, @Param("branch") String branch);

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.serviceName = :serviceName AND q.status = :status AND (:branch IS NULL OR q.branch = :branch)")
    long countByServiceNameAndStatusAndBranch(@Param("serviceName") String serviceName, @Param("status") TokenStatus status, @Param("branch") String branch);

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.status = :status AND q.completedAt > :time AND (:branch IS NULL OR q.branch = :branch)")
    long countByStatusAndCompletedAtAfterAndBranch(@Param("status") TokenStatus status, @Param("time") LocalDateTime time, @Param("branch") String branch);

    @Query("SELECT q FROM QueueToken q WHERE (:serviceName IS NULL OR q.serviceName = :serviceName) AND (:status IS NULL OR q.status = :status) AND (:branch IS NULL OR q.branch = :branch) ORDER BY q.createdAt DESC")
    List<QueueToken> findWithBranchFilters(@Param("serviceName") String serviceName, @Param("status") TokenStatus status, @Param("branch") String branch);

    @Query("SELECT q FROM QueueToken q WHERE (:serviceName IS NULL OR q.serviceName = :serviceName) AND (:status IS NULL OR q.status = :status) ORDER BY q.createdAt DESC")
    List<QueueToken> findWithFilters(@Param("serviceName") String serviceName, @Param("status") TokenStatus status);
}
