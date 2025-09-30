package com.iavtar.gfj_be.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iavtar.gfj_be.entity.Client;
import com.iavtar.gfj_be.entity.Quotation;
import com.iavtar.gfj_be.model.request.ClientRequest;
import com.iavtar.gfj_be.model.response.PagedUserResponse;
import com.iavtar.gfj_be.service.AgentService;
import com.iavtar.gfj_be.service.QuotationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AgentController.class)
@AutoConfigureMockMvc(addFilters = false)
class AgentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AgentService agentService;

    @MockitoBean
    private QuotationService quotationService;

    private ClientRequest buildRequest() {
        return ClientRequest.builder()
                .id(null)
                .clientName("John Corp")
                .email("john@example.com")
                .phoneNumber("1234567890")
                .build();
    }

    @Test
    void testCreateClient_NameAlreadyExists() throws Exception {
        ClientRequest request = buildRequest();
        when(agentService.existsByClientName("John Corp")).thenReturn(true);
        mockMvc.perform(post("/api/agent/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Client name already exists"));
    }

    @Test
    void testCreateClient_EmailAlreadyExists() throws Exception {
        ClientRequest request = buildRequest();
        when(agentService.existsByClientName("John Corp")).thenReturn(false);
        when(agentService.existsByEmail("john@example.com")).thenReturn(true);
        mockMvc.perform(post("/api/agent/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    void testCreateClient_PhoneAlreadyExists() throws Exception {
        ClientRequest request = buildRequest();
        when(agentService.existsByClientName("John Corp")).thenReturn(false);
        when(agentService.existsByEmail("john@example.com")).thenReturn(false);
        when(agentService.existsByPhoneNumber("1234567890")).thenReturn(true);
        mockMvc.perform(post("/api/agent/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Phone number already exists"));
    }

    @Test
    void testCreateClient_Success() throws Exception {
        ClientRequest request = buildRequest();
        Client createdClient = new Client();
        createdClient.setId(1L);
        when(agentService.existsByClientName("John Corp")).thenReturn(false);
        when(agentService.existsByEmail("john@example.com")).thenReturn(false);
        when(agentService.existsByPhoneNumber("1234567890")).thenReturn(false);
        when(agentService.createClient(any(ClientRequest.class))).thenReturn(createdClient);
        mockMvc.perform(post("/api/agent/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Client created successfully"));
    }

    @Test
    void testCreateClient_IllegalArgumentException() throws Exception {
        ClientRequest request = buildRequest();
        when(agentService.existsByClientName("John Corp")).thenReturn(false);
        when(agentService.existsByEmail("john@example.com")).thenReturn(false);
        when(agentService.existsByPhoneNumber("1234567890")).thenReturn(false);
        doThrow(new IllegalArgumentException("Invalid client data")).when(agentService).createClient(any());
        mockMvc.perform(post("/api/agent/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid client data"));
    }

    @Test
    void testCreateClient_GenericException() throws Exception {
        ClientRequest request = buildRequest();
        when(agentService.existsByClientName("John Corp")).thenReturn(false);
        when(agentService.existsByEmail("john@example.com")).thenReturn(false);
        when(agentService.existsByPhoneNumber("1234567890")).thenReturn(false);
        doThrow(new RuntimeException("DB error")).when(agentService).createClient(any());
        mockMvc.perform(post("/api/agent/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message", containsString("Error creating client")));
    }

    @Test
    void testGetClientByName_Success() throws Exception {
        Client mockClient = new Client();
        mockClient.setId(1L);
        mockClient.setClientName("John Corp");
        when(agentService.getClientByName("John Corp")).thenReturn(mockClient);
        mockMvc.perform(get("/api/agent/client")
                        .param("clientName", "John Corp")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientName").value("John Corp"));
    }

    @Test
    void testGetClientByName_NotFound() throws Exception {
        when(agentService.getClientByName("Unknown")).thenReturn(null);
        mockMvc.perform(get("/api/agent/client")
                        .param("clientName", "Unknown")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Client not found: Unknown"));
    }

    @Test
    void testGetClientByName_Exception() throws Exception {
        when(agentService.getClientByName(anyString())).thenThrow(new RuntimeException("DB error"));
        mockMvc.perform(get("/api/agent/client")
                        .param("clientName", "ErrorCase")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message", containsString("Error getting client: ErrorCase")));
    }

    @Test
    void testGetMyClients_Success() throws Exception {
        Client client1 = new Client();
        client1.setId(1L);
        client1.setClientName("John Corp");
        Client client2 = new Client();
        client2.setId(2L);
        client2.setClientName("Jane Corp");
        PagedUserResponse<Client> response = PagedUserResponse.<Client>builder()
                .data(Arrays.asList(client1, client2))
                .offset(0)
                .size(10)
                .totalRecords(2)
                .nextOffset(null)
                .hasMore(false)
                .build();
        when(agentService.getClientsByAgent(1L, 0, 10, "id")).thenReturn(response);
        mockMvc.perform(get("/api/agent/clients")
                        .param("agentId", "1")
                        .param("offset", "0")
                        .param("size", "10")
                        .param("sortBy", "id")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].clientName").value("John Corp"))
                .andExpect(jsonPath("$.data[1].clientName").value("Jane Corp"))
                .andExpect(jsonPath("$.totalRecords").value(2))
                .andExpect(jsonPath("$.offset").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.hasMore").value(false));
    }

    @Test
    void testGetMyClients_Exception() throws Exception {
        when(agentService.getClientsByAgent(anyLong(), anyInt(), anyInt(), anyString()))
                .thenThrow(new RuntimeException("DB error"));
        mockMvc.perform(get("/api/agent/clients")
                        .param("agentId", "99")
                        .param("offset", "0")
                        .param("size", "10")
                        .param("sortBy", "id")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Error getting clients for agent"));
    }

    @Test
    void testUpdateClient_IdMissing() throws Exception {
        String requestJson = """
            {
              "id": null,
              "clientName": "John Corp",
              "email": "john@example.com",
              "phoneNumber": "1234567890"
            }
            """;
        mockMvc.perform(post("/api/agent/updateClient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Client ID is required for update"));
    }

    @Test
    void testUpdateClient_ClientNotFound() throws Exception {
        String requestJson = """
            {
              "id": 1,
              "clientName": "John Corp",
              "email": "john@example.com",
              "phoneNumber": "1234567890"
            }
            """;
        when(agentService.getClientById(1L)).thenReturn(null);
        mockMvc.perform(post("/api/agent/updateClient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Client not found"));
    }

    @Test
    void testUpdateClient_Success() throws Exception {
        String requestJson = """
            {
              "id": 1,
              "clientName": "John Corp",
              "email": "john@example.com",
              "phoneNumber": "1234567890"
            }
            """;
        Client existingClient = new Client();
        existingClient.setId(1L);
        existingClient.setClientName("John Corp");
        Client updatedClient = new Client();
        updatedClient.setId(1L);
        updatedClient.setClientName("John Corp Updated");
        when(agentService.getClientById(1L)).thenReturn(existingClient);
        when(agentService.updateClient(any(ClientRequest.class))).thenReturn(updatedClient);
        mockMvc.perform(post("/api/agent/updateClient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Client updated successfully"));
    }

    @Test
    void testUpdateClient_Exception() throws Exception {
        String requestJson = """
            {
              "id": 1,
              "clientName": "John Corp",
              "email": "john@example.com",
              "phoneNumber": "1234567890"
            }
            """;
        when(agentService.getClientById(1L)).thenThrow(new RuntimeException("DB error"));
        mockMvc.perform(post("/api/agent/updateClient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Error updating client: DB error"));
    }

    @Test
    void testCreateQuotation_Success() throws Exception {
        Quotation requestQuotation = new Quotation();
        requestQuotation.setId(1L);
        requestQuotation.setQuotationId("Q123");
        Quotation createdQuotation = new Quotation();
        createdQuotation.setId(1L);
        createdQuotation.setQuotationId("Q123");
        when(quotationService.createQuotation(any(Quotation.class))).thenReturn(createdQuotation);
        String requestJson = """
            {
              "id": 1,
              "quotationId": "Q123"
            }
            """;
        mockMvc.perform(post("/api/agent/createQuotation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quotationId").value("Q123"));
    }

    @Test
    void testCreateQuotation_Exception() throws Exception {
        when(quotationService.createQuotation(any(Quotation.class)))
                .thenThrow(new RuntimeException("DB error"));
        String requestJson = """
            {
              "id": 1,
              "quotationId": "Q123"
            }
            """;
        mockMvc.perform(post("/api/agent/createQuotation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Error creating quotation"));
    }

    @Test
    void testUpdateQuotation_Success() throws Exception {
        Quotation requestQuotation = new Quotation();
        requestQuotation.setId(1L);
        requestQuotation.setQuotationId("Q123");

        Quotation updatedQuotation = new Quotation();
        updatedQuotation.setId(1L);
        updatedQuotation.setQuotationId("Q123");

        when(quotationService.updateQuotation(any(Quotation.class))).thenReturn(updatedQuotation);

        String requestJson = """
            {
              "id": 1,
              "quotationId": "Q123"
            }
            """;

        mockMvc.perform(post("/api/agent/updateQuotation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Quotation updated successfully"));
    }

    @Test
    void testUpdateQuotation_Exception() throws Exception {
        when(quotationService.updateQuotation(any(Quotation.class)))
                .thenThrow(new RuntimeException("DB error"));

        String requestJson = """
            {
              "id": 1,
              "quotationId": "Q123"
            }
            """;

        mockMvc.perform(post("/api/agent/updateQuotation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Error updating quotation"));
    }

}