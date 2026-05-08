package com.example.hotelmgmt.repository;

import com.example.hotelmgmt.entity.LoyaltyPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, Long> {
    Optional<LoyaltyPoints> findByUserId(Long userId);
}
