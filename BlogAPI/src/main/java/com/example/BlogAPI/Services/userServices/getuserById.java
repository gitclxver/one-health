package com.example.BlogAPI.Services.userServices;

import com.example.BlogAPI.Exceptions.noUsersAvailableException;
import com.example.BlogAPI.Models.user;
import com.example.BlogAPI.Repositories.Command;
import com.example.BlogAPI.Repositories.userRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class getuserById implements Command<Long, user> {
    private final userRepository userRepo;

    public getuserById(userRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public ResponseEntity<user> execute(Long input) {
        user userById = userRepo.findById(input).orElseThrow(noUsersAvailableException::new);
        return ResponseEntity.ok().body(userById);
    }
}
