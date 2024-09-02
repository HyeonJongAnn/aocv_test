package com.example.aocv_back.dto.order;

import com.example.aocv_back.entity.order.Shipment;
import lombok.*;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentDTO {
    private String trackingNumber;
    private String status;
    private LastEventDTO lastEvent;
    private List<EventDTO> events;

    public Shipment toEntity() {
        return Shipment.builder()
                .trackingNumber(this.trackingNumber)
                .status(this.status)
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LastEventDTO {
        private String time;
        private StatusDTO status;
        private String description;
        private LocationDTO location;  // 여기서 LocationDTO를 포함시키는지 확인

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EventDTO {
        private String time;
        private StatusDTO status;
        private String description;
        private LocationDTO location;  // 여기서 LocationDTO를 포함시키는지 확인

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatusDTO {
        private String code;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LocationDTO {
        private String countryCode;
        private String postalCode;
        private String name;
    }
}