package com.example.BlogAPI.Models;

import jakarta.validation.constraints.NotBlank;

public class AdminLoginDTO {
    
    @NotBlank(message = "Username or email cannot be blank")
    private String usernameOrEmail;
    
    @NotBlank(message = "Password cannot be blank")
    private String password;

    // Constructors
    public AdminLoginDTO() {}

    public AdminLoginDTO(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    // Getters and Setters
    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "AdminLoginDTO{usernameOrEmail='" + usernameOrEmail + "'}";
    }
}