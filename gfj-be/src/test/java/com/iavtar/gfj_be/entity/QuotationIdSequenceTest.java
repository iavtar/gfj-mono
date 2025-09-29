package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QuotationIdSequenceTest {

    @Test
    void testSettersAndGetters() {
        QuotationIdSequence sequence = new QuotationIdSequence();
        sequence.setTimestampKey("20250929");
        sequence.setLastSequence(10);

        assertEquals("20250929", sequence.getTimestampKey());
        assertEquals(10, sequence.getLastSequence());
    }

    @Test
    void testAllArgsConstructor() {
        QuotationIdSequence sequence = new QuotationIdSequence("20250929", 15);

        assertEquals("20250929", sequence.getTimestampKey());
        assertEquals(15, sequence.getLastSequence());
    }

}