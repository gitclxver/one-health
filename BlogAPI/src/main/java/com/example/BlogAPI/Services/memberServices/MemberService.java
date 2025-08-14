package com.example.BlogAPI.Services.memberServices;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Member;

public interface MemberService {

    List<Member> getAllMembers();

    List<Member> getActiveMembers();

    Member createMember(Member member);

    Member updateMember(Long id, Member updatedMember);

    void deleteMember(Long id);

    Member updateImageUrl(Long memberId, String imageUrl);

    String saveTempImage(MultipartFile file) throws IOException;

    String finalizeTempImage(String tempPath, Long memberId) throws IOException;

    void cleanupTempFiles();
    
}