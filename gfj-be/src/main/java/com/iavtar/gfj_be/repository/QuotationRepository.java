package com.iavtar.gfj_be.repository;

import com.iavtar.gfj_be.entity.Quotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    Iterable<Long> id(Long id);

    Page<Quotation> findAllByClientId(Long clientId, Pageable pageable);

    Page<Quotation> findAllByAgentId(Long agentId, Pageable pageable);

    Page<Quotation> findAllByClientIdAndAgentId(Long clientId, Long agentId, Pageable pageable);

    Optional<Quotation> findByQuotationId(String quotationId);

    List<Quotation> findAllByShippingId(String shippingId);

    @Query("SELECT q FROM Quotation q WHERE " +
           "(:quotationId IS NULL OR q.quotationId LIKE %:quotationId%) AND " +
           "(:description IS NULL OR q.description LIKE %:description%) AND " +
           "(:minPrice IS NULL OR q.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR q.price <= :maxPrice) AND " +
           "(:agentId IS NULL OR q.agentId = :agentId) AND " +
           "(:clientId IS NULL OR q.clientId = :clientId) AND " +
           "(:quotationStatus IS NULL OR q.quotationStatus LIKE %:quotationStatus%) AND " +
           "(:shippingId IS NULL OR q.shippingId LIKE %:shippingId%) AND " +
           "(:trackingId IS NULL OR q.trackingId LIKE %:trackingId%) AND " +
           "(:createdAfter IS NULL OR q.createdAt >= :createdAfter) AND " +
           "(:createdBefore IS NULL OR q.createdAt <= :createdBefore) AND " +
           "(:updatedAfter IS NULL OR q.updatedAt >= :updatedAfter) AND " +
           "(:updatedBefore IS NULL OR q.updatedAt <= :updatedBefore)")
    Page<Quotation> searchQuotations(@Param("quotationId") String quotationId,
                                    @Param("description") String description,
                                    @Param("minPrice") BigDecimal minPrice,
                                    @Param("maxPrice") BigDecimal maxPrice,
                                    @Param("agentId") Long agentId,
                                    @Param("clientId") Long clientId,
                                    @Param("quotationStatus") String quotationStatus,
                                    @Param("shippingId") String shippingId,
                                    @Param("trackingId") String trackingId,
                                    @Param("createdAfter") LocalDateTime createdAfter,
                                    @Param("createdBefore") LocalDateTime createdBefore,
                                    @Param("updatedAfter") LocalDateTime updatedAfter,
                                    @Param("updatedBefore") LocalDateTime updatedBefore,
                                    Pageable pageable);

    @Query("SELECT q FROM Quotation q WHERE " +
           "(:searchText IS NULL OR " +
           "q.quotationId LIKE %:searchText% OR " +
           "q.description LIKE %:searchText% OR " +
           "q.quotationStatus LIKE %:searchText% OR " +
           "q.shippingId LIKE %:searchText% OR " +
           "q.trackingId LIKE %:searchText%) AND " +
           "(:agentId IS NULL OR q.agentId = :agentId) AND " +
           "(:clientId IS NULL OR q.clientId = :clientId)")
    Page<Quotation> searchQuotationsByText(@Param("searchText") String searchText,
                                          @Param("agentId") Long agentId,
                                          @Param("clientId") Long clientId,
                                          Pageable pageable);
}
