package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class ShippingTrackerTest {

    @Test
    void testSettersAndGetters() {
        ShippingTracker tracker = new ShippingTracker();
        tracker.setShippingId("SHIP123");
        tracker.setTrackingId("TRACK123");
        tracker.setInvoiceNumber("INV001");
        tracker.setTrackingNote("In transit");
        tracker.setStatus("Shipped");

        assertEquals("SHIP123", tracker.getShippingId());
        assertEquals("TRACK123", tracker.getTrackingId());
        assertEquals("INV001", tracker.getInvoiceNumber());
        assertEquals("In transit", tracker.getTrackingNote());
        assertEquals("Shipped", tracker.getStatus());
    }

    @Test
    void testAllArgsConstructor() {
        Date now = new Date();
        ShippingTracker tracker = new ShippingTracker(1L, "SHIP123", "TRACK123", "INV001", "Note", "Delivered", now, now);

        assertEquals(1L, tracker.getId());
        assertEquals("SHIP123", tracker.getShippingId());
        assertEquals("TRACK123", tracker.getTrackingId());
        assertEquals("INV001", tracker.getInvoiceNumber());
        assertEquals("Note", tracker.getTrackingNote());
        assertEquals("Delivered", tracker.getStatus());
        assertEquals(now, tracker.getCreatedAt());
        assertEquals(now, tracker.getUpdatedAt());
    }

    @Test
    void testPrePersistSetsCreatedAt() {
        ShippingTracker tracker = new ShippingTracker();
        assertNull(tracker.getCreatedAt());
        tracker.onCreate();
        assertNotNull(tracker.getCreatedAt());
    }

    @Test
    void testPreUpdateSetsUpdatedAt() {
        ShippingTracker tracker = new ShippingTracker();
        assertNull(tracker.getUpdatedAt());
        tracker.onUpdate();
        assertNotNull(tracker.getUpdatedAt());
    }

}