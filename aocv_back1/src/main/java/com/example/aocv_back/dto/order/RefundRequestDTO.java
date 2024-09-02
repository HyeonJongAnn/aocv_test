package com.example.aocv_back.dto.order;

import com.example.aocv_back.entity.order.Order;
import com.example.aocv_back.entity.order.RefundRequest;
import com.example.aocv_back.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequestDTO {
    private Integer id;
    private Integer orderId;
    private Integer userId;
    private String refundReason;
    private LocalDateTime requestDate;
    private int refundAmount;
    private String status;
    private String adminNotes;

    public RefundRequest toEntity() {
        Order order = Order.builder().id(this.orderId).build();
        User user = User.builder().id(this.userId).build();

        return RefundRequest.builder()
                .id(this.id)
                .order(order)
                .user(user)
                .refundReason(this.refundReason)
                .requestDate(this.requestDate)
                .refundAmount(this.refundAmount)
                .status(this.status)
                .adminNotes(this.adminNotes)
                .build();
    }
}
