package com.iavtar.gfj_be.entity;

import com.iavtar.gfj_be.entity.enums.DashboardTabs;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DashboardTabTest {

    @Test
    void testSettersAndGetters() {
        DashboardTab tab = new DashboardTab();
        tab.setId(1);
        tab.setName(DashboardTabs.ADMINISTRATION);

        assertEquals(1, tab.getId());
        assertEquals(DashboardTabs.ADMINISTRATION, tab.getName());
    }

    @Test
    void testBuilderPattern() {
        DashboardTab tab = DashboardTab.builder()
                .id(2)
                .name(DashboardTabs.AGENT_ADMINISTRATION)
                .build();

        assertEquals(2, tab.getId());
        assertEquals(DashboardTabs.AGENT_ADMINISTRATION, tab.getName());
    }

    @Test
    void testEqualsAndHashCode() {
        DashboardTab tab1 = DashboardTab.builder().id(1).name(DashboardTabs.CALCULATOR).build();
        DashboardTab tab2 = DashboardTab.builder().id(2).name(DashboardTabs.CALCULATOR).build();
        DashboardTab tab3 = DashboardTab.builder().id(3).name(DashboardTabs.SHIPPING).build();

        // Equals based on enum name only
        assertEquals(tab1, tab2);
        assertNotEquals(tab1, tab3);

        // HashCode based on enum name
        assertEquals(tab1.hashCode(), tab2.hashCode());
        assertNotEquals(tab1.hashCode(), tab3.hashCode());
    }

    @Test
    void testEnumAssignment() {
        DashboardTab tab = new DashboardTab();
        tab.setName(DashboardTabs.ANALYTICS);
        assertEquals(DashboardTabs.ANALYTICS, tab.getName());
    }

}