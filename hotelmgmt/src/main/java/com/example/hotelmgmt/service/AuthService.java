package com.example.hotelmgmt.service;

import com.example.hotelmgmt.config.JwtUtil;
import com.example.hotelmgmt.dto.LoginRequest;
import com.example.hotelmgmt.dto.RegisterRequest;
import com.example.hotelmgmt.entity.User;
import com.example.hotelmgmt.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Autowired private UserRepository  userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil         jwtUtil;
    @Autowired private EmailService    emailService;

    public String registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new RuntimeException("Email already exists: " + request.getEmail());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("USER");   // default — no ROLE prefix, no admin
        userRepository.save(user);

        emailService.sendRegistrationConfirmation(user.getEmail(), user.getName());
        log.info("New user registered: {} ({})", user.getName(), user.getEmail());
        return "User registered successfully";
    }

    public Map<String, String> loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid password");

        String token = jwtUtil.generateToken(user.getEmail());
        log.info("User logged in: {}", user.getEmail());
        return Map.of("token", token);
    }
}
