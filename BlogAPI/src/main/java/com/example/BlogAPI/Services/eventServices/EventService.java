package com.example.BlogAPI.Services.eventServices;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Event;

public interface EventService {
    List<Event> getAllEvents();
    List<Event> getUpcomingEvents();
    List<Event> getPastEvents();
    Event getEventById(Long id);
    Event createEvent(Event event);
    Event updateEvent(Long id, Event updatedEvent);
    void deleteEvent(Long id);
    Event updateImageUrl(Long eventId, String imageUrl);
    String saveTempImage(MultipartFile file) throws IOException;
    String finalizeTempImage(String tempPath, Long eventId) throws IOException;
    void cleanupTempFiles();
}