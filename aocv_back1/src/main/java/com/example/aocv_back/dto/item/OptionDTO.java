package com.example.aocv_back.dto.item;

import com.example.aocv_back.entity.item.Option;
import com.example.aocv_back.entity.item.OptionStatus;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDTO {
    private Integer id;
    private Map<String, String> optionAttributes;
    private int optionPrice;
    private int quantity;
    private OptionStatus status;
    private int orderIndex;

    public static Option toEntity(OptionDTO dto) {
        return Option.builder()
                .id(dto.getId())
                .optionAttributes(dto.getOptionAttributes())
                .optionPrice(dto.getOptionPrice())
                .quantity(dto.getQuantity())
                .status(dto.getStatus())
                .orderIndex(dto.getOrderIndex())
                .build();
    }
}

