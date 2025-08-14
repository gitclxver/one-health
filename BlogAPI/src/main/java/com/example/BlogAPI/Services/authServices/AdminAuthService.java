package com.example.BlogAPI.Services.authServices;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Admin;
import com.example.BlogAPI.Repositories.AdminRepository;
import com.example.BlogAPI.Security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public String authenticateAdmin(String usernameOrEmail, String password) {
        Admin admin = adminRepository.findByUsernameOrEmailIgnoreCase(usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(usernameOrEmail, password)
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtUtil.generateToken(admin.getEmail(), admin.getRole().name());
    }

    public boolean verifyToken(String token) {
        if (invalidatedTokens.contains(token)) {
            return false;
        }
        return jwtUtil.validateToken(token);
    }

    public String refreshToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        return jwtUtil.refreshToken(token);
    }

    private final Set<String> invalidatedTokens = Collections.synchronizedSet(new HashSet<>());

    public void invalidateToken(String token) {
        invalidatedTokens.add(token);
    }


}
