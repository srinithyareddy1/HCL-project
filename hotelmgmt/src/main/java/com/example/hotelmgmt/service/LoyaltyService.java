package com.example.hotelmgmt.service;

import com.example.hotelmgmt.entity.LoyaltyPoints;
import com.example.hotelmgmt.entity.User;
import com.example.hotelmgmt.repository.LoyaltyPointsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoyaltyService {

    private static final Logger log = LoggerFactory.getLogger(LoyaltyService.class);

    @Autowired private LoyaltyPointsRepository loyaltyPointsRepository;
    @Autowired private EmailService            emailService;

    private static final double POINTS_PER_RUPEE = 0.1;

    @Transactional
    public LoyaltyPoints awardPoints(User user, Double totalPrice) {
        LoyaltyPoints lp = loyaltyPointsRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    LoyaltyPoints newLp = new LoyaltyPoints();
                    newLp.setUser(user);
                    newLp.setPoints(0);
                    newLp.setTier("BRONZE");
                    return newLp;
                });

        int earned   = (int) (totalPrice * POINTS_PER_RUPEE);
        int newTotal = lp.getPoints() + earned;
        lp.setPoints(newTotal);
        lp.setTier(calculateTier(newTotal));
        loyaltyPointsRepository.save(lp);

        emailService.sendLoyaltyPointsUpdate(user.getEmail(), user.getName(),
                earned, newTotal, lp.getTier());

        log.info("Awarded {} points to {} — total: {}, tier: {}",
                earned, user.getEmail(), newTotal, lp.getTier());
        return lp;
    }

    public LoyaltyPoints getLoyaltyInfo(Long userId) {
        return loyaltyPointsRepository.findByUserId(userId).orElse(null);
    }

    public String calculateTier(int points) {
        if (points >= 5000) return "PLATINUM";
        if (points >= 2500) return "GOLD";
        if (points >= 1000) return "SILVER";
        return "BRONZE";
    }

    public double getTierDiscount(String tier) {
        return switch (tier) {
            case "SILVER"   -> 0.10;
            case "GOLD"     -> 0.15;
            case "PLATINUM" -> 0.20;
            default         -> 0.05;
        };
    }
}
