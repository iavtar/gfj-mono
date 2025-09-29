package com.iavtar.gfj_be.entity.enums;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

class DashboardTabsTest {

    @Test
    void getValue_shouldReturnCorrectValue() {
        assertEquals("administration", DashboardTabs.ADMINISTRATION.getValue());
        assertEquals("agent_administration", DashboardTabs.AGENT_ADMINISTRATION.getValue());
        assertEquals("calculator", DashboardTabs.CALCULATOR.getValue());
    }

    @Test
    void from_shouldReturnCorrectEnum_whenValidValue() {
        assertEquals(DashboardTabs.ADMINISTRATION, DashboardTabs.from("administration"));
        assertEquals(DashboardTabs.AGENT_ADMINISTRATION, DashboardTabs.from("agent_administration"));
        assertEquals(DashboardTabs.CLIENT_ADMINISTRATION, DashboardTabs.from("client_administration"));

        // Case-insensitive check
        assertEquals(DashboardTabs.CALCULATOR, DashboardTabs.from("CALCULATOR"));
    }

    @Test
    void from_shouldThrowException_whenInvalidValue() {
        assertThatThrownBy(() -> DashboardTabs.from("invalid_tab"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("invalid_tab Dashboard not present");
    }

}