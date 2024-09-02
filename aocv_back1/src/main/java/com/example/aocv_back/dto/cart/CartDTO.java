package com.example.aocv_back.dto.cart;


import com.example.aocv_back.entity.cart.Cart;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.repository.item.ItemRepository;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class CartDTO {
    private Integer id;
    private String userId;
    private List<CartItemDTO> cartItems;


    public Cart toEntity(User user, ItemRepository itemRepository) {
        Cart cart = Cart.builder()
                .id(this.getId())
                .user(user)
                .build();

        if (this.getCartItems() != null) {
            List<CartItem> cartItems = this.getCartItems().stream().map(cartItemDTO -> {
                Item item = itemRepository.findById(cartItemDTO.getItemId())
                        .orElseThrow(() -> new RuntimeException("Item not found"));
                return cartItemDTO.toEntity(cart, item);
            }).collect(Collectors.toList());
            cart.setCartItems(cartItems);
        }

        return cart;
    }
}
