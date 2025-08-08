package com.example.BlogAPI.Models;

import jakarta.validation.constraints.NotBlank;

public class AdminLoginDTO {
    
    @NotBlank
    private String usernameOrEmail;  // Changed from 'username' to be more generic
    
    @NotBlank
    private String password;

    // Constructors
    public AdminLoginDTO() {}

    public AdminLoginDTO(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    // Getters
    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    // Setters (optional but recommended)
    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}