package com.example.aocv_back.entity.item;

import com.example.aocv_back.dto.item.OptionDTO;
import com.example.aocv_back.entity.cart.CartItem;
import com.example.aocv_back.entity.order.OrderItem;
import jakarta.persistence.*;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "T_OPTION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_seq")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "item_seq", referencedColumnName = "item_seq")
    private Item item;

    @ElementCollection
    @CollectionTable(name = "T_OPTION_ATTRIBUTES", joinColumns = @JoinColumn(name = "option_seq"))
    @MapKeyColumn(name = "attribute_name")
    @Column(name = "attribute_value")
    private Map<String, String> optionAttributes;

    private int optionPrice;

    private int quantity;

    @Enumerated(EnumType.STRING)
    private OptionStatus status;

    private int orderIndex;

    public OptionDTO toDTO() {
        return OptionDTO.builder()
                .id(this.id)
                .optionAttributes(this.optionAttributes)
                .optionPrice(this.optionPrice)
                .quantity(this.quantity)
                .status(this.status)
                .orderIndex(this.orderIndex)
                .build();
    }
}

