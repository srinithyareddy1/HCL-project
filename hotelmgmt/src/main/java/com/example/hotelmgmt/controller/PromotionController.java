package com.example.hotelmgmt.controller;

import com.example.hotelmgmt.entity.Promotion;
import com.example.hotelmgmt.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/promotions")
@CrossOrigin("*")
public class PromotionController {

    @Autowired private PromotionService promotionService;

    // All currently active promos (public)
    @GetMapping("/active")
    public ResponseEntity<List<Promotion>> getActivePromotions() {
        return ResponseEntity.ok(promotionService.getActivePromotions());
    }

    // Validate a promo code and see the discounted price
    @GetMapping("/validate")
    public ResponseEntity<?> validatePromo(@RequestParam String code,
                                            @RequestParam Double price) {
        double discountedPrice = promotionService.applyPromoCode(code, price);
        return ResponseEntity.ok(Map.of(
                "code",            code.toUpperCase(),
                "originalPrice",   price,
                "discountedPrice", discountedPrice,
                "savings",         price - discountedPrice));
    }
}
