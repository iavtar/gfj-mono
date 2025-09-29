package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class QuotationTest {

    @Test
    void testSettersAndGetters() {
        Quotation quotation = new Quotation();
        quotation.setId(1L);
        quotation.setQuotationId("Q-001");
        quotation.setDescription("Test Quotation");
        quotation.setData("{\"items\":3}");
        quotation.setPrice(new BigDecimal("5000.00"));
        quotation.setAgentId(10L);
        quotation.setClientId(20L);
        quotation.setQuotationStatus("PENDING");
        quotation.setImageUrl("http://image.url");
        quotation.setCreatedAt(LocalDateTime.now());
        quotation.setUpdatedAt(LocalDateTime.now());
        quotation.setShippingId("S-001");
        quotation.setTrackingId("T-001");

        FinalQuotation finalQuotation = new FinalQuotation();
        finalQuotation.setFinalQuotationId("FQ-001");
        quotation.setFinalQuotations(List.of(finalQuotation));

        assertEquals(1L, quotation.getId());
        assertEquals("Q-001", quotation.getQuotationId());
        assertEquals("Test Quotation", quotation.getDescription());
        assertEquals("{\"items\":3}", quotation.getData());
        assertEquals(new BigDecimal("5000.00"), quotation.getPrice());
        assertEquals(10L, quotation.getAgentId());
        assertEquals(20L, quotation.getClientId());
        assertEquals("PENDING", quotation.getQuotationStatus());
        assertEquals("http://image.url", quotation.getImageUrl());
        assertNotNull(quotation.getCreatedAt());
        assertNotNull(quotation.getUpdatedAt());
        assertEquals("S-001", quotation.getShippingId());
        assertEquals("T-001", quotation.getTrackingId());
        assertEquals(1, quotation.getFinalQuotations().size());
        assertEquals("FQ-001", quotation.getFinalQuotations().get(0).getFinalQuotationId());
    }

    @Test
    void testAllArgsConstructorAndBuilder() {
        FinalQuotation finalQuotation = FinalQuotation.builder()
                .finalQuotationId("FQ-002")
                .build();

        Quotation quotation = Quotation.builder()
                .id(2L)
                .quotationId("Q-002")
                .description("Another Quotation")
                .data("{\"items\":5}")
                .price(new BigDecimal("7500.00"))
                .agentId(11L)
                .clientId(21L)
                .quotationStatus("APPROVED")
                .imageUrl("http://another.url")
                .shippingId("S-002")
                .trackingId("T-002")
                .finalQuotations(List.of(finalQuotation))
                .build();

        assertEquals(2L, quotation.getId());
        assertEquals("Q-002", quotation.getQuotationId());
        assertEquals("Another Quotation", quotation.getDescription());
        assertEquals("{\"items\":5}", quotation.getData());
        assertEquals(new BigDecimal("7500.00"), quotation.getPrice());
        assertEquals(11L, quotation.getAgentId());
        assertEquals(21L, quotation.getClientId());
        assertEquals("APPROVED", quotation.getQuotationStatus());
        assertEquals("http://another.url", quotation.getImageUrl());
        assertEquals("S-002", quotation.getShippingId());
        assertEquals("T-002", quotation.getTrackingId());
        assertEquals(1, quotation.getFinalQuotations().size());
        assertEquals("FQ-002", quotation.getFinalQuotations().get(0).getFinalQuotationId());
    }

}