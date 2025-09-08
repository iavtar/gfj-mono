package com.iavtar.gfj_be.service;

import com.iavtar.gfj_be.model.request.ShippingSearchRequest;
import com.iavtar.gfj_be.model.request.UpdateShippingTrackingRequest;
import com.iavtar.gfj_be.model.response.PagedUserResponse;
import com.iavtar.gfj_be.entity.ShippingTracker;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public interface ShippingService {
    ResponseEntity<?> markQuotationsForShipping(List<String> quotations);

    ResponseEntity<?> getAllShipping(int offset, int size);

    ResponseEntity<?> addTrackingId(String shippingId, String trackingId);

    ResponseEntity<?> updateTrackingStatus(UpdateShippingTrackingRequest request);

    PagedUserResponse<Map<String, Object>> searchShippingTrackers(ShippingSearchRequest searchRequest);

    PagedUserResponse<Map<String, Object>> searchShippingTrackersByText(ShippingSearchRequest searchRequest);
}
