package com.iavtar.gfj_be.entity.enums;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

class RoleTypeTest {

    @Test
    void getValue_shouldReturnCorrectValue() {
        assertEquals("super_admin", RoleType.SUPER_ADMIN.getValue());
        assertEquals("business_admin", RoleType.BUSINESS_ADMIN.getValue());
        assertEquals("agent", RoleType.AGENT.getValue());
    }

    @Test
    void from_shouldReturnCorrectEnum_whenValidValue() {
        assertEquals(RoleType.SUPER_ADMIN, RoleType.from("super_admin"));
        assertEquals(RoleType.BUSINESS_ADMIN, RoleType.from("business_admin"));
        assertEquals(RoleType.AGENT, RoleType.from("agent"));

        // Case-insensitive check
        assertEquals(RoleType.SHIPPER, RoleType.from("SHIPPER"));
        assertEquals(RoleType.ACCOUNTANT, RoleType.from("Accountant"));
    }

    @Test
    void from_shouldThrowException_whenInvalidValue() {
        assertThatThrownBy(() -> RoleType.from("invalid_role"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("invalid_role Role not present");
    }

}