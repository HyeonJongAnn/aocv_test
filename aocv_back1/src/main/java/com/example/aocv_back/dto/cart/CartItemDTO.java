package com.example.aocv_back.dto.cart;

import com.example.aocv_back.dto.item.OptionDTO;
import com.example.aocv_back.entity.cart.Cart;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.item.Option;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class CartItemDTO {
    private Integer id;
    private Integer cartId;
    private Integer itemId;
    private int quantity;
    private String itemName;
    private List<String> productImages;
    private double price;
    private Integer optionId;
    private String petName;

    public CartItem toEntity(Cart cart, Item item) {
        CartItem cartItem = CartItem.builder()
                .id(this.getId())
                .cart(cart)
                .item(item)
                .quantity(this.getQuantity())
                .price(this.getPrice())
                .petName(this.petName)
                .optionId(this.getOptionId())
                .build();

        return cartItem;
    }
}
