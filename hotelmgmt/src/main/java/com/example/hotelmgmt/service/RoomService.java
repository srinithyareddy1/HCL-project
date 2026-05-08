package com.example.hotelmgmt.service;

import com.example.hotelmgmt.entity.Booking;
import com.example.hotelmgmt.entity.Room;
import com.example.hotelmgmt.repository.BookingRepository;
import com.example.hotelmgmt.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    private static final Logger log = LoggerFactory.getLogger(RoomService.class);

    @Autowired private RoomRepository    roomRepository;
    @Autowired private BookingRepository bookingRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public List<Room> searchRooms(Long hotelId, String roomType,
                                   Double minPrice, Double maxPrice, Integer capacity) {
        List<Room> results = roomRepository.searchRooms(hotelId, roomType, minPrice, maxPrice, capacity);
        log.info("Room search → {} results", results.size());
        return results;
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
        List<Booking> bookings  = bookingRepository.findByRoomId(roomId);
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
