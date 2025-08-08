package com.example.BlogAPI.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Models.AdminAuthResponse;
import com.example.BlogAPI.Models.AdminLoginDTO;
import com.example.BlogAPI.Services.authServices.AdminLogin;
import com.example.BlogAPI.Services.authServices.VerifyAdmin;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/auth")
public class AuthController {
    private final AdminLogin adminLogin;
    private final VerifyAdmin verifyAdmin;

    public AuthController(AdminLogin adminLogin, VerifyAdmin verifyAdmin) {
        this.adminLogin = adminLogin;
        this.verifyAdmin = verifyAdmin;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminAuthResponse> login(@Valid @RequestBody AdminLoginDTO credentials) {
        return adminLogin.execute(credentials);
    }

    @GetMapping("/verify")
    public ResponseEntity<Boolean> verifyAdmin() {
        return verifyAdmin.execute();
    }
}