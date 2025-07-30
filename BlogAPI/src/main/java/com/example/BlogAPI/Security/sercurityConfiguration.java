package com.example.BlogAPI.Security;



import com.example.BlogAPI.Security.jwt.jwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class sercurityConfiguration {
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity httpSecurity) throws Exception{
        return httpSecurity.getSharedObject(AuthenticationManagerBuilder.class).build();
    }
    @Bean
    public PasswordEncoder passwordencoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                //allows for POST, PUT, DELETE mappings with authentication
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize->{
                    authorize.requestMatchers("user/login").permitAll();
                    authorize.requestMatchers("user/signup").permitAll();
                    authorize.requestMatchers("user/codeLogin").permitAll();
                    authorize.requestMatchers(HttpMethod.POST ,"/Admin/addNewTeam").hasAuthority("ADMIN");
                  authorize.anyRequest().authenticated();
                })
                .addFilterBefore(JWTAuthenticatIONFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    @Bean
    public jwtAuthenticationFilter JWTAuthenticatIONFilter(){
        return new jwtAuthenticationFilter();
    }
}
