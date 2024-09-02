package com.example.aocv_back.dto.order;

import com.example.aocv_back.entity.order.Address;
import com.example.aocv_back.entity.order.Order;
import com.example.aocv_back.entity.order.OrderItem;
import com.example.aocv_back.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Integer id;
    private Integer userId;
    private List<OrderItemDTO> orderItems;
    private Integer addressId;
    private LocalDateTime orderDate;
    private int totalAmount;
    private String status;
    private String orderNumber;
    private String orderName;
    private AddressDTO address;
    private int usedPoints;

    public Order toEntity() {
        return Order.builder()
                .id(this.id)
                .user(User.builder().id(this.userId).build())
                .orderItems(this.orderItems != null ? this.orderItems.stream().map(OrderItemDTO::toEntity).collect(Collectors.toList()) : null)
                .address(Address.builder().id(this.addressId).build())
                .orderDate(this.orderDate)
                .totalAmount(this.totalAmount)
                .status(this.status)
                .orderNumber(this.orderNumber)
                .orderName(this.orderName)
                .usedPoints(this.usedPoints)
                .build();
    }
}
