package com.iavtar.gfj_be.repository;

import com.iavtar.gfj_be.entity.ShippingTracker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ShippingServiceRepository extends JpaRepository<ShippingTracker, Long> {
    
    Optional<ShippingTracker> findByShippingId(String shippingId);
    
    @Query("SELECT st FROM ShippingTracker st WHERE " +
           "(:shippingId IS NULL OR st.shippingId LIKE %:shippingId%) AND " +
           "(:trackingId IS NULL OR st.trackingId LIKE %:trackingId%) AND " +
           "(:status IS NULL OR st.status LIKE %:status%) AND " +
           "(:createdAfter IS NULL OR st.createdAt >= :createdAfter) AND " +
           "(:createdBefore IS NULL OR st.createdAt <= :createdBefore) AND " +
           "(:updatedAfter IS NULL OR st.updatedAt >= :updatedAfter) AND " +
           "(:updatedBefore IS NULL OR st.updatedAt <= :updatedBefore)")
    Page<ShippingTracker> searchShippingTrackers(@Param("shippingId") String shippingId,
                                                @Param("trackingId") String trackingId,
                                                @Param("status") String status,
                                                @Param("createdAfter") LocalDateTime createdAfter,
                                                @Param("createdBefore") LocalDateTime createdBefore,
                                                @Param("updatedAfter") LocalDateTime updatedAfter,
                                                @Param("updatedBefore") LocalDateTime updatedBefore,
                                                Pageable pageable);

    @Query("SELECT st FROM ShippingTracker st WHERE " +
           "(:searchText IS NULL OR " +
           "st.shippingId LIKE %:searchText% OR " +
           "st.trackingId LIKE %:searchText% OR " +
           "st.status LIKE %:searchText%)")
    Page<ShippingTracker> searchShippingTrackersByText(@Param("searchText") String searchText,
                                                      Pageable pageable);
}
