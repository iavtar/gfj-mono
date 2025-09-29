package com.iavtar.gfj_be.entity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class MaterialTest {

    @Test
    void testSettersAndGetters() {
        Material material = new Material();
        material.setId(1L);
        material.setTitle("Gold");
        material.setPrice(new BigDecimal("1200.50"));

        assertEquals(1L, material.getId());
        assertEquals("Gold", material.getTitle());
        assertEquals(new BigDecimal("1200.50"), material.getPrice());
    }

    @Test
    void testAllArgsConstructor() {
        Material material = new Material(2L, "Silver", new BigDecimal("800.75"));

        assertEquals(2L, material.getId());
        assertEquals("Silver", material.getTitle());
        assertEquals(new BigDecimal("800.75"), material.getPrice());
    }

    @Test
    void testBuilder() {
        Material material = Material.builder()
                .id(3L)
                .title("Platinum")
                .price(new BigDecimal("2500.00"))
                .build();

        assertEquals(3L, material.getId());
        assertEquals("Platinum", material.getTitle());
        assertEquals(new BigDecimal("2500.00"), material.getPrice());
    }

}