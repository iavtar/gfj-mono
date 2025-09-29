package com.iavtar.gfj_be.entity;

import com.iavtar.gfj_be.entity.enums.RoleType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RoleTest {

    @Test
    void testSettersAndGetters() {
        Role role = new Role();
        role.setId(1);
        role.setName(RoleType.SUPER_ADMIN);

        assertEquals(1, role.getId());
        assertEquals(RoleType.SUPER_ADMIN, role.getName());
    }

    @Test
    void testAllArgsConstructor() {
        Role role = new Role(2, RoleType.AGENT);

        assertEquals(2, role.getId());
        assertEquals(RoleType.AGENT, role.getName());
    }

    @Test
    void testEqualsAndHashCode() {
        Role role1 = new Role(1, RoleType.BUSINESS_ADMIN);
        Role role2 = new Role(1, RoleType.SUPER_ADMIN);
        Role role3 = new Role(2, RoleType.BUSINESS_ADMIN);

        // Same ID should be equal
        assertEquals(role1, role2);
        assertEquals(role1.hashCode(), role2.hashCode());

        // Different ID should not be equal
        assertNotEquals(role1, role3);
        assertNotEquals(role1.hashCode(), role3.hashCode());
    }

}