package com.example.aocv_back.controller.cart;


import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.cart.CartDTO;
import com.example.aocv_back.dto.cart.CartItemDTO;
import com.example.aocv_back.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add-item")
    public ResponseEntity<?> addItemToCart(@RequestBody CartDTO cartDTO) {
        ResponseDTO<CartDTO> responseDTO = new ResponseDTO<>();
        try {
            CartDTO addedCartItemDTO = cartService.addItemToCart(cartDTO);
            responseDTO.setItem(addedCartItemDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/items")
    public ResponseEntity<?> getAllItemsInCart(@RequestParam String userId) {
        ResponseDTO<CartDTO> responseDTO = new ResponseDTO<>();
        try {
            CartDTO cartItemsDTO = cartService.getAllItemsInCart(userId);
            responseDTO.setItem(cartItemsDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            System.out.println(responseDTO.getItem());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }


    @PutMapping("/update-item")
    public ResponseEntity<?> updateCartItem(@RequestParam String userId, @RequestBody CartItemDTO cartItemDTO) {
        ResponseDTO<CartDTO> responseDTO = new ResponseDTO<>();
        try {
            CartDTO updatedCartDTO = cartService.updateCartItem(userId, cartItemDTO);
            responseDTO.setItem(updatedCartDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }


    @DeleteMapping("/delete-items")
    public ResponseEntity<?> deleteSelectedItems(@RequestParam String userId, @RequestBody List<Integer> cartItemIds) {
        ResponseDTO<CartDTO> responseDTO = new ResponseDTO<>();
        try {
            System.out.println("Received request to delete items: " + cartItemIds + " for userId: " + userId);
            CartDTO updatedCartDTO = cartService.deleteSelectedItems(userId, cartItemIds);
            responseDTO.setItem(updatedCartDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
}

