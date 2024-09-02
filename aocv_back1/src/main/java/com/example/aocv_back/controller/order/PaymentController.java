package com.example.aocv_back.controller.order;

import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.order.PaymentConfirmDTO;
import com.example.aocv_back.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {
    private final OrderService orderService;

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmDTO paymentConfirmDTO) {
        ResponseDTO<PaymentConfirmDTO> responseDTO = new ResponseDTO<>();
        try {
            System.out.println(paymentConfirmDTO);
            orderService.confirmPayment(paymentConfirmDTO);
            responseDTO.setItem(paymentConfirmDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Payment confirmation failed: {}", e.getMessage());
            responseDTO.setErrorCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
}
