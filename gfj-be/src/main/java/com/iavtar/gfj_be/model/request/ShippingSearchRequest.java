package com.iavtar.gfj_be.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingSearchRequest {
    private String shippingId;
    private String trackingId;
    private String invoiceNumber;
    private String trackingNote;
    private String status;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
    private LocalDateTime updatedAfter;
    private LocalDateTime updatedBefore;
    private String searchText; // For general text search across multiple fields
    private int offset = 0;
    private int size = 10;
    private String sortBy = "id";
    private String sortDirection = "asc";
}
