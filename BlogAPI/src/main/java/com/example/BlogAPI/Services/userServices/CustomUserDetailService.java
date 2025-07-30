package com.example.BlogAPI.Services.userServices;


import com.example.BlogAPI.Models.user;
import com.example.BlogAPI.Repositories.userRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
@Service
public class CustomUserDetailService implements UserDetailsService{
        private final userRepository userepo;

    public CustomUserDetailService(userRepository userepo) {
        this.userepo = userepo;
    }


    @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            user UserCredentials;
            UserCredentials = userepo.findByEmail(email);

            return org.springframework.security.core.userdetails.User
                    .withUsername(UserCredentials.getEmail())
                    .password(UserCredentials.getPassword())
                    .authorities(UserCredentials.getUserRole().toString().toUpperCase())
                    .build();
        }


}
