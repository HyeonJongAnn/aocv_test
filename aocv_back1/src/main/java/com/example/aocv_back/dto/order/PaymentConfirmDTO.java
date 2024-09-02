package com.example.aocv_back.dto.order;

import lombok.Data;

    @Data
    public class PaymentConfirmDTO {
        private String paymentKey;
        private String orderId;
        private int amount;
        private OrderDTO orderInfo;
        private int usedPoints;

    }
