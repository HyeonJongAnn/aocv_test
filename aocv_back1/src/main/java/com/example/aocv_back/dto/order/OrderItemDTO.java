package com.example.aocv_back.dto.order;

import com.example.aocv_back.dto.item.OptionDTO;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.item.Option;
import com.example.aocv_back.entity.order.Order;
import com.example.aocv_back.entity.order.OrderItem;
import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Integer id;
    private Integer orderId;
    private Integer itemId;
    private Integer cartItemId;
    private int quantity;
    private double price;
    private Integer optionId;
    private String itemName;
    private List<String> productImages;
    private String petName;
    public OrderItem toEntity() {
        Order order = Order.builder().id(this.orderId).build();
        Item item = Item.builder().id(this.itemId).build();

        OrderItem orderItem = OrderItem.builder()
                .id(this.id)
                .order(order)
                .item(item)
                .quantity(this.quantity)
                .price(this.price)
                .petName(this.petName)
                .optionId(this.optionId)
                .build();

        return orderItem;
    }
}