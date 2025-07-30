package com.example.BlogAPI.Security.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class jwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;

        //header: Authorization Bearer [jwt]
        if(authHeader!=null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
        }
        if(token != null && jwtUtil.isTokenValid(token)) {
            Claims claims = jwtUtil.getClaims(token);

            // Get role from claims
            String role = claims.get("role", String.class);
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority(role)
            );


            Authentication Auth = new UsernamePasswordAuthenticationToken(
                    claims.getSubject(),
                    null,
                    authorities  // Add authorities here
            );

            SecurityContextHolder.getContext().setAuthentication(Auth);
        }
        filterChain.doFilter(request,response);
    }
}
