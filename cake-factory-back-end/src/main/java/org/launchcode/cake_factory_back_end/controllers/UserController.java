package org.launchcode.cake_factory_back_end.controllers;

import jakarta.validation.Valid;
import org.launchcode.cake_factory_back_end.dto.UserDTO;
import org.launchcode.cake_factory_back_end.models.User;
import org.launchcode.cake_factory_back_end.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.security.MessageDigest;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Helper method to hash password with SHA-256
    private String hashPassword(String password) {
        if (password == null || password.isBlank()) {
            // This prevents the RuntimeException from occurring
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashed = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashed) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password");
        }
    }

    //  Helper method to convert User to UserDTO
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    // POST /api/users/register
    @PostMapping(value = "/register")

        public ResponseEntity<?> register(@RequestBody UserDTO userDto) {
            if (userDto.getName() == null || userDto.getName().isBlank()) {
            return new ResponseEntity<>("Name is required", HttpStatus.BAD_REQUEST);
            }
            if (userDto.getEmail() == null || userDto.getEmail().isBlank()) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
            }
        // This check stops the "Password cannot be null or empty" crash!
            if (userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            return new ResponseEntity<>("Password is required", HttpStatus.BAD_REQUEST);
                }

            if (userDto.getName() == null || userDto.getName().trim().isEmpty()) {
                return new ResponseEntity<>("Name is required", HttpStatus.BAD_REQUEST); // 400
            }

            if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
                return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST); // 400
            }

            //  Check if user already exists
            Optional<User> existing = userRepository.findByEmail(userDto.getEmail());
            if (existing.isPresent()) {
                return new ResponseEntity<>("User already exists with this email", HttpStatus.CONFLICT); // 409
            }

            // Mapping and Saving
            User user = new User();
            user.setName(userDto.getName());
            user.setEmail(userDto.getEmail());
            user.setPassword(hashPassword(userDto.getPassword()));

            userRepository.save(user);

            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED); // 201
        }

    // POST /api/users/login
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserDTO loginRequest) throws NoResourceFoundException {

        if (loginRequest.getEmail() == null || loginRequest.getEmail().isBlank()) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
        }

        if (loginRequest.getPassword() == null || loginRequest.getPassword().isBlank()) {
            return new ResponseEntity<>("Password is required", HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NoResourceFoundException(
                        HttpMethod.POST,
                        "/api/users/login",
                        "No account found with this email"
                ));

        // Check password
        String hashedInput = hashPassword(loginRequest.getPassword());
        if (!hashedInput.equals(user.getPassword())) {
            return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED); // 401
        }

        // Convert to DTO for the response
        UserDTO responseDto = new UserDTO(user.getId(), user.getName(), user.getEmail());

        return new ResponseEntity<>(responseDto, HttpStatus.OK); // 200
    }
}