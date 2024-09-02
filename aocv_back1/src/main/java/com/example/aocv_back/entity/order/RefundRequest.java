package com.example.aocv_back.entity.order;

import com.example.aocv_back.dto.order.RefundRequestDTO;
import com.example.aocv_back.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "T_REFUND_REQUEST")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "RefundRequestSeqGenerator",
        sequenceName = "T_REFUND_REQUEST_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class RefundRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "RefundRequestSeqGenerator")
    @Column(name = "refund_request_seq")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "order_seq")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_seq")
    private User user;

    @Column(name = "refund_reason", nullable = false)
    private String refundReason;

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @Column(name = "refund_amount", nullable = false)
    private int refundAmount;

    @Column(name = "status", nullable = false)
    private String status; // e.g., "PENDING", "APPROVED", "REJECTED"

    @Column(name = "admin_notes")
    private String adminNotes;

    @PrePersist
    protected void onCreate() {
        requestDate = LocalDateTime.now();
        status = "PENDING";
    }

    public RefundRequestDTO toDTO() {
        return RefundRequestDTO.builder()
                .id(this.id)
                .orderId(this.order.getId())
                .userId(this.user.getId())
                .refundReason(this.refundReason)
                .requestDate(this.requestDate)
                .refundAmount(this.refundAmount)
                .status(this.status)
                .adminNotes(this.adminNotes)
                .build();
    }
}