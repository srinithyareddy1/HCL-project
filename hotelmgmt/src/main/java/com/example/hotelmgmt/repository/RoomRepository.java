package com.example.hotelmgmt.repository;

import com.example.hotelmgmt.entity.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.id = :id")
    Optional<Room> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT r FROM Room r WHERE " +
           "(:hotelId IS NULL OR r.hotel.id = :hotelId) AND " +
           "(:roomType IS NULL OR LOWER(r.roomType) LIKE LOWER(CONCAT('%', :roomType, '%'))) AND " +
           "(:minPrice IS NULL OR r.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR r.price <= :maxPrice) AND " +
           "(:capacity IS NULL OR r.capacity >= :capacity)")
    List<Room> searchRooms(
            @Param("hotelId") Long hotelId,
            @Param("roomType") String roomType,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("capacity") Integer capacity);
}
