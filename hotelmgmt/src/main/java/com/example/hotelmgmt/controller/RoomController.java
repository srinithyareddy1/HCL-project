package com.example.hotelmgmt.controller;

import com.example.hotelmgmt.entity.Room;
import com.example.hotelmgmt.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rooms")
@CrossOrigin("*")
public class RoomController {

    @Autowired private RoomService roomService;

    // Get all rooms
    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // Get rooms by hotel
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotel(hotelId));
    }

    // Search/filter rooms
    @GetMapping("/search")
    public ResponseEntity<List<Room>> searchRooms(
            @RequestParam(required = false) Long    hotelId,
            @RequestParam(required = false) String  roomType,
            @RequestParam(required = false) Double  minPrice,
            @RequestParam(required = false) Double  maxPrice,
            @RequestParam(required = false) Integer capacity) {
        return ResponseEntity.ok(roomService.searchRooms(hotelId, roomType, minPrice, maxPrice, capacity));
    }

    // Available rooms across all hotels for a date range
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        return ResponseEntity.ok(roomService.getAvailabRooms(
                LocalDate.parse(checkIn), LocalDate.parse(checkOut)));
    }

    // Available rooms for a specific hotel on given dates
    @GetMapping("/hotel/{hotelId}/available")
    public ResponseEntity<List<Room>> getAvailableRoomsByHotel(
            @PathVariable Long hotelId,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByHotel(
                hotelId, LocalDate.parse(checkIn), LocalDate.parse(checkOut)));
    }
}
