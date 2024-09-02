package com.example.aocv_back.controller.order;

import com.example.aocv_back.dto.order.ShipmentDTO;
import com.example.aocv_back.service.shipment.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shipments")
public class ShipmentController {
    @Autowired
    private ShipmentService shipmentService;

    @GetMapping("/{trackingNumber}")
    public ShipmentDTO trackShipment(@PathVariable String trackingNumber) {
        return shipmentService.trackShipment(trackingNumber);
    }
}
