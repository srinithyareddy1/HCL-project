package com.example.hotelmgmt.service;

import com.example.hotelmgmt.entity.LoyaltyPoints;
import com.example.hotelmgmt.entity.User;
import com.example.hotelmgmt.repository.LoyaltyPointsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendRegistrationConfirmation(String toEmail, String name) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(toEmail);
            msg.setSubject("Welcome to GrandStay Hotels! 🏨");
            msg.setText("Hello " + name + ",\n\nWelcome to GrandStay Hotels! Your account has been created.\n\n" +
                    "Start earning loyalty points with every booking!\n\nThe GrandStay Team");
            mailSender.send(msg);
            log.info("Registration email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send registration email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendBookingConfirmation(String toEmail, String roomName, String checkIn,
                                        String checkOut, Long bookingId, Double totalPrice) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(toEmail);
            msg.setSubject("Booking Confirmed ✅ — Reservation #" + bookingId);
            msg.setText("Your booking is confirmed!\n\n" +
                    "Reservation #: " + bookingId + "\n" +
                    "Room Type   : " + roomName + "\n" +
                    "Check-In    : " + checkIn + "\n" +
                    "Check-Out   : " + checkOut + "\n" +
                    "Total Price : ₹" + String.format("%.2f", totalPrice) + "\n\n" +
                    "Thank you for choosing GrandStay Hotels!\nThe GrandStay Team");
            mailSender.send(msg);
            log.info("Booking confirmation email sent to {} for booking #{}", toEmail, bookingId);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendBookingCancellation(String toEmail, String roomName, String checkIn, String checkOut) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(toEmail);
            msg.setSubject("Booking Cancelled ❌ — GrandStay Hotels");
            msg.setText("Your booking has been cancelled.\n\n" +
                    "Room Type : " + roomName + "\n" +
                    "Check-In  : " + checkIn + "\n" +
                    "Check-Out : " + checkOut + "\n\n" +
                    "We hope to see you again!\nThe GrandStay Team");
            mailSender.send(msg);
            log.info("Cancellation email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send cancellation email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPromoCode(String toEmail, String name, String code,
                               String description, Double discountValue, String discountType, String validUntil) {
        try {
            String discountText = discountType.equals("PERCENTAGE")
                    ? discountValue.intValue() + "% off"
                    : "₹" + discountValue.intValue() + " flat off";
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(toEmail);
            msg.setSubject("🎉 Exclusive Offer: " + discountText + " — GrandStay Hotels");
            msg.setText("Hello " + name + ",\n\n" + description + "\n\n" +
                    "Promo Code  : " + code + "\n" +
                    "Discount    : " + discountText + "\n" +
                    "Valid Until : " + validUntil + "\n\n" +
                    "The GrandStay Team");
            mailSender.send(msg);
            log.info("Promo email sent to {} with code {}", toEmail, code);
        } catch (Exception e) {
            log.error("Failed to send promo email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendLoyaltyPointsUpdate(String toEmail, String name, int pointsEarned,
                                         int totalPoints, String tier) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(toEmail);
            msg.setSubject("🌟 Loyalty Points Updated — GrandStay Rewards");
            msg.setText("Hello " + name + ",\n\n" +
                    "Points Earned : +" + pointsEarned + "\n" +
                    "Total Points  : " + totalPoints + "\n" +
                    "Current Tier  : " + tier + "\n\n" +
                    "Keep booking to unlock higher tiers!\nThe GrandStay Team");
            mailSender.send(msg);
            log.info("Loyalty points email sent to {} — total: {}", toEmail, totalPoints);
        } catch (Exception e) {
            log.error("Failed to send loyalty email to {}: {}", toEmail, e.getMessage());
        }
    }
}
