package com.merchant.portal.controller;

import com.merchant.portal.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import com.merchant.portal.repository.UserRepository;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Find the user in the database by their username
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(loginRequest.password)) {
                return ResponseEntity.ok(Map.of(
                        "token", "dummy-auth-token-for-" + user.getUsername(),
                        "role", user.getRole()!=null ? user.getRole() : "admin"
                ));
            }
        }
        // If user is not found or password doesn't match, return an error
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}