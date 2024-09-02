package com.example.aocv_back.entity.cart;


import com.example.aocv_back.dto.cart.CartItemDTO;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.item.Option;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Entity
@Table(name = "T_CART_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "CartItemSeqGenerator",
        sequenceName = "T_CART_ITEM_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_seq")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cart_id", referencedColumnName = "cart_seq")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "item_seq")
    private Item item;


    @Column(name = "option_id")
    private Integer optionId; // 단일 옵션 ID


    private int quantity;
    private double price;
    private String petName;

    public CartItemDTO toDTO() {
        return CartItemDTO.builder()
                .id(this.id)
                .cartId(this.cart != null ? this.cart.getId() : null)
                .itemId(this.item != null ? this.item.getId() : null)
                .quantity(this.quantity)
                .itemName(this.item.getName())
                .petName(this.petName)
                .productImages(this.item.getProductImages())
                .price(this.price)
                .optionId(this.optionId)
                .build();
    }
}