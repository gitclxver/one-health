package com.example.BlogAPI.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Member;
import com.example.BlogAPI.Services.memberServices.MemberService;

@RestController
@RequestMapping("/api/v1/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/active")
    public ResponseEntity<List<Member>> getActiveMembers() {
        return ResponseEntity.ok(memberService.getActiveMembers());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @PostMapping("/admin")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.createMember(member));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Member> updateMember(
            @PathVariable Long id,
            @RequestBody Member member) {
        return ResponseEntity.ok(memberService.updateMember(id, member));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok("Member deleted successfully");
    }

    @PostMapping("/admin/upload-temp")
    public ResponseEntity<String> uploadTempImage(@RequestParam("image") MultipartFile file) {
        try {
            String filename = memberService.saveTempImage(file);
            // Return the path that frontend expects
            return ResponseEntity.ok("/uploads/members/" + filename);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }

    @PostMapping("/admin/finalize-image/{memberId}")
    public ResponseEntity<String> finalizeTempImage(
            @PathVariable Long memberId,
            @RequestBody Map<String, String> request) {
        try {
            String tempPath = request.get("tempPath");
            if (tempPath == null || tempPath.isEmpty()) {
                return ResponseEntity.badRequest().body("tempPath is required");
            }

            String finalImageUrl = memberService.finalizeTempImage(tempPath, memberId);
            return ResponseEntity.ok(finalImageUrl);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to finalize image: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/upload-image/{memberId}")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long memberId,
            @RequestParam("image") MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String uploadDir = "uploads/members/";

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File destination = new File(uploadDir + filename);
            file.transferTo(destination);

            Member member = memberService.updateImageUrl(memberId, "/uploads/members/" + filename);
            return ResponseEntity.ok().body(Map.of("imageUrl", member.getImageUrl()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed");
        }
    }
}