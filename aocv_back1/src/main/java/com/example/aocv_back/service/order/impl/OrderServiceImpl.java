package com.example.aocv_back.service.order.impl;

import com.example.aocv_back.dto.order.*;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.item.Option;
import com.example.aocv_back.entity.order.Address;
import com.example.aocv_back.entity.order.Order;
import com.example.aocv_back.entity.order.OrderItem;
import com.example.aocv_back.entity.order.RefundRequest;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.repository.cart.CartItemRepository;
import com.example.aocv_back.repository.item.OptionRepository;
import com.example.aocv_back.repository.order.AddressRepository;
import com.example.aocv_back.repository.order.OrderItemRepository;
import com.example.aocv_back.repository.order.OrderRepository;
import com.example.aocv_back.repository.order.RefundRequestRepository;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.order.OrderService;
import com.example.aocv_back.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final RefundRequestRepository refundRequestRepository;
    private final UserService userService;
    private final OptionRepository optionRepository;

    @Value("${toss.secret-key}")
    private String TOSS_SECRET_KEY;

    @Override
    public void confirmPayment(PaymentConfirmDTO paymentConfirmDTO) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.tosspayments.com/v1/payments/confirm";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(TOSS_SECRET_KEY, "");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("paymentKey", paymentConfirmDTO.getPaymentKey());
        requestBody.put("orderId", paymentConfirmDTO.getOrderId());
        requestBody.put("amount", paymentConfirmDTO.getAmount());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            OrderDTO orderDTO = paymentConfirmDTO.getOrderInfo();

            // Address 저장
            Address address = Address.builder()
                    .recipientName(orderDTO.getAddress().getRecipientName())
                    .phoneNumber(orderDTO.getAddress().getPhoneNumber())
                    .addressLine1(orderDTO.getAddress().getAddressLine1())
                    .addressLine2(orderDTO.getAddress().getAddressLine2())
                    .postalCode(orderDTO.getAddress().getPostalCode())
                    .requestNote(orderDTO.getAddress().getRequestNote())
                    .build();
            addressRepository.save(address);

            // Order 저장
            Order order = Order.builder()
                    .user(User.builder().id(orderDTO.getUserId()).build())
                    .address(address)
                    .orderDate(LocalDateTime.now())
                    .totalAmount(orderDTO.getTotalAmount())
                    .status(orderDTO.getStatus())
                    .orderNumber(orderDTO.getOrderNumber())
                    .orderName(orderDTO.getOrderName())
                    .usedPoints(orderDTO.getUsedPoints())
                    .build();
            Order savedOrder = orderRepository.save(order);

            // OrderItem 저장 및 CartItem 삭제
            for (OrderItemDTO orderItemDTO : orderDTO.getOrderItems()) {
                CartItem cartItem = cartItemRepository.findById(orderItemDTO.getCartItemId())
                        .orElseThrow(() -> new RuntimeException("CartItem not found"));

                OrderItem orderItem = OrderItem.builder()
                        .order(savedOrder)
                        .item(cartItem.getItem())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getPrice())
                        .petName(cartItem.getPetName())
                        .optionId(cartItem.getOptionId()) // 옵션 ID 설정
                        .build();

                // OrderItem 저장
                orderItemRepository.save(orderItem);

                // CartItem 삭제
                cartItemRepository.delete(cartItem);
            }

            userService.deductUserPoints(orderDTO.getUserId(), paymentConfirmDTO.getOrderInfo().getUsedPoints());

            double totalPrice = orderDTO.getOrderItems().stream()
                    .mapToDouble(OrderItemDTO::getPrice)
                    .sum();
            int rewardPoints = (int) (totalPrice * 0.015);
            userService.addUserPoints(orderDTO.getUserId(), rewardPoints);
        } else {
            log.error("Payment confirmation failed: {}", response.getBody());
            throw new RuntimeException("Payment confirmation failed: " + response.getBody());
        }
    }


    @Override
    public List<OrderDTO> getOrdersByUserId(Integer id) {
        List<Order> orders = orderRepository.findByUserId(id);
        return orders.stream()
                .map(Order::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return order.toDTO();
    }
    @Override
    public AddressDTO getAddressById(Integer id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        return address.toDTO();
    }

    @Override
    public RefundRequestDTO createRefundRequest(RefundRequestDTO refundRequestDTO) {
        Order order = orderRepository.findById(refundRequestDTO.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid order ID"));
        User user = userRepository.findById(refundRequestDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        RefundRequest refundRequest = RefundRequest.builder()
                .order(order)
                .user(user)
                .refundReason(refundRequestDTO.getRefundReason())
                .refundAmount(refundRequestDTO.getRefundAmount())
                .requestDate(LocalDateTime.now())
                .status("PENDING")
                .build();

        RefundRequest savedRefundRequest = refundRequestRepository.save(refundRequest);

        // 주문 상태를 "CANCELLED"로 업데이트
        order.setStatus("CANCELLED");
        orderRepository.save(order);

        return savedRefundRequest.toDTO();
    }

    @Override
    public List<RefundRequestDTO> getRefundRequestsByUserId(Integer id) {
        return refundRequestRepository.findByUserId(id).stream()
                .map(refundRequest -> refundRequest.toDTO())
                .collect(Collectors.toList());
    }

    @Override
    public int calculateShippingCost(String postalCode, int price) {
        int baseCost = 3000;
        int additionalCost = 0;
        int zip = Integer.parseInt(postalCode);

        if (price >= 100000) {
            return 0;
        }

        int[][] jejuMainland = {{63002, 63644}};
        int[][] jejuIslands = {{63000, 63001}};
        int[][] otherIslands = {
                {15654, 15654}, {23008, 23010}, {23100, 23116}, {23124, 23136},
                {32133, 32133}, {33411, 33411}, {40200, 40240}, {52570, 52571},
                {53031, 53033}, {53088, 53104}, {54000, 54000}, {56347, 56349},
                {57068, 57069}, {58760, 58761}, {58800, 58804}, {58809, 58810},
                {58816, 58818}, {58826, 58826}, {58832, 58832}, {58839, 58841},
                {58843, 58866}, {58953, 58958}, {59102, 59103}, {59127, 59127},
                {59137, 59145}, {59149, 59170}, {59421, 59421}, {59531, 59531},
                {59551, 59551}, {59563, 59563}, {59568, 59568}, {59650, 59650},
                {59766, 59766}, {59781, 59790}
        };

        for (int[] range : jejuMainland) {
            if (zip >= range[0] && zip <= range[1]) {
                additionalCost = 3500;
                return baseCost + additionalCost;
            }
        }
        for (int[] range : jejuIslands) {
            if (zip >= range[0] && zip <= range[1]) {
                additionalCost = 7000;
                return baseCost + additionalCost;
            }
        }
        for (int[] range : otherIslands) {
            if (zip >= range[0] && zip <= range[1]) {
                additionalCost = 7000;
                return baseCost + additionalCost;
            }
        }
        return baseCost;
    }
    @Override
    public OrderDTO updateOrderStatus(Integer orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return updatedOrder.toDTO();
    }
}
