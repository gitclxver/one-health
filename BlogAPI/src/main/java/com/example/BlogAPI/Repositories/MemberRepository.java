package com.example.BlogAPI.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.BlogAPI.Models.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByIsActiveTrue();
    
}
