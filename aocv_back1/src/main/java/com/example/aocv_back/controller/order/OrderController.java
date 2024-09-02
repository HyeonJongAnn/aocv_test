package com.example.aocv_back.controller.order;

import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.cart.CartItemDTO;
import com.example.aocv_back.dto.order.AddressDTO;
import com.example.aocv_back.dto.order.OrderDTO;
import com.example.aocv_back.dto.order.OrderItemDTO;
import com.example.aocv_back.dto.order.RefundRequestDTO;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.order.Order;
import com.example.aocv_back.repository.cart.CartItemRepository;
import com.example.aocv_back.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders(@RequestParam Integer id) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Integer orderId) {
        OrderDTO order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/address/{id}")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Integer id) {
        AddressDTO addressDTO = orderService.getAddressById(id);
        return ResponseEntity.ok(addressDTO);
    }

    @PostMapping("/refund")
    public ResponseEntity<RefundRequestDTO> createRefundRequest(@RequestBody RefundRequestDTO refundRequestDTO) {
        RefundRequestDTO createdRefundRequest = orderService.createRefundRequest(refundRequestDTO);
        return ResponseEntity.ok(createdRefundRequest);
    }

    @GetMapping("/refund-requests")
    public ResponseEntity<List<RefundRequestDTO>> getRefundRequests(@RequestParam Integer id) { // userId를 문자열로 받음
        List<RefundRequestDTO> refundRequests = orderService.getRefundRequestsByUserId(id);
        return ResponseEntity.ok(refundRequests);
    }


    @GetMapping("/shippingcost")
    public ResponseEntity<Integer> getShippingCost(@RequestParam String postalCode, @RequestParam int price) {
        int cost = orderService.calculateShippingCost(postalCode, price);
        return ResponseEntity.ok(cost);
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Integer orderId, @RequestBody OrderDTO orderDTO) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, orderDTO.getStatus());
        return ResponseEntity.ok(updatedOrder);
    }
}
