package com.example.aocv_back.service.cart;

import com.example.aocv_back.dto.cart.CartDTO;
import com.example.aocv_back.dto.cart.CartItemDTO;

import java.util.List;

public interface CartService {
    CartDTO addItemToCart(CartDTO cartDTO);

    CartDTO getAllItemsInCart(String userId);

    CartDTO deleteSelectedItems(String userId, List<Integer> cartItemIds);

    CartDTO updateCartItem(String userId, CartItemDTO cartItemDTO);
}
