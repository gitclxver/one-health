package com.example.BlogAPI.Security;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RailwayCorsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        // Get the origin from the request
        String origin = request.getHeader("Origin");
        
        // Allow specific origins
        if (origin != null && (
            origin.equals("https://www.nustonehealthsociety.org") || 
            origin.equals("https://nustonehealthsociety.org") ||
            origin.equals("http://localhost:3000") ||
            origin.equals("http://localhost:8080"))) {
            
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
            response.setHeader("Access-Control-Allow-Headers", "authorization, content-type, x-requested-with, accept, origin, access-control-request-method, access-control-request-headers");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Max-Age", "3600");
            
            // Railway-specific headers
            response.setHeader("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
        }

        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        filterChain.doFilter(request, response);
    }
}