package com.iavtar.gfj_be.service;

import com.iavtar.gfj_be.entity.Quotation;
import com.iavtar.gfj_be.entity.ShippingTracker;
import com.iavtar.gfj_be.model.request.AddTrackingIdRequest;
import com.iavtar.gfj_be.model.request.ShippingSearchRequest;
import com.iavtar.gfj_be.model.request.UpdateShippingTrackingRequest;
import com.iavtar.gfj_be.model.response.PagedUserResponse;
import com.iavtar.gfj_be.model.response.ServiceResponse;
import com.iavtar.gfj_be.repository.ClientRepository;
import com.iavtar.gfj_be.repository.QuotationRepository;
import com.iavtar.gfj_be.repository.ShippingServiceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ShippingServiceImpl implements ShippingService {

    @Autowired
    private QuotationRepository quotationRepository;

    @Autowired
    private ShippingServiceRepository shippingRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ShippingIdGeneratorService shippingIdGeneratorService;

    @Override
    public ResponseEntity<?> markQuotationsForShipping(List<String> quotations) {
        String shippingId = shippingIdGeneratorService.generateId();
        try {
            quotations.forEach(quotation -> quotationRepository.findByQuotationId(quotation)
                    .ifPresent(qt -> {
                        qt.setShippingId(shippingId);
                        qt.getFinalQuotations().forEach(finalQuotation -> {
                            finalQuotation.setShippingId(shippingId);
                        });
                        quotationRepository.save(qt);
                    })
            );
            shippingRepository.save(ShippingTracker.builder().shippingId(shippingId).status("pending").build());
            return new ResponseEntity<>(ServiceResponse.builder().message("Marked For Shipping").build(), HttpStatus.OK);
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getAllShipping(int offset, int size) {
        try {
            List<Quotation> quotations = quotationRepository.findAll();
            List<Quotation> shippableQuotations = quotations.stream()
                    .filter(quotation -> Objects.nonNull(quotation.getShippingId()))
                    .toList();
            Map<String, List<Quotation>> grouped = shippableQuotations.stream()
                    .collect(Collectors.groupingBy(Quotation::getShippingId));
            List<ShippingTracker> shippingTrackers = shippingRepository.findAll();
            Map<String, String> shippingStatusById = shippingTrackers.stream()
                    .collect(Collectors.toMap(ShippingTracker::getShippingId, ShippingTracker::getStatus, (a, b) -> a));
            Map<String, String> shippingTrackingIdById = shippingTrackers.stream()
                    .collect(Collectors.toMap(
                            ShippingTracker::getShippingId,
                            st -> st.getTrackingId() != null ? st.getTrackingId() : "",
                            (a, b) -> a
                    ));
            Map<String, String> shippingInvoiceNumberById = shippingTrackers.stream()
                    .collect(Collectors.toMap(
                            ShippingTracker::getShippingId,
                            st -> st.getInvoiceNumber() != null ? st.getInvoiceNumber() : "",
                            (a, b) -> a
                    ));
            Map<String, String> shippingTrackingNoteById = shippingTrackers.stream()
                    .collect(Collectors.toMap(
                            ShippingTracker::getShippingId,
                            st -> st.getTrackingNote() != null ? st.getTrackingNote() : "",
                            (a, b) -> a
                    ));
            List<Map<String, Object>> shippingGroups = grouped.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("shippingId", entry.getKey());
                        item.put("quotations", entry.getValue());
                        item.put("count", entry.getValue().size());
                        item.put("status", shippingStatusById.get(entry.getKey()));
                        item.put("trackingId", shippingTrackingIdById.get(entry.getKey()));
                        item.put("invoiceNumber", shippingInvoiceNumberById.get(entry.getKey()));
                        item.put("trackingNote", shippingTrackingNoteById.get(entry.getKey()));
                        item.put("clientDetails", clientRepository.findById(entry.getValue().getFirst().getClientId()));
                        return item;
                    })
                    .collect(Collectors.toList());
            int total = shippingGroups.size();
            int start = Math.min(Math.max(offset, 0), total);
            int end = Math.min(start + Math.max(size, 1), total);
            List<Map<String, Object>> pageContent = shippingGroups.subList(start, end);
            int pageNumber = size > 0 ? start / size : 0;
            Pageable pageable = PageRequest.of(pageNumber, Math.max(size, 1));
            Page<Map<String, Object>> page = new PageImpl<>(pageContent, pageable, total);
            PagedUserResponse<Map<String, Object>> response = PagedUserResponse.from(page, offset, Math.max(size, 1));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> addTrackingId(AddTrackingIdRequest request) {
        try {
            log.info("Adding tracking ID {} to shipping ID: {}", request.getTrackingId(), request.getShippingId());
            if (request.getShippingId() == null || request.getShippingId().trim().isEmpty()) {
                log.error("Validation failed - shipping ID is required");
                ServiceResponse errorResponse = ServiceResponse.builder()
                        .message("Shipping ID is required")
                        .build();
                return ResponseEntity.badRequest().body(errorResponse);
            }
            if (request.getTrackingId() == null || request.getTrackingId().trim().isEmpty()) {
                log.error("Validation failed - tracking ID is required");
                ServiceResponse errorResponse = ServiceResponse.builder()
                        .message("Tracking ID is required")
                        .build();
                return ResponseEntity.badRequest().body(errorResponse);
            }
            Optional<ShippingTracker> shippingTrackerOptional = shippingRepository.findByShippingId(request.getShippingId());
            if (shippingTrackerOptional.isEmpty()) {
                log.error("Shipping tracker not found with shipping ID: {}", request.getShippingId());
                ServiceResponse errorResponse = ServiceResponse.builder()
                        .message("Shipping tracker not found with shipping ID: " + request.getShippingId())
                        .build();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            ShippingTracker shippingTracker = shippingTrackerOptional.get();
            shippingTracker.setTrackingId(request.getTrackingId());
            shippingTracker.setStatus("shipped");
            shippingTracker.setInvoiceNumber(request.getInvoiceNumber());
            shippingTracker.setTrackingNote(request.getTrackingNote());
            shippingRepository.save(shippingTracker);
            List<Quotation> quotations = quotationRepository.findAllByShippingId(request.getShippingId());
            quotations.forEach(quotation -> {
                quotation.setQuotationStatus("shipped");
                quotation.setTrackingId(request.getTrackingId());
                quotation.getFinalQuotations().forEach(finalQuotation -> {
                    finalQuotation.setTrackingId(request.getTrackingId());
                });
                quotationRepository.save(quotation);
            });
            log.info("Successfully set tracking ID {} on shipping tracker: {}", request.getTrackingId(), request.getShippingId());
            ServiceResponse response = ServiceResponse.builder()
                    .message("Tracking ID added successfully")
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception exception) {
            log.error("Error adding tracking ID: {}", exception.getMessage(), exception);
            ServiceResponse errorResponse = ServiceResponse.builder()
                    .message("Error adding tracking ID: " + exception.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @Override
    public ResponseEntity<?> updateTrackingStatus(UpdateShippingTrackingRequest request) {
        try {
            Optional<ShippingTracker> shippingTracker = shippingRepository.findByShippingId(request.getShippingId());
            if (shippingTracker.isPresent()) {
                ShippingTracker st = shippingTracker.get();
                st.setStatus(request.getStatus());
                shippingRepository.save(st);
                List<Quotation> quotations = quotationRepository.findAllByShippingId(request.getShippingId());
                quotations.forEach(quotation -> {
                    quotation.setQuotationStatus(request.getStatus());
                    quotationRepository.save(quotation);
                });
                return new ResponseEntity<>(ServiceResponse.builder().message("Shipping Status Updated!").build(), HttpStatus.OK);
            }
            return new ResponseEntity<>(ServiceResponse.builder().message("Shipping Status Not Updated!").build(), HttpStatus.BAD_REQUEST);
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Override
    public PagedUserResponse<Map<String, Object>> searchShippingTrackers(ShippingSearchRequest searchRequest) {
        log.info("Searching shipping trackers with criteria: {}", searchRequest);
        
        int page = searchRequest.getOffset() / searchRequest.getSize();
        Sort.Direction direction = "desc".equalsIgnoreCase(searchRequest.getSortDirection()) 
            ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, searchRequest.getSortBy());
        Pageable pageable = PageRequest.of(page, searchRequest.getSize(), sort);
        
        Page<ShippingTracker> shippingTrackerPage = shippingRepository.searchShippingTrackers(
            searchRequest.getShippingId(),
            searchRequest.getTrackingId(),
            searchRequest.getInvoiceNumber(),
            searchRequest.getStatus(),
            searchRequest.getCreatedAfter(),
            searchRequest.getCreatedBefore(),
            searchRequest.getUpdatedAfter(),
            searchRequest.getUpdatedBefore(),
            pageable
        );
        
        // Transform ShippingTracker entities to the same rich structure as getAllShipping
        List<Map<String, Object>> shippingGroups = shippingTrackerPage.getContent().stream()
                .map(shippingTracker -> {
                    String shippingId = shippingTracker.getShippingId();
                    List<Quotation> quotations = quotationRepository.findAllByShippingId(shippingId);
                    
                    Map<String, Object> item = new HashMap<>();
                    item.put("shippingId", shippingId);
                    item.put("quotations", quotations);
                    item.put("count", quotations.size());
                    item.put("status", shippingTracker.getStatus());
                    item.put("trackingId", shippingTracker.getTrackingId() != null ? shippingTracker.getTrackingId() : "");
                    if (!quotations.isEmpty()) {
                        item.put("clientDetails", clientRepository.findById(quotations.get(0).getClientId()));
                    }
                    return item;
                })
                .collect(Collectors.toList());
        
        // Create a new Page with the transformed content
        Page<Map<String, Object>> transformedPage = new PageImpl<>(
            shippingGroups, 
            pageable, 
            shippingTrackerPage.getTotalElements()
        );
        
        log.info("Found {} shipping trackers matching search criteria", shippingGroups.size());
        return PagedUserResponse.from(transformedPage, searchRequest.getOffset(), searchRequest.getSize());
    }

    @Override
    public PagedUserResponse<Map<String, Object>> searchShippingTrackersByText(ShippingSearchRequest searchRequest) {
        log.info("Searching shipping trackers by text: {}", searchRequest.getSearchText());
        
        int page = searchRequest.getOffset() / searchRequest.getSize();
        Sort.Direction direction = "desc".equalsIgnoreCase(searchRequest.getSortDirection()) 
            ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, searchRequest.getSortBy());
        Pageable pageable = PageRequest.of(page, searchRequest.getSize(), sort);
        
        Page<ShippingTracker> shippingTrackerPage = shippingRepository.searchShippingTrackersByText(
            searchRequest.getSearchText(),
            pageable
        );
        
        // Transform ShippingTracker entities to the same rich structure as getAllShipping
        List<Map<String, Object>> shippingGroups = shippingTrackerPage.getContent().stream()
                .map(shippingTracker -> {
                    String shippingId = shippingTracker.getShippingId();
                    List<Quotation> quotations = quotationRepository.findAllByShippingId(shippingId);
                    
                    Map<String, Object> item = new HashMap<>();
                    item.put("shippingId", shippingId);
                    item.put("quotations", quotations);
                    item.put("count", quotations.size());
                    item.put("status", shippingTracker.getStatus());
                    item.put("trackingId", shippingTracker.getTrackingId() != null ? shippingTracker.getTrackingId() : "");
                    if (!quotations.isEmpty()) {
                        item.put("clientDetails", clientRepository.findById(quotations.get(0).getClientId()));
                    }
                    return item;
                })
                .collect(Collectors.toList());
        
        // Create a new Page with the transformed content
        Page<Map<String, Object>> transformedPage = new PageImpl<>(
            shippingGroups, 
            pageable, 
            shippingTrackerPage.getTotalElements()
        );
        
        log.info("Found {} shipping trackers matching text search criteria", shippingGroups.size());
        return PagedUserResponse.from(transformedPage, searchRequest.getOffset(), searchRequest.getSize());
    }

}
