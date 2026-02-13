package com.iavtar.gfj_be.entity;

import com.iavtar.gfj_be.entity.enums.DashboardTabs;
import com.iavtar.gfj_be.entity.enums.RoleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

class AppUserTest {

    private AppUser user;
    private Role role;
    private DashboardTab tab;

    @BeforeEach
    void setUp() {
        user = AppUser.builder()
                .id(1L)
                .username("testUser")
                .firstName("Test")
                .lastName("User")
                .password("password")
                .email("test@example.com")
                .phoneNumber("1234567890")
                .isActive(true)
                .roles(new HashSet<>())
                .dashboardTabs(new HashSet<>())
                .build();

        role = Role.builder().id(1).name(RoleType.BUSINESS_ADMIN).build();
        tab = DashboardTab.builder().id(1).name(DashboardTabs.ANALYTICS).build();
    }

    @Test
    void testAddAndRemoveRole() {
        assertTrue(user.getRoles().isEmpty());
        user.addRole(role);
        assertTrue(user.getRoles().contains(role));
        user.removeRole(role);
        assertFalse(user.getRoles().contains(role));
    }

    @Test
    void testAddAndRemoveDashboardTab() {
        assertTrue(user.getDashboardTabs().isEmpty());
        user.addDashboardTab(tab);
        assertTrue(user.getDashboardTabs().contains(tab));
        user.removeDashboardTab(tab);
        assertFalse(user.getDashboardTabs().contains(tab));
    }

    @Test
    void testEqualsAndHashCode() {
        AppUser sameUser = AppUser.builder().id(1L).build();
        AppUser differentUser = AppUser.builder().id(2L).build();

        assertEquals(user, sameUser);
        assertNotEquals(user, differentUser);

        assertEquals(user.hashCode(), sameUser.hashCode());
        assertNotEquals(user.hashCode(), differentUser.hashCode());
    }

    @Test
    void testGettersAndSetters() {
        assertEquals("testUser", user.getUsername());
        assertEquals("Test", user.getFirstName());
        assertEquals("User", user.getLastName());
        assertEquals("password", user.getPassword());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("1234567890", user.getPhoneNumber());
        assertTrue(user.getIsActive());
    }

}