package com.example.BlogAPI.Services.eventServices;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Event;
import com.example.BlogAPI.Repositories.EventRepository;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc();
    }

    @Override
public List<Event> getUpcomingEvents() {
    return eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDate.now());
}

@Override
public List<Event> getPastEvents() {
    return eventRepository.findByEventDateBeforeOrderByEventDateDesc(LocalDate.now());
}

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    @Override
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(existing -> {
            existing.setTitle(updatedEvent.getTitle());
            existing.setDescription(updatedEvent.getDescription());
            existing.setEventDate(updatedEvent.getEventDate());
            existing.setLocation(updatedEvent.getLocation());
            
            // Only update image URL if provided
            if (updatedEvent.getImageUrl() != null && !updatedEvent.getImageUrl().trim().isEmpty()) {
                existing.setImageUrl(updatedEvent.getImageUrl());
            }
            
            return eventRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    @Override
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    @Override
    public Event updateImageUrl(Long eventId, String imageUrl) {
        return eventRepository.findById(eventId).map(event -> {
            event.setImageUrl(imageUrl);
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
    }
}