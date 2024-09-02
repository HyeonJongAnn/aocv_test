package com.example.aocv_back.repository.cart;

import com.example.aocv_back.entity.cart.Cart;
import com.example.aocv_back.entity.cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByIdAndCartId(Integer id, Integer cartId);
}
