package com.example.hotelmgmt.repository;

import com.example.hotelmgmt.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:minRating IS NULL OR h.rating >= :minRating)")
    List<Hotel> searchHotels(
            @Param("location") String location,
            @Param("name") String name,
            @Param("minRating") Double minRating);
}
