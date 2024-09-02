package com.example.aocv_back.entity.cart;


import com.example.aocv_back.dto.cart.CartDTO;
import com.example.aocv_back.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "T_CART")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_seq")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_seq")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CartItem> cartItems;

    public CartDTO toDTO() {
        return CartDTO.builder()
                .id(this.id)
                .userId(this.user.getId().toString())
                .cartItems(this.cartItems != null ? this.cartItems.stream().map(CartItem::toDTO).collect(Collectors.toList()) : null)
                .build();
    }

}