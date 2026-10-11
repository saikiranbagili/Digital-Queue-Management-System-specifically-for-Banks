package com.bankq.service;

import com.bankq.dto.LoginRequest;
import com.bankq.dto.LoginResponse;
import com.bankq.dto.RegisterRequest;
import com.bankq.dto.UserResponse;
import com.bankq.entity.Role;
import com.bankq.entity.User;
import com.bankq.exception.BadRequestException;
import com.bankq.exception.ResourceNotFoundException;
import com.bankq.repository.UserRepository;
import com.bankq.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       JwtUtils jwtUtils,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email address already exists. Please sign in.");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.CUSTOMER;
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName().trim(),
                email,
                encodedPassword,
                role,
                request.getBankName(),
                request.getAccountNumber()
        );
        user = userRepository.save(user);

        String token = jwtUtils.generateToken(user);
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getBankName(),
                user.getAccountNumber(),
                user.getCreatedAt()
        );

        return new LoginResponse(token, userResponse);
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        // If user logged in and provided bank or account number on login page, update and save
        boolean updated = false;
        if (request.getBankName() != null && !request.getBankName().isBlank()) {
            user.setBankName(request.getBankName().trim());
            updated = true;
        }
        if (request.getAccountNumber() != null && !request.getAccountNumber().isBlank()) {
            user.setAccountNumber(request.getAccountNumber().trim());
            updated = true;
        }
        if (updated) {
            user = userRepository.save(user);
        }

        String token = jwtUtils.generateToken(user);
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getBankName(),
                user.getAccountNumber(),
                user.getCreatedAt()
        );

        return new LoginResponse(token, userResponse);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getBankName(),
                user.getAccountNumber(),
                user.getCreatedAt()
        );
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
