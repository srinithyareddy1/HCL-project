package com.example.hotelmgmt.dto;

import lombok.Data;

@Data
public class RoomRequest {
    private String  roomType;
    private Double  price;
    private Integer capacity;
    private Boolean available;
    private String  imageUrl;
    private Long    hotelId;
}
