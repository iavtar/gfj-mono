package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ChatMessageTest {

    @Test
    void testNoArgsConstructorAndSetters() {
        ChatMessage message = new ChatMessage();
        message.setId(1L);
        message.setUsername("testUser");
        message.setMessage("Hello world!");
        LocalDateTime now = LocalDateTime.now();
        message.setSentAt(now);

        assertEquals(1L, message.getId());
        assertEquals("testUser", message.getUsername());
        assertEquals("Hello world!", message.getMessage());
        assertEquals(now, message.getSentAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime sentTime = LocalDateTime.of(2025, 9, 29, 12, 0);
        ChatMessage message = new ChatMessage(1L, "user1", "Hi there!", sentTime);

        assertEquals(1L, message.getId());
        assertEquals("user1", message.getUsername());
        assertEquals("Hi there!", message.getMessage());
        assertEquals(sentTime, message.getSentAt());
    }

    @Test
    void testConvenienceConstructorSetsSentAt() {
        ChatMessage message = new ChatMessage("user2", "Hello!");

        assertEquals("user2", message.getUsername());
        assertEquals("Hello!", message.getMessage());
        assertNotNull(message.getSentAt());

        // The timestamp should be very recent
        LocalDateTime now = LocalDateTime.now();
        assertTrue(message.getSentAt().isBefore(now.plusSeconds(1)));
        assertTrue(message.getSentAt().isAfter(now.minusSeconds(5)));
    }

}