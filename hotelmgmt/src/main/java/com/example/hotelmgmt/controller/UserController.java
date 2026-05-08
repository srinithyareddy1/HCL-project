package com.example.hotelmgmt.controller;

import com.example.hotelmgmt.config.JwtUtil;
import com.example.hotelmgmt.entity.User;
import com.example.hotelmgmt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil        jwtUtil;

    // Get own profile
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@RequestHeader("Authorization") String header) {
        String email = jwtUtil.extractEmail(header.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of(
                "id",    user.getId(),
                "name",  user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : ""
        ));
    }
}
