package com.example.BlogAPI.Services.userServices;

import com.example.BlogAPI.Exceptions.noUsersAvailableException;
import com.example.BlogAPI.Models.AlluserDTO;
import com.example.BlogAPI.Models.user;
import com.example.BlogAPI.Models.userDTO;
import com.example.BlogAPI.Repositories.userRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class getAllUsers {
    private final userRepository userRepo;

    List<AlluserDTO> users;

    public getAllUsers(userRepository userRepo) {
        this.userRepo = userRepo;
    }
    public ResponseEntity<List<AlluserDTO>> getAllusers(){
        if (!(userRepo.findAll().isEmpty())) {
            userRepo.findAll().forEach(user -> {
                users.add(new AlluserDTO(user));
            });
            return ResponseEntity.ok().body(users);
        }
        throw new noUsersAvailableException();
    }
}
