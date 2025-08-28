package com.example.BlogAPI.Security;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.BlogAPI.Security.jwt.JwtAuthenticationFilter;
import com.example.BlogAPI.Security.jwt.JwtUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final JwtUtil jwtUtil;
    private final AdminDetailsService adminDetailsService;
    private final RailwayCorsFilter railwayCorsFilter;

    public SecurityConfiguration(JwtUtil jwtUtil, AdminDetailsService adminDetailsService, 
                               RailwayCorsFilter railwayCorsFilter) {
        this.jwtUtil = jwtUtil;
        this.adminDetailsService = adminDetailsService;
        this.railwayCorsFilter = railwayCorsFilter;
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
                .requestMatchers("/api/v1/test/**").permitAll()
                
                // Everything else needs authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Add Railway CORS filter first
            .addFilterBefore(railwayCorsFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific origins
        config.addAllowedOrigin("https://www.nustonehealthsociety.org");
        config.addAllowedOrigin("https://nustonehealthsociety.org");
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:8080");
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}