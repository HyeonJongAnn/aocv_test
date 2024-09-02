package com.example.aocv_back.service.shipment.impl;

import com.example.aocv_back.dto.order.ShipmentDTO;
import com.example.aocv_back.entity.order.Shipment;
import com.example.aocv_back.repository.shipment.ShipmentRepository;
import com.example.aocv_back.service.shipment.ShipmentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShipmentServiceImpl implements ShipmentService {
    @Autowired
    private ShipmentRepository shipmentRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String API_URL = "https://apis.tracker.delivery/graphql";

    @Value("${delivery.client-id}")
    private String CLIENT_ID;

    @Value("${delivery.client-secret}")
    private String CLIENT_SECRET;

    @Override
    public ShipmentDTO trackShipment(String trackingNumber) {
        String query = "query Track($carrierId: ID!, $trackingNumber: String!) { track(carrierId: $carrierId, trackingNumber: $trackingNumber) { lastEvent { time status { code name } description location { countryCode postalCode name } } events(last: 10) { edges { node { time status { code name } description location { countryCode postalCode name } } } } } }";
        String variables = "{\"carrierId\": \"kr.cjlogistics\", \"trackingNumber\": \"" + trackingNumber + "\"}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "TRACKQL-API-KEY " + CLIENT_ID + ":" + CLIENT_SECRET);

        String body = "{\"query\": \"" + query + "\", \"variables\": " + variables + "}";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(API_URL, entity, String.class);
            String responseBody = responseEntity.getBody();

            // JSON 응답을 파싱합니다.
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode trackNode = rootNode.path("data").path("track");
            JsonNode lastEventNode = trackNode.path("lastEvent");

            // 마지막 이벤트 파싱
            ShipmentDTO.LastEventDTO lastEvent = ShipmentDTO.LastEventDTO.builder()
                    .time(lastEventNode.path("time").asText())
                    .status(ShipmentDTO.StatusDTO.builder()
                            .code(lastEventNode.path("status").path("code").asText())
                            .name(lastEventNode.path("status").path("name").asText())
                            .build())
                    .description(lastEventNode.path("description").asText())
                    .location(ShipmentDTO.LocationDTO.builder()
                            .countryCode(lastEventNode.path("location").path("countryCode").asText())
                            .postalCode(lastEventNode.path("location").path("postalCode").asText())
                            .name(lastEventNode.path("location").path("name").asText())
                            .build())
                    .build();

            // 이벤트 목록 파싱
            List<ShipmentDTO.EventDTO> events = new ArrayList<>();
            JsonNode eventsNode = trackNode.path("events").path("edges");
            if (eventsNode.isArray()) {
                for (JsonNode eventNode : eventsNode) {
                    JsonNode node = eventNode.path("node");
                    ShipmentDTO.EventDTO event = ShipmentDTO.EventDTO.builder()
                            .time(node.path("time").asText())
                            .status(ShipmentDTO.StatusDTO.builder()
                                    .code(node.path("status").path("code").asText())
                                    .name(node.path("status").path("name").asText())
                                    .build())
                            .description(node.path("description").asText())
                            .location(ShipmentDTO.LocationDTO.builder()
                                    .countryCode(node.path("location").path("countryCode").asText())
                                    .postalCode(node.path("location").path("postalCode").asText())
                                    .name(node.path("location").path("name").asText())
                                    .build())
                            .build();
                    events.add(event);
                }
            }

            // DTO 객체를 생성합니다.
            ShipmentDTO shipmentDTO = ShipmentDTO.builder()
                    .trackingNumber(trackingNumber)
                    .status(lastEvent.getStatus().getCode())  // 상태 코드로 설정
                    .lastEvent(lastEvent)
                    .events(events)
                    .build();

            // 응답을 파싱하여 Shipment 객체에 저장 (예시)
            Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber);
            if (shipment == null) {
                shipment = Shipment.builder()
                        .trackingNumber(trackingNumber)
                        .status(shipmentDTO.getStatus())
                        .build();
            } else {
                shipment.setStatus(shipmentDTO.getStatus());
            }
            shipmentRepository.save(shipment);

            // 엔티티를 DTO로 변환하여 반환
            return shipmentDTO;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON response", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching shipment data", e);
        }
    }
}