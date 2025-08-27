package com.example.BlogAPI.Services.memberServices;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Member;
import com.example.BlogAPI.Repositories.MemberRepository;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

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
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
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
            
            // Only update image URL if provided
            if (updatedMember.getImageUrl() != null && !updatedMember.getImageUrl().trim().isEmpty()) {
                existing.setImageUrl(updatedMember.getImageUrl());
            }
            
            existing.setActive(updatedMember.isActive());
            return memberRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
    }

    @Override
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }

    @Override
    public Member updateImageUrl(Long memberId, String imageUrl) {
        return memberRepository.findById(memberId).map(member -> {
            member.setImageUrl(imageUrl);
            return memberRepository.save(member);
        }).orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));
    }
}