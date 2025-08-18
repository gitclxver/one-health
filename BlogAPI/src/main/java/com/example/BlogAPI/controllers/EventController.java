package com.example.BlogAPI.controllers;

import com.example.BlogAPI.Models.Event;
import com.example.BlogAPI.Services.eventServices.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/past")
    public ResponseEntity<List<Event>> getPastEvents() {
        return ResponseEntity.ok(eventService.getPastEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping("/admin")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("Event deleted successfully");
    }

    @PostMapping("/admin/upload-temp")
    public ResponseEntity<String> uploadTempImage(@RequestParam("image") MultipartFile file) {
        try {
            String filename = eventService.saveTempImage(file);
            return ResponseEntity.ok("/uploads/events/" + filename);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }

    @PostMapping("/admin/finalize-image/{eventId}")
    public ResponseEntity<String> finalizeTempImage(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> request) {
        try {
            String tempPath = request.get("tempPath");
            if (tempPath == null || tempPath.isEmpty()) {
                return ResponseEntity.badRequest().body("tempPath is required");
            }

            String finalImageUrl = eventService.finalizeTempImage(tempPath, eventId);
            return ResponseEntity.ok(finalImageUrl);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to finalize image: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/admin/upload-image/{eventId}")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long eventId,
            @RequestParam("image") MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String uploadDir = "uploads/events/";

            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            java.io.File destination = new java.io.File(uploadDir + filename);
            file.transferTo(destination);

            Event event = eventService.updateImageUrl(eventId, "/uploads/events/" + filename);
            return ResponseEntity.ok().body(Map.of("imageUrl", event.getImageUrl()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed");
        }
    }
}