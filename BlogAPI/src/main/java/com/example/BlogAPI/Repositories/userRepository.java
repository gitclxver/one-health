package com.example.BlogAPI.Repositories;


import com.example.BlogAPI.Models.user;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepository extends JpaRepository<user,Long> {
    boolean existsByEmail(String email);
    user findByEmail(String email);
}
