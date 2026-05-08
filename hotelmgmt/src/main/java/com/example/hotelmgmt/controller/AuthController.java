package com.example.hotelmgmt.controller;

import com.example.hotelmgmt.config.JwtUtil;
import com.example.hotelmgmt.dto.LoginRequest;
import com.example.hotelmgmt.dto.RegisterRequest;
import com.example.hotelmgmt.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired private AuthService authService;

    // ── Register ──────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(Map.of("message", authService.registerUser(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, String> res = authService.loginUser(request);
            return ResponseEntity.ok(Map.of(
                    "token",   res.get("token"),
                    "message", "Login successful"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}
