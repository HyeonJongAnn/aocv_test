package com.example.aocv_back.repository.order;

import com.example.aocv_back.entity.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer > {
    Optional<OrderItem> findByOrderIdAndItemId(Integer orderId, Integer itemId);
}
