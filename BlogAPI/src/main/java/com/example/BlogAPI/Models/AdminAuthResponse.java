package com.example.BlogAPI.Models;

import java.time.LocalDateTime;

public class AdminAuthResponse {

    private Long id;
    private String username;
    private String email;
    private String token;
    private LocalDateTime lastLogin;

    public AdminAuthResponse(Long id, String username, String email, String token, LocalDateTime lastLogin) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.token = token;
        this.lastLogin = lastLogin;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }
}
