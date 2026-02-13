package com.iavtar.gfj_be.entity;

import com.iavtar.gfj_be.entity.enums.TransactionType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ClientLedgerTest {

    @Test
    void testSettersAndGetters() {
        LocalDateTime now = LocalDateTime.now();
        ClientLedger ledger = new ClientLedger();

        ledger.setId(1L);
        ledger.setClientId(101L);
        ledger.setTransactionId("TXN12345");
        ledger.setAmount(new BigDecimal("5000.75"));
        ledger.setTransactionType(TransactionType.CREDIT);
        ledger.setDescription("Payment received");
        ledger.setNote("First installment");
        ledger.setCreatedAt(now);
        ledger.setUpdatedAt(now);

        assertEquals(1L, ledger.getId());
        assertEquals(101L, ledger.getClientId());
        assertEquals("TXN12345", ledger.getTransactionId());
        assertEquals(new BigDecimal("5000.75"), ledger.getAmount());
        assertEquals(TransactionType.CREDIT, ledger.getTransactionType());
        assertEquals("Payment received", ledger.getDescription());
        assertEquals("First installment", ledger.getNote());
        assertEquals(now, ledger.getCreatedAt());
        assertEquals(now, ledger.getUpdatedAt());
    }

    @Test
    void testBuilderPattern() {
        LocalDateTime now = LocalDateTime.now();
        ClientLedger ledger = ClientLedger.builder()
                .id(2L)
                .clientId(202L)
                .transactionId("TXN67890")
                .amount(new BigDecimal("2500.50"))
                .transactionType(TransactionType.DEBIT)
                .description("Payment made")
                .note("Second installment")
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertEquals(2L, ledger.getId());
        assertEquals(202L, ledger.getClientId());
        assertEquals("TXN67890", ledger.getTransactionId());
        assertEquals(new BigDecimal("2500.50"), ledger.getAmount());
        assertEquals(TransactionType.DEBIT, ledger.getTransactionType());
        assertEquals("Payment made", ledger.getDescription());
        assertEquals("Second installment", ledger.getNote());
        assertEquals(now, ledger.getCreatedAt());
        assertEquals(now, ledger.getUpdatedAt());
    }

    @Test
    void testEnumTransactionType() {
        ClientLedger creditLedger = new ClientLedger();
        creditLedger.setTransactionType(TransactionType.CREDIT);
        assertEquals(TransactionType.CREDIT, creditLedger.getTransactionType());

        ClientLedger debitLedger = new ClientLedger();
        debitLedger.setTransactionType(TransactionType.DEBIT);
        assertEquals(TransactionType.DEBIT, debitLedger.getTransactionType());
    }

    @Test
    void testBigDecimalEquality() {
        ClientLedger ledger1 = new ClientLedger();
        ledger1.setAmount(new BigDecimal("100.00"));

        ClientLedger ledger2 = new ClientLedger();
        ledger2.setAmount(new BigDecimal("100.000"));

        // BigDecimal equals is strict with scale
        assertNotEquals(ledger1.getAmount(), ledger2.getAmount());

        // Compare using compareTo for numeric equality ignoring scale
        assertEquals(0, ledger1.getAmount().compareTo(ledger2.getAmount()));
    }

}