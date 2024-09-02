package com.example.aocv_back.entity.order;

import com.example.aocv_back.dto.order.AddressDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "T_ADDRESS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "AddressSeqGenerator",
        sequenceName = "T_ADDRESS_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "AddressSeqGenerator")
    @Column(name = "address_seq")
    private Integer id;

    private String recipientName;
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String postalCode;
    private String requestNote;

    public AddressDTO toDTO() {
        return AddressDTO.builder()
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
