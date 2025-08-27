package com.example.BlogAPI.Services.eventServices;

import java.util.List;

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
}