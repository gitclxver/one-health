package com.example.BlogAPI.controllers;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Models.AdminLoginDTO;
import com.example.BlogAPI.Models.AuthResponseDTO;
import com.example.BlogAPI.Models.ErrorResponseDTO;
import com.example.BlogAPI.Services.authServices.AdminAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginDTO loginDTO) {
        try {
            String token = adminAuthService.authenticateAdmin(
                loginDTO.getUsernameOrEmail(), 
                loginDTO.getPassword()
            );

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + token)
                    .body(new AuthResponseDTO(token));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO(e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseDTO("Invalid token format"));
            }

            String token = authHeader.substring(7);
            boolean isValid = adminAuthService.verifyToken(token);
            
            return isValid 
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO("Invalid token"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO(e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponseDTO("Invalid token format"));
            }

            String token = authHeader.substring(7);
            String newToken = adminAuthService.refreshToken(token);
            
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + newToken)
                    .body(new AuthResponseDTO(newToken));
                    
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponseDTO("Invalid token format"));
            }

            String token = authHeader.substring(7);
            adminAuthService.invalidateToken(token);
            
            return ResponseEntity.ok().body(new AuthResponseDTO("Logged out successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO(e.getMessage()));
        }
    }
}
