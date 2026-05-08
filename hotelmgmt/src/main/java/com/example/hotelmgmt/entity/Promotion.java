package com.example.hotelmgmt.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "promotions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private String description;
    private String discountType;   // PERCENTAGE or FLAT
    private Double discountValue;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private Boolean active = true;
    private Double minimumBookingAmount = 0.0;
}
