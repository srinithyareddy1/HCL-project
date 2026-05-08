package com.example.hotelmgmt.controller;

import com.example.hotelmgmt.entity.Hotel;
import com.example.hotelmgmt.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/hotels")
@CrossOrigin("*")
public class HotelController {

    @Autowired private HotelService hotelService;

    // Get all hotels
    @GetMapping("/all")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    // Search hotels by location, name, minRating
    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minRating) {
        return ResponseEntity.ok(hotelService.searchHotels(location, name, minRating));
    }

    // Get hotel by ID
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }
}
