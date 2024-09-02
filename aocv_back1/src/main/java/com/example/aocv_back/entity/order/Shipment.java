package com.example.aocv_back.entity.order;

import com.example.aocv_back.dto.order.ShipmentDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "T_SHIPMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "ShipmentSeqGenerator",
        sequenceName = "T_SHIPMENT_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ShipmentSeqGenerator")
    @Column(name = "shipment_seq")
    private Long id;

    private String trackingNumber;
    private String status;

    public ShipmentDTO toDTO() {
        return ShipmentDTO.builder()
                .trackingNumber(this.trackingNumber)
                .status(this.status)
                .build();
    }
}
