package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LedgerIdSequenceTest {

    @Test
    void testSettersAndGetters() {
        LedgerIdSequence ledger = new LedgerIdSequence();
        ledger.setTimestampKey("20250929");
        ledger.setLastSequence(100);

        assertEquals("20250929", ledger.getTimestampKey());
        assertEquals(100, ledger.getLastSequence());
    }

    @Test
    void testAllArgsConstructor() {
        LedgerIdSequence ledger = new LedgerIdSequence("20250930", 200);

        assertEquals("20250930", ledger.getTimestampKey());
        assertEquals(200, ledger.getLastSequence());
    }

}