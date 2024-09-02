package com.example.aocv_back.repository.shipment;

import com.example.aocv_back.entity.order.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Shipment findByTrackingNumber(String trackingNumber);
}
