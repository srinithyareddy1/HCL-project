package com.example.hotelmgmt.repository;

import com.example.hotelmgmt.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRoomId(Long roomId);
    List<Booking> findByUserId(Long userId);
}
