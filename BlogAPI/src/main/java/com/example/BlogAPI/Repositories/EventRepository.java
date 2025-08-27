package com.example.BlogAPI.Repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.BlogAPI.Models.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDate date);
    
    List<Event> findByEventDateBeforeOrderByEventDateDesc(LocalDate date);
    
    List<Event> findAllByOrderByEventDateAsc();
}