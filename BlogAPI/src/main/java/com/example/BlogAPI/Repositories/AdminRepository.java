package com.example.BlogAPI.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.BlogAPI.Models.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    
    @Query("SELECT a FROM Admin a WHERE a.username = :identifier OR a.email = :identifier")
    Optional<Admin> findByUsernameOrEmail(@Param("identifier") String identifier);

    Optional<Admin> findByUsernameIgnoreCase(String username);

    Optional<Admin> findByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    @Query("SELECT a FROM Admin a WHERE LOWER(a.username) = LOWER(:identifier) OR LOWER(a.email) = LOWER(:identifier)")
    Optional<Admin> findByUsernameOrEmailIgnoreCase(@Param("identifier") String identifier);
}