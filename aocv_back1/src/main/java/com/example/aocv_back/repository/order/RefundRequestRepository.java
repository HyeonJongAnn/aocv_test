package com.example.aocv_back.repository.order;

import com.example.aocv_back.entity.order.RefundRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, Integer> {
    List<RefundRequest> findByUserId(Integer id);
}
