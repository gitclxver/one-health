package com.example.BlogAPI.Services.memberServices;

import java.util.List;

import com.example.BlogAPI.Models.Member;

public interface MemberService {
    List<Member> getAllMembers();
    List<Member> getActiveMembers();
    Member getMemberById(Long id);
    Member createMember(Member member);
    Member updateMember(Long id, Member updatedMember);
    void deleteMember(Long id);
    Member updateImageUrl(Long memberId, String imageUrl);
}