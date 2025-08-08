package com.example.BlogAPI.Models;

public class AuthResponseDTO {
    private final String token;
    private final String tokenType = "Bearer";

    public AuthResponseDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }
}
