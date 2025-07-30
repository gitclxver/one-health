package com.example.BlogAPI.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class noUsernameOrPasswordException extends RuntimeException {
    public noUsernameOrPasswordException(){
       super("invalid username or password");
    }
}
