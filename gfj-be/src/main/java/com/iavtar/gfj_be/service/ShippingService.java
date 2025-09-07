package com.iavtar.gfj_be.service;

import com.iavtar.gfj_be.model.request.ShippingSearchRequest;
import com.iavtar.gfj_be.model.request.UpdateShippingTrackingRequest;
import com.iavtar.gfj_be.model.response.PagedUserResponse;
import com.iavtar.gfj_be.entity.ShippingTracker;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ShippingService {
    ResponseEntity<?> markQuotationsForShipping(List<String> quotations);

    ResponseEntity<?> getAllShipping(int offset, int size);

    ResponseEntity<?> addTrackingId(String shippingId, String trackingId);

    ResponseEntity<?> updateTrackingStatus(UpdateShippingTrackingRequest request);

    PagedUserResponse<ShippingTracker> searchShippingTrackers(ShippingSearchRequest searchRequest);

    PagedUserResponse<ShippingTracker> searchShippingTrackersByText(ShippingSearchRequest searchRequest);
}
