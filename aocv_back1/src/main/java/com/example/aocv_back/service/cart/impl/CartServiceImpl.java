package com.example.aocv_back.service.cart.impl;

import com.example.aocv_back.dto.cart.CartDTO;
import com.example.aocv_back.dto.cart.CartItemDTO;
import com.example.aocv_back.dto.item.OptionDTO;
import com.example.aocv_back.entity.cart.Cart;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.item.Option;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.repository.cart.CartItemRepository;
import com.example.aocv_back.repository.cart.CartRepository;
import com.example.aocv_back.repository.item.ItemRepository;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartDTO addItemToCart(CartDTO cartDTO) {
        try {
            User user = userRepository.findByUserId(cartDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Cart cart = cartRepository.findByUserId(user.getId())
                    .orElseGet(() -> {
                        Cart newCart = new Cart();
                        newCart.setUser(user);
                        return newCart;
                    });

            if (cart.getCartItems() == null) {
                cart.setCartItems(new ArrayList<>());
            }

            for (CartItemDTO cartItemDTO : cartDTO.getCartItems()) {
                Item item = itemRepository.findById(cartItemDTO.getItemId())
                        .orElseThrow(() -> new RuntimeException("Item not found"));

                CartItem newCartItem = CartItem.builder()
                        .cart(cart)
                        .item(item)
                        .petName(cartItemDTO.getPetName())
                        .quantity(cartItemDTO.getQuantity())
                        .price(cartItemDTO.getPrice())
                        .optionId(cartItemDTO.getOptionId()) // 단일 옵션 ID 설정
                        .build();

                cart.getCartItems().add(newCartItem);
            }

            cartRepository.save(cart);

            CartDTO responseCartDTO = CartDTO.builder()
                    .id(cart.getId())
                    .userId(user.getUserId())
                    .cartItems(cart.getCartItems().stream()
                            .map(CartItem::toDTO)
                            .collect(Collectors.toList()))
                    .build();

            return responseCartDTO;
        } catch (Exception e) {
            throw new RuntimeException("Error adding item to cart", e);
        }
    }

    @Override
    public CartDTO getAllItemsInCart(String userId) {
        // 유저 ID로 유저 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 유저의 Integer ID를 통해 장바구니 조회
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    // Cart가 없으면 새로운 빈 Cart 생성
                    Cart newCart = new Cart();
                    newCart.setUser(user); // user 객체를 설정
                    newCart.setCartItems(Collections.emptyList());
                    return newCart;
                });

        CartDTO cartDTO = new CartDTO();
        cartDTO.setUserId(userId);
        cartDTO.setCartItems(cart.getCartItems().stream()
                .map(CartItem::toDTO)
                .collect(Collectors.toList()));

        return cartDTO;
    }

    @Transactional
    @Override
    public CartDTO deleteSelectedItems(String userId, List<Integer> cartItemIds) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        List<CartItem> itemsToRemove = cart.getCartItems().stream()
                .filter(cartItem -> cartItemIds.contains(cartItem.getId()))
                .collect(Collectors.toList());

        for (CartItem item : itemsToRemove) {
            cartItemRepository.delete(item);
        }

        cart.getCartItems().removeAll(itemsToRemove);

        cart = cartRepository.saveAndFlush(cart);

        return cart.toDTO();
    }

    @Override
    public CartDTO updateCartItem(String userId, CartItemDTO cartItemDTO) {
        try {
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            Cart cart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

            CartItem cartItem = cartItemRepository.findByIdAndCartId(cartItemDTO.getId(), cart.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

            Item item = itemRepository.findById(cartItem.getItem().getId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            cartItem.setQuantity(cartItemDTO.getQuantity());
            cartItem.setPrice(cartItemDTO.getPrice());
            cartItem.setOptionId(cartItemDTO.getOptionId()); // 단일 옵션 ID 업데이트

            cartItemRepository.save(cartItem);

            return cartItem.getCart().toDTO();
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}