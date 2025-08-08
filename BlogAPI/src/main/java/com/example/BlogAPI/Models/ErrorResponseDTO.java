package com.example.BlogAPI.Models;

public class ErrorResponseDTO {
    private final String message;

    public ErrorResponseDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}