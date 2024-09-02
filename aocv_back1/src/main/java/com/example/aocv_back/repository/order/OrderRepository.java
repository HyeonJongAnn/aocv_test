package com.example.aocv_back.repository.order;

import com.example.aocv_back.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer > {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByUserId(Integer id);
}
