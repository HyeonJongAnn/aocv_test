package com.example.aocv_back.dto.item;

import com.example.aocv_back.entity.item.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemDTO {
    private Integer id;
    private String name;
    private String title;
    private String content;
    private List<String> contentImages;
    private List<String> productImages;
    private double price;
    private String status;
    private String type;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private double sale;
    private int quantity;
    private List<OptionDTO> options;

    private String searchCondition;
    private String searchKeyword;
    private String sort;

    public Item toEntity() {
        Item item = Item.builder()
                .id(this.id)
                .name(this.name)
                .title(this.title)
                .content(this.content)
                .contentImages(this.contentImages)
                .productImages(this.productImages)
                .price(this.price)
                .status(ItemStatus.valueOf(this.status))
                .type(ItemType.valueOf(this.type))
                .category(ItemCategory.valueOf(this.category))
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .sale(this.sale)
                .quantity(this.quantity)
                .options(new ArrayList<>())
                .build();

        if (this.options != null) {
            this.options.forEach(optionDTO -> {
                Option option = OptionDTO.toEntity(optionDTO);
                option.setItem(item);
                item.getOptions().add(option);
            });
        }

        return item;
    }
}
