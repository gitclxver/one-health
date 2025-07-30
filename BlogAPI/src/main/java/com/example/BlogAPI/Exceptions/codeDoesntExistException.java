package com.example.BlogAPI.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class codeDoesntExistException extends RuntimeException {
    public codeDoesntExistException(){
        super("invalid code");
    }
}
