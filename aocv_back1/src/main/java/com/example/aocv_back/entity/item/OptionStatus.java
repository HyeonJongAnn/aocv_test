package com.example.aocv_back.entity.item;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OptionStatus {
    AVAILABLE("판매중"),  // 판매중
    SOLD_OUT("품절");     // 판매완료

    private final String value;

    OptionStatus(String value) {
        this.value = value;
    }

    @JsonCreator
    public static OptionStatus fromValue(String value) {
        for (OptionStatus status : OptionStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown enum type " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
