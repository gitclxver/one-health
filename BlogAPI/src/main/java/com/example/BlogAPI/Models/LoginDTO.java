package com.example.BlogAPI.Models;


import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;


public class LoginDTO {

    @NotNull(message = "please enter your email")
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\\\.[a-z]{2,3}",flags = Pattern.Flag.CASE_INSENSITIVE,message = "invalid email format.")
    @Column(name = "email",unique = true)
    private String email;
    @NotNull(message = "Please enter your password")
    @Column(name = "password")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
