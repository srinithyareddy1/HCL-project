package com.example.hotelmgmt.service;

import com.example.hotelmgmt.dto.RoomRequest;
import com.example.hotelmgmt.entity.*;
import com.example.hotelmgmt.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class RoomService {

    private static final Logger log = LoggerFactory.getLogger(RoomService.class);

    @Autowired private RoomRepository    roomRepository;
    @Autowired private HotelRepository   hotelRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private EmailService      emailService;

    public String addRoom(RoomRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + request.getHotelId()));
        Room room = new Room();
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setAvailable(request.getAvailable());
        room.setImageUrl(request.getImageUrl());
        room.setHotel(hotel);
        roomRepository.save(room);
        log.info("Room added: {} (₹{}) to hotel #{}", room.getRoomType(), room.getPrice(), hotel.getId());
        return "Room added successfully";
    }

    public List<Room> getRoomsByHotel(Long hotelId) { return roomRepository.findByHotelId(hotelId); }
    public List<Room> getAllRooms()                  { return roomRepository.findAll(); }

    public List<Room> searchRooms(Long hotelId, String roomType,
                                   Double minPrice, Double maxPrice, Integer capacity) {
        List<Room> results = roomRepository.searchRooms(hotelId, roomType, minPrice, maxPrice, capacity);
        log.info("Room search → {} results", results.size());
        return results;
    }

    public String updateRoom(Long roomId, RoomRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        if (request.getAvailable() != null) room.setAvailable(request.getAvailable());
        if (request.getHotelId() != null) {
            Hotel hotel = hotelRepository.findById(request.getHotelId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            room.setHotel(hotel);
        }
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty())
            room.setImageUrl(request.getImageUrl());
        roomRepository.save(room);
        log.info("Room #{} updated: {}", roomId, room.getRoomType());
        return "Room updated successfully";
    }

    public String deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        List<Booking> bookings = bookingRepository.findByRoomId(roomId);
        for (Booking b : bookings) {
            try {
                if (!"CANCELLED".equalsIgnoreCase(b.getStatus()))
                    emailService.sendBookingCancellation(b.getUser().getEmail(),
                            b.getRoom().getRoomType(), b.getCheckIn().toString(), b.getCheckOut().toString());
            } catch (Exception e) {
                log.warn("Email failed for user {}: {}", b.getUser().getEmail(), e.getMessage());
            }
        }
        bookingRepository.deleteAll(bookings);
        roomRepository.delete(room);
        log.info("Room #{} deleted, {} bookings removed", roomId, bookings.size());
        return "Room deleted successfully";
    }

    public List<Room> getAvailabRooms(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAll().stream()
                .filter(r -> isRoomAvailable(r.getId(), checkIn, checkOut))
                .toList();
    }

    public List<Room> getAvailableRoomsByHotel(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findByHotelId(hotelId).stream()
                .filter(r -> isRoomAvailable(r.getId(), checkIn, checkOut))
                .toList();
    }

    public List<String> getAvailableSlots(Long roomId) {
        List<Booking> bookings = bookingRepository.findByRoomId(roomId);
        List<String>  available = new ArrayList<>();
        LocalDate     today     = LocalDate.now();
        for (int i = 0; i < 30; i++) {
            LocalDate date = today.plusDays(i);
            boolean isBooked = bookings.stream()
                    .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus()))
                    .anyMatch(b -> !date.isBefore(b.getCheckIn()) && date.isBefore(b.getCheckOut()));
            if (!isBooked) available.add(date.toString());
        }
        return available;
    }

    private boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        return bookingRepository.findByRoomId(roomId).stream()
                .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus()))
                .noneMatch(b -> checkOut.isAfter(b.getCheckIn()) && checkIn.isBefore(b.getCheckOut()));
    }
}
