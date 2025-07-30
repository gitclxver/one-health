package com.example.BlogAPI.Services.userServices;


import com.example.BlogAPI.Exceptions.noUsernameOrPasswordException;
import com.example.BlogAPI.Models.LoginDTO;
import com.example.BlogAPI.Models.user;
import com.example.BlogAPI.Models.userDTO;
import com.example.BlogAPI.Repositories.Command;
import com.example.BlogAPI.Repositories.userRepository;
import com.example.BlogAPI.Security.jwt.jwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class Login implements Command<LoginDTO, userDTO> {
    private user user;
    private userDTO userDto;
    private final AuthenticationManager manager;
    private final userRepository userRepo;

    public Login(AuthenticationManager manager, userRepository userRepo) {
        this.manager = manager;
        this.userRepo = userRepo;
    }

    @Override
    public ResponseEntity<userDTO> execute(LoginDTO input) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        if (userRepo.existsByEmail(input.getEmail())&& encoder.matches(input.getPassword(),userRepo.findByEmail(input.getEmail()).getPassword())){
            user = userRepo.findByEmail(input.getEmail());
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                    input.getEmail(),input.getPassword()
            );
            Authentication auth = manager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            String jwtToken = jwtUtil.generateToken((User) auth.getPrincipal());
            userDto = new userDTO(user,jwtToken);
            return ResponseEntity.ok().body(userDto);
        }else {
            throw new noUsernameOrPasswordException();
        }
    }


}
