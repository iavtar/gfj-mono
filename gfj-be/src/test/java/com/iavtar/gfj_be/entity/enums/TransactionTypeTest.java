package com.iavtar.gfj_be.entity.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TransactionTypeTest {

    @Test
    void enumShouldContainCorrectValues() {
        TransactionType[] expected = {TransactionType.CREDIT, TransactionType.DEBIT};
        TransactionType[] actual = TransactionType.values();

        assertArrayEquals(expected, actual, "TransactionType enum should contain CREDIT and DEBIT");
    }

    @Test
    void valueOfShouldReturnCorrectEnum() {
        assertEquals(TransactionType.CREDIT, TransactionType.valueOf("CREDIT"));
        assertEquals(TransactionType.DEBIT, TransactionType.valueOf("DEBIT"));
    }

    @Test
    void valueOfShouldThrowExceptionForInvalidValue() {
        assertThrows(IllegalArgumentException.class, () -> TransactionType.valueOf("INVALID"));
    }

}