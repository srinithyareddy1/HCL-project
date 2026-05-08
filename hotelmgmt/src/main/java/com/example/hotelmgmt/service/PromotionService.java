package com.example.hotelmgmt.service;

import com.example.hotelmgmt.entity.Promotion;
import com.example.hotelmgmt.entity.User;
import com.example.hotelmgmt.repository.PromotionRepository;
import com.example.hotelmgmt.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class PromotionService {

    private static final Logger log = LoggerFactory.getLogger(PromotionService.class);

    @Autowired private PromotionRepository promotionRepository;
    @Autowired private UserRepository      userRepository;
    @Autowired private EmailService        emailService;

    public Promotion createPromotion(Promotion promo) {
        if (promotionRepository.findByCodeIgnoreCase(promo.getCode()).isPresent()) {
            throw new RuntimeException("Promo code already exists: " + promo.getCode());
        }
        Promotion saved = promotionRepository.save(promo);
        log.info("Promotion created: {}", saved.getCode());
        return saved;
    }

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public String deletePromotion(Long id) {
        promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        promotionRepository.deleteById(id);
        return "Promotion deleted successfully";
    }

    public String broadcastPromo(Long promoId) {
        Promotion promo = promotionRepository.findById(promoId)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        List<User> users = userRepository.findAll();
        for (User user : users) {
            emailService.sendPromoCode(
                    user.getEmail(), user.getName(), promo.getCode(),
                    promo.getDescription(), promo.getDiscountValue(), promo.getDiscountType(),
                    promo.getValidUntil() != null ? promo.getValidUntil().toString() : "N/A");
        }
        log.info("Promo {} broadcasted to {} users", promo.getCode(), users.size());
        return "Promo code " + promo.getCode() + " sent to " + users.size() + " users";
    }

    public double applyPromoCode(String code, double originalPrice) {
        Promotion promo = promotionRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new RuntimeException("Invalid promo code: " + code));

        if (!Boolean.TRUE.equals(promo.getActive()))
            throw new RuntimeException("Promo code is no longer active.");

        LocalDate today = LocalDate.now();
        if (promo.getValidFrom() != null && today.isBefore(promo.getValidFrom()))
            throw new RuntimeException("Promo code is not yet valid. Valid from: " + promo.getValidFrom());
        if (promo.getValidUntil() != null && today.isAfter(promo.getValidUntil()))
            throw new RuntimeException("Promo code has expired on: " + promo.getValidUntil());
        if (originalPrice < promo.getMinimumBookingAmount())
            throw new RuntimeException("Minimum booking amount ₹" + promo.getMinimumBookingAmount() + " required.");

        double discount = "PERCENTAGE".equalsIgnoreCase(promo.getDiscountType())
                ? originalPrice * (promo.getDiscountValue() / 100.0)
                : promo.getDiscountValue();

        double finalPrice = Math.max(0, originalPrice - discount);
        log.info("Promo {} applied: ₹{} → ₹{}", code, originalPrice, finalPrice);
        return finalPrice;
    }

    public List<Promotion> getActivePromotions() {
        LocalDate today = LocalDate.now();
        return promotionRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getActive()))
                .filter(p -> p.getValidFrom() == null || !today.isBefore(p.getValidFrom()))
                .filter(p -> p.getValidUntil() == null || !today.isAfter(p.getValidUntil()))
                .toList();
    }
}
