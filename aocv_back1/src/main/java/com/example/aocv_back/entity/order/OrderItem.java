package com.example.aocv_back.entity.order;

import com.example.aocv_back.dto.item.OptionDTO;
import com.example.aocv_back.dto.order.OrderItemDTO;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.item.Option;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Entity
@Table(name = "T_ORDER_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "OrderItemSeqGenerator",
        sequenceName = "T_ORDER_ITEM_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "OrderItemSeqGenerator")
    @Column(name = "order_item_seq")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "order_seq")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "item_seq")
    private Item item;

    @Column(name = "option_id")
    private Integer optionId;

    private int quantity;
    private double price;
    private String petName;

    public OrderItemDTO toDTO() {
        return OrderItemDTO.builder()
                .id(this.id)
                .orderId(this.order != null ? this.order.getId() : null)
                .itemId(this.item != null ? this.item.getId() : null)
                .quantity(this.quantity)
                .price(this.price)
                .optionId(this.optionId)
                .itemName(this.item.getName())
                .petName(this.petName)
                .productImages(this.item.getProductImages())
                .build();
    }
}
