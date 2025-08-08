package com.example.BlogAPI.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Models.Member;

@RestController
@RequestMapping("/api/v1/members")
public class MemberController {

    @GetMapping("/active")
    public ResponseEntity<List<Member>> getActiveMembers() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/admin")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        return ResponseEntity.ok(member);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        return ResponseEntity.ok(member);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable Long id) {
        return ResponseEntity.ok("Member deleted successfully");
    }
}