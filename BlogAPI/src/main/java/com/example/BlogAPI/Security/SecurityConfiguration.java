package com.example.BlogAPI.Security;

import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.BlogAPI.Security.jwt.JwtAuthenticationFilter;
import com.example.BlogAPI.Security.jwt.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@CrossOrigin
@EnableWebSecurity
public class SecurityConfiguration {

    private final JwtUtil jwtUtil;
    private final AdminDetailsService adminDetailsService;

    public SecurityConfiguration(JwtUtil jwtUtil, AdminDetailsService adminDetailsService) {
        this.jwtUtil = jwtUtil;
        this.adminDetailsService = adminDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
        HttpSecurity http,
        AdminDetailsService adminDetailsService
    ) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
            http.getSharedObject(AuthenticationManagerBuilder.class);
        
        authenticationManagerBuilder
            .userDetailsService(adminDetailsService)
            .passwordEncoder(passwordEncoder());
        
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/admin/login").permitAll()
                .requestMatchers("/api/v1/admin/refresh").permitAll()
                .requestMatchers("/api/v1/uploads/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/articles/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/newsletter/subscribe").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/newsletter/subscribe").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/newsletter/unsubscribe").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/newsletter/verify/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/members/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/events/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/v1/test/**").permitAll() // Added test endpoint
                
                // Everything else needs authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Add CORS filter before authentication
            .addFilterBefore(new CorsFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific origins instead of wildcard
        config.addAllowedOrigin("https://www.nustonehealthsociety.org");
        config.addAllowedOrigin("https://nustonehealthsociety.org");
        config.addAllowedOrigin("http://localhost:3000"); // For local development
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        config.setExposedHeaders(List.of("Authorization", "Content-Type", "Access-Control-Allow-Origin", 
                                       "Access-Control-Allow-Credentials"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // Simple CORS filter to handle preflight requests
    public static class CorsFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                      FilterChain filterChain) throws ServletException, IOException {
            
            String origin = request.getHeader("Origin");
            
            // Allow specific origins
            if ("https://www.nustonehealthsociety.org".equals(origin) || 
                "https://nustonehealthsociety.org".equals(origin) ||
                "http://localhost:3000".equals(origin)) {
                response.setHeader("Access-Control-Allow-Origin", origin);
            }
            
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers", "authorization, content-type, xsrf-token, Cache-Control, " +
                    "X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, " +
                    "X-File-Name, X-CSRF-Token, Authorization, Origin, Access-Control-Request-Method, " +
                    "Access-Control-Request-Headers");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Expose-Headers", "Authorization, Content-Type, Access-Control-Allow-Origin, " +
                    "Access-Control-Allow-Credentials");
            
            if ("OPTIONS".equals(request.getMethod())) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                filterChain.doFilter(request, response);
            }
        }
    }
}