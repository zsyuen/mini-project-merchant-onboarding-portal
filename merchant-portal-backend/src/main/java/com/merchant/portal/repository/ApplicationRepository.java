package com.merchant.portal.repository;

import com.merchant.portal.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByReferenceId(String referenceId);

    // Find applications by status
    List<Application> findByStatusIgnoreCase(String status);
}
