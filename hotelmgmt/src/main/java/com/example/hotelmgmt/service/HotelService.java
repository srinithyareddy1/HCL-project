package com.example.hotelmgmt.service;

import com.example.hotelmgmt.dto.HotelRequest;
import com.example.hotelmgmt.entity.Hotel;
import com.example.hotelmgmt.entity.Room;
import com.example.hotelmgmt.repository.HotelRepository;
import com.example.hotelmgmt.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HotelService {

    private static final Logger log = LoggerFactory.getLogger(HotelService.class);

    @Autowired private HotelRepository hotelRepository;
    @Autowired private RoomRepository  roomRepository;
    @Autowired private RoomService     roomService;

    public String addHotel(HotelRequest request) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setRating(request.getRating());
        hotel.setImageUrl(request.getImageUrl());
        hotelRepository.save(hotel);
        log.info("Hotel added: {} in {}", hotel.getName(), hotel.getLocation());
        return "Hotel added successfully";
    }

    public List<Hotel> getAllHotels() { return hotelRepository.findAll(); }

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

    public String updateHotel(Long id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setRating(request.getRating());
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty())
            hotel.setImageUrl(request.getImageUrl());
        hotelRepository.save(hotel);
        log.info("Hotel #{} updated: {}", id, hotel.getName());
        return "Hotel updated successfully";
    }

    public String deleteHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + hotelId));
        List<Room> rooms = roomRepository.findByHotelId(hotelId);
        for (Room room : rooms) roomService.deleteRoom(room.getId());
        hotelRepository.delete(hotel);
        log.info("Hotel #{} deleted: {}", hotelId, hotel.getName());
        return "Hotel deleted successfully";
    }
}
