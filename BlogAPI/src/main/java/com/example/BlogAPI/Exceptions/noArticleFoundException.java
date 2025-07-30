package com.example.BlogAPI.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class noArticleFoundException extends RuntimeException{
    public noArticleFoundException(){
        super("No Articles found");
    }
}
