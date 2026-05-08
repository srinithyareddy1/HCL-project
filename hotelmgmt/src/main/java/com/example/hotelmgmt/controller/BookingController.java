package com.example.hotelmgmt.controller;

import com.example.hotelmgmt.config.JwtUtil;
import com.example.hotelmgmt.dto.BookingRequest;
import com.example.hotelmgmt.entity.Booking;
import com.example.hotelmgmt.entity.LoyaltyPoints;
import com.example.hotelmgmt.entity.User;
import com.example.hotelmgmt.repository.UserRepository;
import com.example.hotelmgmt.service.BookingService;
import com.example.hotelmgmt.service.LoyaltyService;
import com.example.hotelmgmt.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired private BookingService bookingService;
    @Autowired private RoomService    roomService;
    @Autowired private JwtUtil        jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private LoyaltyService loyaltyService;

    // Book a room
    @PostMapping("/book")
    public ResponseEntity<?> bookRoom(@RequestBody BookingRequest request,
                                       @RequestHeader("Authorization") String header) {
        return ResponseEntity.ok(bookingService.bookRoom(request, header.substring(7)));
    }

    // My bookings
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestHeader("Authorization") String header) {
        String email = jwtUtil.extractEmail(header.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    // Cancel a booking
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    // Quick rebook
    @PostMapping("/rebook/{originalBookingId}")
    public ResponseEntity<?> rebookRoom(@PathVariable Long originalBookingId,
                                         @RequestParam String checkIn,
                                         @RequestParam String checkOut,
                                         @RequestHeader("Authorization") String header) {
        return ResponseEntity.ok(bookingService.rebookRoom(
                originalBookingId,
                LocalDate.parse(checkIn),
                LocalDate.parse(checkOut),
                header.substring(7)));
    }

    // Available dates for a room (next 30 days)
    @GetMapping("/available-dates/{roomId}")
    public ResponseEntity<List<String>> getAvailableDates(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getAvailableSlots(roomId));
    }

    // My loyalty points & tier
    @GetMapping("/my-loyalty")
    public ResponseEntity<?> getMyLoyalty(@RequestHeader("Authorization") String header) {
        String email = jwtUtil.extractEmail(header.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LoyaltyPoints lp = loyaltyService.getLoyaltyInfo(user.getId());
        if (lp == null)
            return ResponseEntity.ok(Map.of(
                    "points",  0,
                    "tier",    "BRONZE",
                    "message", "No bookings yet — start booking to earn points!"));
        return ResponseEntity.ok(Map.of(
                "points",       lp.getPoints(),
                "tier",         lp.getTier(),
                "tierDiscount", (int)(loyaltyService.getTierDiscount(lp.getTier()) * 100) + "% off on next booking"));
    }
}
