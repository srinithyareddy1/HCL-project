package com.example.hotelmgmt.service;

import com.example.hotelmgmt.entity.Hotel;
import com.example.hotelmgmt.repository.HotelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HotelService {

    private static final Logger log = LoggerFactory.getLogger(HotelService.class);

    @Autowired private HotelRepository hotelRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
    }

    public List<Hotel> searchHotels(String location, String name, Double minRating) {
        List<Hotel> results = hotelRepository.searchHotels(location, name, minRating);
        log.info("Hotel search — location='{}' name='{}' minRating={} → {} results",
                location, name, minRating, results.size());
        return results;
    }
}
