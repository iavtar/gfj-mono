package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ClientTest {

    @Test
    void testAllFieldsWithSettersAndGetters() {
        Client client = new Client();
        LocalDateTime now = LocalDateTime.now();

        client.setId(1L);
        client.setClientName("Full Client");
        client.setBusinessLogoUrl("http://example.com/logo.png");
        client.setEmail("fullclient@example.com");
        client.setPhoneNumber("1234567890");
        client.setBusinessAddress("123 Business St");
        client.setShippingAddress("456 Shipping Ave");
        client.setCity("Metropolis");
        client.setState("StateName");
        client.setCountry("CountryName");
        client.setZipCode("123456");
        client.setEinNumber("EIN12345");
        client.setTaxId("TAX67890");
        client.setDiamondSettingPrice(new BigDecimal("150.50"));
        client.setGoldWastagePercentage(new BigDecimal("2.5"));
        client.setProfitAndLabourPercentage(new BigDecimal("10.0"));
        client.setCadCamWaxPrice(new BigDecimal("50.75"));
        client.setAgentId(101L);
        client.setCreatedAt(now);
        client.setUpdatedAt(now);

        assertEquals(1L, client.getId());
        assertEquals("Full Client", client.getClientName());
        assertEquals("http://example.com/logo.png", client.getBusinessLogoUrl());
        assertEquals("fullclient@example.com", client.getEmail());
        assertEquals("1234567890", client.getPhoneNumber());
        assertEquals("123 Business St", client.getBusinessAddress());
        assertEquals("456 Shipping Ave", client.getShippingAddress());
        assertEquals("Metropolis", client.getCity());
        assertEquals("StateName", client.getState());
        assertEquals("CountryName", client.getCountry());
        assertEquals("123456", client.getZipCode());
        assertEquals("EIN12345", client.getEinNumber());
        assertEquals("TAX67890", client.getTaxId());
        assertEquals(new BigDecimal("150.50"), client.getDiamondSettingPrice());
        assertEquals(new BigDecimal("2.5"), client.getGoldWastagePercentage());
        assertEquals(new BigDecimal("10.0"), client.getProfitAndLabourPercentage());
        assertEquals(new BigDecimal("50.75"), client.getCadCamWaxPrice());
        assertEquals(101L, client.getAgentId());
        assertEquals(now, client.getCreatedAt());
        assertEquals(now, client.getUpdatedAt());
    }

    @Test
    void testBuilderAllFields() {
        LocalDateTime now = LocalDateTime.now();
        Client client = Client.builder()
                .id(2L)
                .clientName("Builder Client")
                .businessLogoUrl("http://example.com/logo2.png")
                .email("builder@example.com")
                .phoneNumber("9876543210")
                .businessAddress("789 Business Rd")
                .shippingAddress("101 Shipping Blvd")
                .city("Gotham")
                .state("State2")
                .country("Country2")
                .zipCode("654321")
                .einNumber("EIN98765")
                .taxId("TAX54321")
                .diamondSettingPrice(new BigDecimal("200.00"))
                .goldWastagePercentage(new BigDecimal("3.0"))
                .profitAndLabourPercentage(new BigDecimal("12.0"))
                .cadCamWaxPrice(new BigDecimal("75.25"))
                .agentId(102L)
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertEquals(2L, client.getId());
        assertEquals("Builder Client", client.getClientName());
        assertEquals("http://example.com/logo2.png", client.getBusinessLogoUrl());
        assertEquals("builder@example.com", client.getEmail());
        assertEquals("9876543210", client.getPhoneNumber());
        assertEquals("789 Business Rd", client.getBusinessAddress());
        assertEquals("101 Shipping Blvd", client.getShippingAddress());
        assertEquals("Gotham", client.getCity());
        assertEquals("State2", client.getState());
        assertEquals("Country2", client.getCountry());
        assertEquals("654321", client.getZipCode());
        assertEquals("EIN98765", client.getEinNumber());
        assertEquals("TAX54321", client.getTaxId());
        assertEquals(new BigDecimal("200.00"), client.getDiamondSettingPrice());
        assertEquals(new BigDecimal("3.0"), client.getGoldWastagePercentage());
        assertEquals(new BigDecimal("12.0"), client.getProfitAndLabourPercentage());
        assertEquals(new BigDecimal("75.25"), client.getCadCamWaxPrice());
        assertEquals(102L, client.getAgentId());
        assertEquals(now, client.getCreatedAt());
        assertEquals(now, client.getUpdatedAt());
    }

}