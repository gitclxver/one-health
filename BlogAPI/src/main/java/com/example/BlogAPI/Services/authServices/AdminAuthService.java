package com.example.BlogAPI.Services.authServices;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Admin;
import com.example.BlogAPI.Repositories.AdminRepository;
import com.example.BlogAPI.Security.jwt.JwtUtil;

@Service
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AdminAuthService(AdminRepository adminRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String authenticateAdmin(String email, String password) {
        Optional<Admin> adminOptional = adminRepository.findByEmail(email);
        if (adminOptional.isEmpty()) {
            throw new RuntimeException("Admin not found");
        }

        Admin admin = adminOptional.get();
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Use the new token generation with role
        return jwtUtil.generateToken(email, "ADMIN");
    }

    public boolean verifyToken(String token) {
        return jwtUtil.isTokenValid(token);
    }

    public String getEmailFromToken(String token) {
        try {
            return jwtUtil.getUsernameFromToken(token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    public String refreshToken(String token) {
        try {
            return jwtUtil.refreshToken(token);
        } catch (Exception e) {
            throw new RuntimeException("Token refresh failed");
        }
    }
}