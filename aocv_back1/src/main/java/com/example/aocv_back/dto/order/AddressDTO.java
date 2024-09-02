package com.example.aocv_back.dto.order;

import com.example.aocv_back.entity.order.Address;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private Integer id;
    private String recipientName;
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String postalCode;
    private String requestNote;

    public Address toEntity() {
        return Address.builder()
                .id(this.id)
                .recipientName(this.recipientName)
                .phoneNumber(this.phoneNumber)
                .addressLine1(this.addressLine1)
                .addressLine2(this.addressLine2)
                .postalCode(this.postalCode)
                .requestNote(this.requestNote)
                .build();
    }
}
