package com.iavtar.gfj_be.service;

import com.iavtar.gfj_be.entity.Client;
import com.iavtar.gfj_be.model.request.ClientRequest;
import com.iavtar.gfj_be.model.response.ClientResponse;
import com.iavtar.gfj_be.model.response.PagedUserResponse;
import com.iavtar.gfj_be.model.response.ServiceResponse;
import com.iavtar.gfj_be.repository.AppUserRepository;
import com.iavtar.gfj_be.repository.ClientRepository;
import com.iavtar.gfj_be.utility.CommonUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgentServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private CommonUtil commonUtil;

    @InjectMocks
    private AgentService agentService;

    @DisplayName("Test Create Client Success Scenario")
    @Test
    void testCreateClient_Success() {
        ClientRequest request = ClientRequest.builder()
                .clientName("Test Client")
                .email("test@example.com")
                .phoneNumber("1234567890")
                .businessAddress("123 Test St")
                .agentId(99L)
                .build();
        Client savedClient = Client.builder()
                .id(1L)
                .clientName(request.getClientName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .businessAddress(request.getBusinessAddress())
                .agentId(request.getAgentId())
                .build();
        when(clientRepository.save(any(Client.class))).thenReturn(savedClient);
        Client result = agentService.createClient(request);
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Client", result.getClientName());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("1234567890", result.getPhoneNumber());
        assertEquals("123 Test St", result.getBusinessAddress());
        assertEquals(99L, result.getAgentId());
    }

    @DisplayName("Test Get Client Object Via Client Name")
    @Test
    void testGetClientByName() {
        ClientRequest request = ClientRequest.builder()
                .clientName("Test Client")
                .email("test@example.com")
                .phoneNumber("1234567890")
                .businessAddress("123 Test St")
                .agentId(99L)
                .build();

        Client savedClient = Client.builder()
                .id(1L)
                .clientName(request.getClientName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .businessAddress(request.getBusinessAddress())
                .agentId(request.getAgentId())
                .build();
        when(commonUtil.findClientByName(any())).thenReturn(savedClient);
        Client result = agentService.getClientByName("test@example.com");
        assertEquals("Test Client", result.getClientName());
    }

    @DisplayName("Get All Clients")
    @Test
    void testGetAllClients_Success() {
        int offset = 0;
        int size = 2;
        String sortBy = "clientName";
        ClientResponse client1 = ClientResponse.builder().id(1L).clientName("Client A").build();
        ClientResponse client2 = ClientResponse.builder().id(2L).clientName("Client B").build();
        PagedUserResponse<ClientResponse> mockResponse = mock(PagedUserResponse.class);
        when(mockResponse.getData()).thenReturn(List.of(client1, client2));
        when(mockResponse.getTotalRecords()).thenReturn(2L);
        when(commonUtil.findAllClients(offset, size, sortBy)).thenReturn(mockResponse);
        PagedUserResponse<ClientResponse> result = agentService.getAllClients(offset, size, sortBy);
        assertNotNull(result);
        assertEquals(2, result.getData().size());
        assertEquals("Client A", result.getData().get(0).getClientName());
        assertEquals("Client B", result.getData().get(1).getClientName());
        assertEquals(2L, result.getTotalRecords());
        verify(commonUtil, times(1)).findAllClients(offset, size, sortBy);
    }

    @DisplayName("Test Exist By Client Name")
    @Test
    void existsByClientName() {
        when(clientRepository.existsByClientName("test")).thenReturn(true);
        assertEquals(true, agentService.existsByClientName("test"));
    }

    @DisplayName("Test Exist By Email")
    @Test
    void existsByEmail() {
        when(clientRepository.existsByEmail("test@test.com")).thenReturn(true);
        assertEquals(true, agentService.existsByEmail("test@test.com"));
    }

    @DisplayName("Test Exist By Phone Number")
    @Test
    void existsByPhoneNumber() {
        when(clientRepository.existsByPhoneNumber("1234567890")).thenReturn(true);
        assertEquals(true, agentService.existsByPhoneNumber("1234567890"));
    }

    @DisplayName("Test Get Clients By Agent")
    @Test
    void testGetClientsByAgent_Success() {
        Long agentId = 100L;
        int offset = 0;
        int size = 2;
        String sortBy = "clientName";

        // Create fake clients
        Client client1 = Client.builder().id(1L).clientName("Client A").build();
        Client client2 = Client.builder().id(2L).clientName("Client B").build();

        // Mock the paged response (using Mockito)
        PagedUserResponse<Client> mockResponse = mock(PagedUserResponse.class);
        when(mockResponse.getData()).thenReturn(List.of(client1, client2));
        when(mockResponse.getTotalRecords()).thenReturn(2L);

        // Stub commonUtil call
        when(commonUtil.findClientsByAgent(agentId, offset, size, sortBy))
                .thenReturn(mockResponse);

        // Call the service
        PagedUserResponse<Client> result =
                agentService.getClientsByAgent(agentId, offset, size, sortBy);

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.getData().size());
        assertEquals("Client A", result.getData().get(0).getClientName());
        assertEquals("Client B", result.getData().get(1).getClientName());
        assertEquals(2L, result.getTotalRecords());

        // Verify interaction
        verify(commonUtil, times(1)).findClientsByAgent(agentId, offset, size, sortBy);
    }

    @DisplayName("Test Get Client By Id")
    @Test
    void getClientById() {
        ClientRequest request = ClientRequest.builder()
                .clientName("Test Client")
                .email("test@example.com")
                .phoneNumber("1234567890")
                .businessAddress("123 Test St")
                .agentId(99L)
                .build();

        Client savedClient = Client.builder()
                .id(1L)
                .clientName(request.getClientName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .businessAddress(request.getBusinessAddress())
                .agentId(request.getAgentId())
                .build();
        when(commonUtil.findClientById(1L)).thenReturn(savedClient);
        assertEquals(savedClient, agentService.getClientById(1L));
    }

    @DisplayName("Should update client successfully when valid request is provided")
    @Test
    void updateClient_success() {
        // Arrange
        ClientRequest request = ClientRequest.builder()
                .id(1L)
                .clientName("Updated Client")
                .email("updated@example.com")
                .phoneNumber("9999999999")
                .build();

        Client existingClient = Client.builder()
                .id(1L)
                .clientName("Old Client")
                .email("old@example.com")
                .phoneNumber("1234567890")
                .build();

        Client savedClient = Client.builder()
                .id(1L)
                .clientName("Updated Client")
                .email("updated@example.com")
                .phoneNumber("9999999999")
                .build();

        when(commonUtil.findClientById(1L)).thenReturn(existingClient);
        when(clientRepository.save(any(Client.class))).thenReturn(savedClient);

        // Act
        Client result = agentService.updateClient(request);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Updated Client", result.getClientName());
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("9999999999", result.getPhoneNumber());

        verify(commonUtil, times(1)).findClientById(1L);
        verify(clientRepository, times(1)).save(existingClient);
    }

    @DisplayName("Should throw exception when client not found")
    @Test
    void updateClient_notFound() {
        // Arrange
        ClientRequest request = ClientRequest.builder()
                .id(99L)
                .clientName("NonExistent")
                .build();

        when(commonUtil.findClientById(99L)).thenReturn(null);

        // Act + Assert
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> agentService.updateClient(request)
        );

        assertEquals("Client not found with ID: 99", ex.getMessage());
        verify(clientRepository, never()).save(any());
    }

    @DisplayName("Should update only non-null fields (partial update)")
    @Test
    void updateClient_partialUpdate() {
        // Arrange
        ClientRequest request = ClientRequest.builder()
                .id(1L)
                .clientName(null) // won't overwrite
                .email("partial@example.com") // will overwrite
                .build();

        Client existingClient = Client.builder()
                .id(1L)
                .clientName("KeepThisName")
                .email("old@example.com")
                .build();

        Client savedClient = Client.builder()
                .id(1L)
                .clientName("KeepThisName")
                .email("partial@example.com")
                .build();

        when(commonUtil.findClientById(1L)).thenReturn(existingClient);
        when(clientRepository.save(any(Client.class))).thenReturn(savedClient);

        // Act
        Client result = agentService.updateClient(request);

        // Assert
        assertEquals("KeepThisName", result.getClientName()); // unchanged
        assertEquals("partial@example.com", result.getEmail()); // updated

        verify(clientRepository, times(1)).save(existingClient);
    }

    @DisplayName("Should update all fields when all request fields are non-null")
    @Test
    void updateClient_allFieldsUpdated() {
        // Arrange
        ClientRequest request = ClientRequest.builder()
                .id(1L)
                .clientName("New Name")
                .businessLogoUrl("logo.png")
                .email("new@example.com")
                .phoneNumber("9999999999")
                .businessAddress("123 New St")
                .shippingAddress("456 Ship St")
                .city("New City")
                .state("New State")
                .country("New Country")
                .zipCode("123456")
                .einNumber("EIN123")
                .taxId("TAX123")
                .diamondSettingPrice(new BigDecimal(100.00))
                .goldWastagePercentage(new BigDecimal(5.0))
                .profitAndLabourPercentage(new BigDecimal(10.0))
                .cadCamWaxPrice(new BigDecimal(200.0))
                .agentId(99L)
                .build();

        Client existingClient = Client.builder().id(1L).build();
        Client savedClient = Client.builder().id(1L).build();

        when(commonUtil.findClientById(1L)).thenReturn(existingClient);
        when(clientRepository.save(any(Client.class))).thenReturn(savedClient);

        // Act
        Client result = agentService.updateClient(request);

        // Assert all fields are set correctly
        assertEquals("New Name", existingClient.getClientName());
        assertEquals("logo.png", existingClient.getBusinessLogoUrl());
        assertEquals("new@example.com", existingClient.getEmail());
        assertEquals("9999999999", existingClient.getPhoneNumber());
        assertEquals("123 New St", existingClient.getBusinessAddress());
        assertEquals("456 Ship St", existingClient.getShippingAddress());
        assertEquals("New City", existingClient.getCity());
        assertEquals("New State", existingClient.getState());
        assertEquals("New Country", existingClient.getCountry());
        assertEquals("123456", existingClient.getZipCode());
        assertEquals("EIN123", existingClient.getEinNumber());
        assertEquals("TAX123", existingClient.getTaxId());
        assertEquals(new BigDecimal(100.00), existingClient.getDiamondSettingPrice());
        assertEquals(new BigDecimal(5.0), existingClient.getGoldWastagePercentage());
        assertEquals(new BigDecimal(10.0), existingClient.getProfitAndLabourPercentage());
        assertEquals(new BigDecimal(200.0), existingClient.getCadCamWaxPrice());
        assertEquals(99L, existingClient.getAgentId());

        verify(clientRepository, times(1)).save(existingClient);
    }

    @Test
    void deleteAgent_shouldReturnSuccessMessage_whenAgentDeleted() {
        Long agentId = 1L;

        // Do nothing when deleteById is called (void method)
        doNothing().when(userRepository).deleteById(agentId);

        // Call the method
        ResponseEntity<?> response = agentService.deleteAgent(agentId);

        // Verify repository interaction
        verify(userRepository, times(1)).deleteById(agentId);

        // Assert response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof ServiceResponse);
        ServiceResponse body = (ServiceResponse) response.getBody();
        assertEquals("Agent Deleted Successfully!", body.getMessage());
    }

    @Test
    void deleteAgent_shouldThrowRuntimeException_whenRepositoryThrows() {
        Long agentId = 1L;

        doThrow(new RuntimeException("DB Error")).when(userRepository).deleteById(agentId);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            agentService.deleteAgent(agentId);
        });

        assertEquals("DB Error", exception.getMessage());
        verify(userRepository, times(1)).deleteById(agentId);
    }

}