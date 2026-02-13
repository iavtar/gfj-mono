package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ShippingIdSequenceTest {

    @Test
    void testSettersAndGetters() {
        ShippingIdSequence seq = new ShippingIdSequence();
        seq.setTimestampKey("20250929");
        seq.setLastSequence(5);

        assertEquals("20250929", seq.getTimestampKey());
        assertEquals(5, seq.getLastSequence());
    }

    @Test
    void testAllArgsConstructor() {
        ShippingIdSequence seq = new ShippingIdSequence("20250929", 10);

        assertEquals("20250929", seq.getTimestampKey());
        assertEquals(10, seq.getLastSequence());
    }

}