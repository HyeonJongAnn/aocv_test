package com.example.aocv_back.entity.order;


import com.example.aocv_back.dto.order.OrderDTO;
import com.example.aocv_back.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "T_ORDER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "OrderSeqGenerator",
        sequenceName = "T_ORDER_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "OrderSeqGenerator")
    @Column(name = "order_seq")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_seq")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @ManyToOne
    @JoinColumn(name = "address_id", referencedColumnName = "address_seq")
    private Address address;

    private LocalDateTime orderDate;
    private int totalAmount;
    private String status;
    private String orderNumber;
    private String orderName;
    private int usedPoints;



    private String generateOrderNumber() {
        return UUID.randomUUID().toString(); // UUID를 사용하여 고유한 주문 번호 생성
    }

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
    }

    public OrderDTO toDTO() {
        return OrderDTO.builder()
                .id(this.id)
                .userId(this.user.getId())
                .orderItems(this.orderItems != null ? this.orderItems.stream().map(OrderItem::toDTO).collect(Collectors.toList()) : null)
                .addressId(this.address != null ? this.address.getId() : null)
                .orderDate(this.orderDate)
                .totalAmount(this.totalAmount)
                .status(this.status)
                .orderNumber(this.orderNumber)
                .orderName(this.orderName)
                .usedPoints(this.usedPoints)
                .build();
    }

}