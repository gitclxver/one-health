package com.example.BlogAPI.Services.eventServices;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Event;
import com.example.BlogAPI.Repositories.EventRepository;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private static final String UPLOAD_DIR = "uploads/events/";

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc();
    }

    @Override
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDateTime.now());
    }

    @Override
    public List<Event> getPastEvents() {
        return eventRepository.findByEventDateBeforeOrderByEventDateDesc(LocalDateTime.now());
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
            if (updatedEvent.getImageUrl() != null && !updatedEvent.getImageUrl().trim().isEmpty()) {
                existing.setImageUrl(updatedEvent.getImageUrl());
            }
            return eventRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found");
        }
        
        eventRepository.findById(id).ifPresent(event -> {
            if (event.getImageUrl() != null && !event.getImageUrl().isEmpty()) {
                try {
                    String filename = Paths.get(event.getImageUrl()).getFileName().toString();
                    Path imagePath = Paths.get(UPLOAD_DIR + filename);
                    if (Files.exists(imagePath)) {
                        Files.delete(imagePath);
                    }
                } catch (IOException e) {
                    System.err.println("Failed to delete image file: " + e.getMessage());
                }
            }
        });
        
        eventRepository.deleteById(id);
    }

    @Override
    public Event updateImageUrl(Long eventId, String imageUrl) {
        return eventRepository.findById(eventId).map(event -> {
            event.setImageUrl(imageUrl);
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
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
    public String finalizeTempImage(String tempPath, Long eventId) throws IOException {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        String tempFilename = Paths.get(tempPath).getFileName().toString();
        Path tempFile = Paths.get(UPLOAD_DIR, tempFilename);

        if (!Files.exists(tempFile)) {
            throw new FileNotFoundException("Temp image not found: " + tempFilename);
        }

        String finalFilename = "event-" + eventId + "-" + UUID.randomUUID() + getFileExtension(tempFilename);
        Path finalFile = Paths.get(UPLOAD_DIR, finalFilename);

        Files.move(tempFile, finalFile, StandardCopyOption.REPLACE_EXISTING);

        String finalImageUrl = "/uploads/events/" + finalFilename;
        event.setImageUrl(finalImageUrl);
        eventRepository.save(event);

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
                            return fileAge > 3600000; // 1 hour
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