package com.example.BlogAPI.Services.memberServices;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Member;
import com.example.BlogAPI.Repositories.MemberRepository;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private static final String UPLOAD_DIR = "uploads/members/";

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public List<Member> getActiveMembers() {
        return memberRepository.findByIsActiveTrue();
    }

    @Override
    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    @Override
    public Member updateMember(Long id, Member updatedMember) {
        return memberRepository.findById(id).map(existing -> {
            existing.setName(updatedMember.getName());
            existing.setPosition(updatedMember.getPosition());
            existing.setBio(updatedMember.getBio());
            if (updatedMember.getImageUrl() != null && !updatedMember.getImageUrl().trim().isEmpty()) {
                existing.setImageUrl(updatedMember.getImageUrl());
            }
            existing.setActive(updatedMember.isActive());
            return memberRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Member not found"));
    }

    @Override
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Member not found");
        }
        
        memberRepository.findById(id).ifPresent(member -> {
            if (member.getImageUrl() != null && !member.getImageUrl().isEmpty()) {
                try {
                    String filename = Paths.get(member.getImageUrl()).getFileName().toString();
                    Path imagePath = Paths.get(UPLOAD_DIR + filename);
                    if (Files.exists(imagePath)) {
                        Files.delete(imagePath);
                    }
                } catch (IOException e) {
                    System.err.println("Failed to delete image file: " + e.getMessage());
                }
            }
        });
        
        memberRepository.deleteById(id);
    }

    @Override
    public Member updateImageUrl(Long memberId, String imageUrl) {
        return memberRepository.findById(memberId).map(member -> {
            member.setImageUrl(imageUrl);
            return memberRepository.save(member);
        }).orElseThrow(() -> new RuntimeException("Member not found"));
    }

    @Override
    public String saveTempImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IOException("Original filename is null");
        }

        String extension = originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : ".jpg";
        
        String uniqueFilename = "temp-" + UUID.randomUUID() + extension;
        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return uniqueFilename;
    }

    @Override
    public String finalizeTempImage(String tempPath, Long memberId) throws IOException {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found with ID: " + memberId));

        String tempFilename = Paths.get(tempPath).getFileName().toString();
        Path tempFile = Paths.get("uploads/members", tempFilename);

        if (!Files.exists(tempFile)) {
            throw new FileNotFoundException("Temp image not found: " + tempFilename);
        }

        String finalFilename = "member-" + memberId + "-" + UUID.randomUUID() + getFileExtension(tempFilename);
        Path finalFile = Paths.get("uploads/members", finalFilename);

        Files.move(tempFile, finalFile, StandardCopyOption.REPLACE_EXISTING);

        String finalImageUrl = "/uploads/members/" + finalFilename;
        member.setImageUrl(finalImageUrl);
        memberRepository.save(member);

        return finalImageUrl;
    }

    private String getFileExtension(String filename) {
        int index = filename.lastIndexOf('.');
        return (index > 0) ? filename.substring(index) : "";
    }

    @Override
    public void cleanupTempFiles() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (Files.exists(uploadPath)) {
                Files.list(uploadPath)
                    .filter(path -> path.getFileName().toString().startsWith("temp-"))
                    .filter(path -> {
                        try {

                            long fileAge = System.currentTimeMillis() - Files.getLastModifiedTime(path).toMillis();
                            return fileAge > 3600000; 
                        } catch (IOException e) {
                            return false;
                        }
                    })
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                            System.out.println("Deleted old temp file: " + path.getFileName());
                        } catch (IOException e) {
                            System.err.println("Failed to delete temp file: " + path.getFileName());
                        }
                    });
            }
        } catch (IOException e) {
            System.err.println("Failed to cleanup temp files: " + e.getMessage());
        }
    }
}