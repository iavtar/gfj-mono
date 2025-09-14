package com.iavtar.gfj_be.controller;

import com.iavtar.gfj_be.model.request.AddTrackingIdRequest;
import com.iavtar.gfj_be.model.request.ShippingSearchRequest;
import com.iavtar.gfj_be.model.request.UpdateShippingTrackingRequest;
import com.iavtar.gfj_be.model.response.PagedUserResponse;
import com.iavtar.gfj_be.model.response.ServiceResponse;
import com.iavtar.gfj_be.entity.ShippingTracker;
import com.iavtar.gfj_be.service.ShippingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    @PostMapping("/markForShipping")
    public ResponseEntity<?> markQuotationsForShipping(@RequestBody List<String> quotations) {
        return shippingService.markQuotationsForShipping(quotations);
    }

    @GetMapping("/allShipping")
    public ResponseEntity<?> getAllShipping(@RequestParam(defaultValue = "0") int offset,
                                            @RequestParam(defaultValue = "10") int size) {
        return shippingService.getAllShipping(offset, size);
    }

    @PostMapping("/addTrackingId")
    public ResponseEntity<?> addTrackingId(@RequestBody AddTrackingIdRequest request) {
        return shippingService.addTrackingId(request);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateTrackingStatus(@RequestBody UpdateShippingTrackingRequest request) {
        return shippingService.updateTrackingStatus(request);
    }

    @PostMapping("/search")
    public ResponseEntity<?> searchShippingTrackers(@RequestBody ShippingSearchRequest searchRequest) {
        try {
            log.info("Searching shipping trackers with criteria: {}", searchRequest);
            PagedUserResponse<Map<String, Object>> shippingTrackers = shippingService.searchShippingTrackers(searchRequest);
            return ResponseEntity.ok(shippingTrackers);
        } catch (Exception e) {
            log.error("Error searching shipping trackers: {}", e.getMessage(), e);
            ServiceResponse errorResponse = ServiceResponse.builder()
                    .message("Error searching shipping trackers: " + e.getMessage())
                    .build();
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/searchByText")
    public ResponseEntity<?> searchShippingTrackersByText(@RequestBody ShippingSearchRequest searchRequest) {
        try {
            log.info("Searching shipping trackers by text: {}", searchRequest.getSearchText());
            PagedUserResponse<Map<String, Object>> shippingTrackers = shippingService.searchShippingTrackersByText(searchRequest);
            return ResponseEntity.ok(shippingTrackers);
        } catch (Exception e) {
            log.error("Error searching shipping trackers by text: {}", e.getMessage(), e);
            ServiceResponse errorResponse = ServiceResponse.builder()
                    .message("Error searching shipping trackers by text: " + e.getMessage())
                    .build();
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchShippingTrackersWithParams(
            @RequestParam(required = false) String shippingId,
            @RequestParam(required = false) String trackingId,
            @RequestParam(required = false) String invoiceNumber,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDateTime createdAfter,
            @RequestParam(required = false) LocalDateTime createdBefore,
            @RequestParam(required = false) LocalDateTime updatedAfter,
            @RequestParam(required = false) LocalDateTime updatedBefore,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        try {
            log.info("Searching shipping trackers with query parameters");
            ShippingSearchRequest searchRequest = ShippingSearchRequest.builder()
                    .shippingId(shippingId)
                    .trackingId(trackingId)
                    .invoiceNumber(invoiceNumber)
                    .status(status)
                    .createdAfter(createdAfter)
                    .createdBefore(createdBefore)
                    .updatedAfter(updatedAfter)
                    .updatedBefore(updatedBefore)
                    .offset(offset)
                    .size(size)
                    .sortBy(sortBy)
                    .sortDirection(sortDirection)
                    .build();
            
            PagedUserResponse<Map<String, Object>> shippingTrackers = shippingService.searchShippingTrackers(searchRequest);
            return ResponseEntity.ok(shippingTrackers);
        } catch (Exception e) {
            log.error("Error searching shipping trackers with query parameters: {}", e.getMessage(), e);
            ServiceResponse errorResponse = ServiceResponse.builder()
                    .message("Error searching shipping trackers: " + e.getMessage())
                    .build();
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

}
