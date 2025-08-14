package com.example.BlogAPI.Models;

public class AuthResponseDTO {
    private final String token;
    private final String tokenType = "Bearer";
    private String username;
    private String email;

    public AuthResponseDTO(String token) {
        this.token = token;
    }
    
    public AuthResponseDTO(String token, String username, String email) {
        this.token = token;
        this.username = username;
        this.email = email;
    }

    public String getToken() {
        return token;
    }
    
    public String getTokenType() {
        return tokenType;
    }

    public String getUsername() { 
        return username; 
    }
    
    public void setUsername(String username) { 
        this.username = username; 
    }
    
    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }
}