package com.example.hotelmgmt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loyalty_points")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class LoyaltyPoints {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private Integer points = 0;
    private String tier = "BRONZE";  // BRONZE / SILVER / GOLD / PLATINUM
}
