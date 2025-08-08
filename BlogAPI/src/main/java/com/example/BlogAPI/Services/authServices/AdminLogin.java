package com.example.BlogAPI.Services.authServices;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Admin;
import com.example.BlogAPI.Models.AdminAuthResponse;
import com.example.BlogAPI.Models.AdminLoginDTO;
import com.example.BlogAPI.Repositories.AdminRepository;
import com.example.BlogAPI.Security.jwt.JwtUtil;

@Service
public class AdminLogin {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AdminRepository adminRepository;

    public AdminLogin(AuthenticationManager authenticationManager,
                    JwtUtil jwtUtil,
                    AdminRepository adminRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.adminRepository = adminRepository;
    }

    public ResponseEntity<AdminAuthResponse> execute(AdminLoginDTO credentials) {
        // First try to find admin by username or email
        Admin admin = adminRepository.findByUsername(credentials.getUsernameOrEmail())
                .or(() -> adminRepository.findByEmail(credentials.getUsernameOrEmail()))
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Authenticate with Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        admin.getUsername(), // Use the actual username for authentication
                        credentials.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Update last login
        admin.setLastLogin(java.time.LocalDateTime.now());
        adminRepository.save(admin);

        // Generate JWT token
        String jwt = jwtUtil.generateToken(authentication);

        return ResponseEntity.ok(new AdminAuthResponse(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                jwt,
                admin.getLastLogin()
        ));
    }
}