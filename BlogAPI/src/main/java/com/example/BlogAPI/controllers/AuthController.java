package com.example.BlogAPI.controllers;

import com.example.BlogAPI.Services.authServices.AdminAuthService;
import com.example.BlogAPI.Models.AdminLoginDTO;
import com.example.BlogAPI.Models.AuthResponseDTO;
import com.example.BlogAPI.Models.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AdminAuthService adminAuthService;

    public AuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginDTO loginDTO) {
        try {
            String token = adminAuthService.authenticateAdmin(
                loginDTO.getUsernameOrEmail(), 
                loginDTO.getPassword()
            );
            return ResponseEntity.ok()
                    .header("Access-Control-Expose-Headers", "Authorization")
                    .header("Authorization", "Bearer " + token)
                    .body(new AuthResponseDTO(token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO(e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO("Invalid token format"));
        }

        String token = authHeader.substring(7);
        boolean isValid = adminAuthService.verifyToken(token);
        return isValid ? ResponseEntity.ok().build() 
                     : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponseDTO("Invalid token format"));
        }

        try {
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
}