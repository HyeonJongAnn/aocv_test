package com.example.aocv_back.service.shipment;

import com.example.aocv_back.dto.order.ShipmentDTO;

public interface ShipmentService {
    ShipmentDTO trackShipment(String trackingNumber);
}
