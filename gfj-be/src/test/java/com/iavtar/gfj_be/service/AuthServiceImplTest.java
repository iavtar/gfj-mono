package com.iavtar.gfj_be.service;

import com.iavtar.gfj_be.entity.AppUser;
import com.iavtar.gfj_be.entity.DashboardTab;
import com.iavtar.gfj_be.entity.Role;
import com.iavtar.gfj_be.entity.enums.DashboardTabs;
import com.iavtar.gfj_be.entity.enums.RoleType;
import com.iavtar.gfj_be.model.request.SignInRequest;
import com.iavtar.gfj_be.model.response.ServiceResponse;
import com.iavtar.gfj_be.model.response.SignInResponse;
import com.iavtar.gfj_be.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignIn_Success() {
        // Prepare data
        SignInRequest request = new SignInRequest();
        request.setUsername("john");
        request.setPassword("password");

        AppUser user = new AppUser();
        user.setId(1L);
        user.setUsername("john");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@example.com");
        user.setPhoneNumber("1234567890");
        user.setIsActive(true);

        Set<Role> roles = new HashSet<>();
        Role role = new Role();
        role.setName(RoleType.SUPER_ADMIN);
        roles.add(role);
        user.setRoles(roles);

        Set<DashboardTab> dashboards = new HashSet<>();
        DashboardTab tab = new DashboardTab();
        tab.setName(DashboardTabs.ADMINISTRATION);
        dashboards.add(tab);
        user.setDashboardTabs(dashboards);

        // Mock behaviors
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(Optional.of(user))).thenReturn("dummy-token");

        // Call method
        ResponseEntity<?> response = authService.signIn(request);

        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof SignInResponse);
        SignInResponse body = (SignInResponse) response.getBody();
        assertEquals("john", body.getUsername());
        assertTrue(body.getRoles().contains("super_admin"));
        assertTrue(body.getDashboardTabs().contains("administration"));

        verify(authenticationManager, times(1)).authenticate(any());
        verify(userRepository, times(1)).findByUsername("john");
        verify(jwtService, times(1)).generateToken(Optional.of(user));
    }

    @Test
    void testSignIn_AccountLocked() {
        SignInRequest request = new SignInRequest();
        request.setUsername("john");
        request.setPassword("password");

        AppUser user = new AppUser();
        user.setUsername("john");
        user.setIsActive(false);

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = authService.signIn(request);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertTrue(response.getBody() instanceof ServiceResponse);
        assertEquals("Account Locked Please Contact Admin!", ((ServiceResponse) response.getBody()).getMessage());
    }

    @Test
    void testSignIn_InvalidCredentials() {
        SignInRequest request = new SignInRequest();
        request.setUsername("john");
        request.setPassword("wrong");

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> response = authService.signIn(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof ServiceResponse);
        assertEquals("Invalid Credentials!", ((ServiceResponse) response.getBody()).getMessage());
    }

}