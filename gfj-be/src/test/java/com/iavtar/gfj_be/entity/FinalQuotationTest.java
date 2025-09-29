package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class FinalQuotationTest {

    @Test
    void testSettersAndGetters() {
        FinalQuotation quotation = new FinalQuotation();
        quotation.setId(1L);
        quotation.setMappedQuotationId("MQ-001");
        quotation.setFinalQuotationId("FQ-001");
        quotation.setDescription("Test quotation description");
        quotation.setData("Sample data");
        quotation.setPrice(new BigDecimal("1234.56"));
        quotation.setAgentId(101L);
        quotation.setClientId(202L);
        quotation.setQuotationStatus("PENDING");
        quotation.setImageUrl("http://example.com/image.png");
        quotation.setShippingId("SHIP123");
        quotation.setTrackingId("TRACK123");

        LocalDateTime now = LocalDateTime.now();
        quotation.setCreatedAt(now);
        quotation.setUpdatedAt(now);

        assertEquals(1L, quotation.getId());
        assertEquals("MQ-001", quotation.getMappedQuotationId());
        assertEquals("FQ-001", quotation.getFinalQuotationId());
        assertEquals("Test quotation description", quotation.getDescription());
        assertEquals("Sample data", quotation.getData());
        assertEquals(new BigDecimal("1234.56"), quotation.getPrice());
        assertEquals(101L, quotation.getAgentId());
        assertEquals(202L, quotation.getClientId());
        assertEquals("PENDING", quotation.getQuotationStatus());
        assertEquals("http://example.com/image.png", quotation.getImageUrl());
        assertEquals("SHIP123", quotation.getShippingId());
        assertEquals("TRACK123", quotation.getTrackingId());
        assertEquals(now, quotation.getCreatedAt());
        assertEquals(now, quotation.getUpdatedAt());
    }

    @Test
    void testBuilderPattern() {
        LocalDateTime now = LocalDateTime.now();

        FinalQuotation quotation = FinalQuotation.builder()
                .id(2L)
                .mappedQuotationId("MQ-002")
                .finalQuotationId("FQ-002")
                .description("Builder test description")
                .data("Builder data")
                .price(new BigDecimal("789.00"))
                .agentId(111L)
                .clientId(222L)
                .quotationStatus("APPROVED")
                .imageUrl("http://example.com/image2.png")
                .shippingId("SHIP456")
                .trackingId("TRACK456")
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertEquals(2L, quotation.getId());
        assertEquals("MQ-002", quotation.getMappedQuotationId());
        assertEquals("FQ-002", quotation.getFinalQuotationId());
        assertEquals("Builder test description", quotation.getDescription());
        assertEquals("Builder data", quotation.getData());
        assertEquals(new BigDecimal("789.00"), quotation.getPrice());
        assertEquals(111L, quotation.getAgentId());
        assertEquals(222L, quotation.getClientId());
        assertEquals("APPROVED", quotation.getQuotationStatus());
        assertEquals("http://example.com/image2.png", quotation.getImageUrl());
        assertEquals("SHIP456", quotation.getShippingId());
        assertEquals("TRACK456", quotation.getTrackingId());
        assertEquals(now, quotation.getCreatedAt());
        assertEquals(now, quotation.getUpdatedAt());
    }

}