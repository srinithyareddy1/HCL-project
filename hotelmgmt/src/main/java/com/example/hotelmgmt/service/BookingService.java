package com.example.hotelmgmt.service;

import com.example.hotelmgmt.config.JwtUtil;
import com.example.hotelmgmt.dto.BookingRequest;
import com.example.hotelmgmt.entity.*;
import com.example.hotelmgmt.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    @Autowired private BookingRepository bookingRepository;
    @Autowired private RoomRepository    roomRepository;
    @Autowired private UserRepository    userRepository;
    @Autowired private JwtUtil           jwtUtil;
    @Autowired private EmailService      emailService;
    @Autowired private PromotionService  promotionService;
    @Autowired private LoyaltyService    loyaltyService;

    @Transactional
    public Map<String, Object> bookRoom(BookingRequest request, String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findByIdWithLock(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Conflict check
        bookingRepository.findByRoomId(request.getRoomId()).stream()
                .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus()))
                .forEach(b -> {
                    if (request.getCheckOut().isAfter(b.getCheckIn()) &&
                        request.getCheckIn().isBefore(b.getCheckOut()))
                        throw new RuntimeException("Room already booked for selected dates.");
                });

        long days = request.getCheckOut().toEpochDay() - request.getCheckIn().toEpochDay();
        if (days <= 0) throw new RuntimeException("Check-out must be after check-in.");
        double originalTotal = days * room.getPrice();

        // Loyalty discount
        LoyaltyPoints lp = loyaltyService.getLoyaltyInfo(user.getId());
        double loyaltyDiscount = lp != null ? loyaltyService.getTierDiscount(lp.getTier()) : 0.0;
        double priceAfterLoyalty = originalTotal * (1 - loyaltyDiscount);

        // Promo code (optional)
        double finalTotal  = priceAfterLoyalty;
        String appliedCode = null;
        if (request.getPromoCode() != null && !request.getPromoCode().isBlank()) {
            finalTotal  = promotionService.applyPromoCode(request.getPromoCode(), priceAfterLoyalty);
            appliedCode = request.getPromoCode().toUpperCase();
        }

        // Save booking
        Booking booking = new Booking();
        booking.setRoom(room); booking.setUser(user);
        booking.setCheckIn(request.getCheckIn()); booking.setCheckOut(request.getCheckOut());
        booking.setTotalPrice(finalTotal); booking.setStatus("CONFIRMED");
        if (request.getFoodPreference() == null || request.getFoodPreference().isBlank()) {
            throw new RuntimeException("Food preference is required (Breakfast, Lunch, or Dinner).");
        }
        booking.setFoodPreference(request.getFoodPreference());
        bookingRepository.save(booking);

        // Post-booking async tasks
        emailService.sendBookingConfirmation(user.getEmail(), room.getRoomType(),
                request.getCheckIn().toString(), request.getCheckOut().toString(),
                booking.getId(), finalTotal);
        loyaltyService.awardPoints(user, finalTotal);

        log.info("Booking #{} created for {} — ₹{}", booking.getId(), email, finalTotal);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("bookingId",       booking.getId());
        response.put("message",         "Room booked successfully");
        response.put("room",            room.getRoomType());
        response.put("checkIn",         request.getCheckIn());
        response.put("checkOut",        request.getCheckOut());
        response.put("originalPrice",   originalTotal);
        response.put("loyaltyDiscount", (int)(loyaltyDiscount * 100) + "%");
        response.put("promoApplied",    appliedCode != null ? appliedCode : "None");
        response.put("finalPrice",      finalTotal);
        return response;
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional
    public String cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus()))
            throw new RuntimeException("Booking is already cancelled.");
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        emailService.sendBookingCancellation(booking.getUser().getEmail(),
                booking.getRoom().getRoomType(),
                booking.getCheckIn().toString(), booking.getCheckOut().toString());
        log.info("Booking #{} cancelled by {}", bookingId, booking.getUser().getEmail());
        return "Booking #" + bookingId + " cancelled successfully";
    }

    @Transactional
    public Map<String, Object> rebookRoom(Long originalBookingId,
                                           LocalDate newCheckIn, LocalDate newCheckOut, String token) {
        Booking original = bookingRepository.findById(originalBookingId)
                .orElseThrow(() -> new RuntimeException("Original booking not found"));
        BookingRequest req = new BookingRequest();
        req.setRoomId(original.getRoom().getId());
        req.setCheckIn(newCheckIn);
        req.setCheckOut(newCheckOut);
        req.setFoodPreference(original.getFoodPreference());
        return bookRoom(req, token);
    }
}
