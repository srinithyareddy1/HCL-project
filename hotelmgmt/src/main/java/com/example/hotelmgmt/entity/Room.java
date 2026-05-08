package com.example.hotelmgmt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomType;   // SINGLE, DOUBLE, SUITE, DELUXE
    private Double price;
    private Integer capacity;
    private Boolean available;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}
