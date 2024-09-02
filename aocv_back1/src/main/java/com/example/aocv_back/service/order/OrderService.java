package com.example.aocv_back.service.order;

import com.example.aocv_back.dto.order.*;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.order.Order;

import java.util.List;

public interface OrderService {
    void confirmPayment(PaymentConfirmDTO paymentConfirmDTO);
    List<OrderDTO> getOrdersByUserId(Integer id);
    OrderDTO getOrderById(Integer orderId);

    AddressDTO getAddressById(Integer id);

    RefundRequestDTO createRefundRequest(RefundRequestDTO refundRequestDTO);

    List<RefundRequestDTO> getRefundRequestsByUserId(Integer id);

    int calculateShippingCost(String postalCode, int price);

    OrderDTO updateOrderStatus(Integer orderId, String status);
}
