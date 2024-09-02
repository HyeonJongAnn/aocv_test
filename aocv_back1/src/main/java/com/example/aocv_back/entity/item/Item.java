package com.example.aocv_back.entity.item;

import com.example.aocv_back.dto.item.ItemDTO;
import com.example.aocv_back.dto.item.OptionDTO;
import com.example.aocv_back.entity.review.Review;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "T_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_seq")
    private Integer id;

    private String name;
    private String title;
    private String content;

    @ElementCollection
    @CollectionTable(name = "T_ITEM_CONTENT_IMAGE", joinColumns = @JoinColumn(name = "item_seq"))
    @Column(name = "contentImages")
    private List<String> contentImages;

    @ElementCollection
    @CollectionTable(name = "T_ITEM_IMAGE", joinColumns = @JoinColumn(name = "item_seq"))
    @Column(name = "productImages")
    private List<String> productImages;

    private double price;

    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    @Enumerated(EnumType.STRING)
    private ItemType type;

    @Enumerated(EnumType.STRING)
    private ItemCategory category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private double sale;
    private int quantity;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options = new ArrayList<>(); // Initialize options here

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Transient
    public int getTotalQuantity() {
        return options.stream()
                .filter(option -> option.getStatus() == OptionStatus.AVAILABLE)
                .mapToInt(Option::getQuantity).sum();
    }

    public ItemDTO toDTO() {
        return ItemDTO.builder()
                .id(this.id)
                .name(this.name)
                .title(this.title)
                .content(this.content)
                .contentImages(this.contentImages)
                .productImages(this.productImages)
                .price(this.price)
                .status(this.status.name())
                .type(this.type.name())
                .category(this.category.name())
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .sale(this.sale)
                .quantity(this.getTotalQuantity())
                .options(this.options != null ? this.options.stream().map(Option::toDTO).collect(Collectors.toList()) : null)
                .build();
    }

    public void updateFromDTO(ItemDTO itemDTO) {
        this.name = itemDTO.getName();
        this.title = itemDTO.getTitle();
        this.content = itemDTO.getContent();
        this.contentImages = itemDTO.getContentImages();
        this.productImages = itemDTO.getProductImages();
        this.price = itemDTO.getPrice();
        this.status = ItemStatus.valueOf(itemDTO.getStatus());
        this.type = ItemType.valueOf(itemDTO.getType());
        this.sale = itemDTO.getSale();
        this.category = ItemCategory.valueOf(itemDTO.getCategory());
        this.updatedAt = itemDTO.getUpdatedAt();

        // 옵션 업데이트 처리
        if (this.options == null) {
            this.options = new ArrayList<>();
        } else {
            this.options.clear();
        }

        if (itemDTO.getOptions() != null) {
            for (OptionDTO optionDTO : itemDTO.getOptions()) {
                Option option = OptionDTO.toEntity(optionDTO);
                option.setItem(this);
                this.options.add(option);
            }
        }

        this.quantity = this.getTotalQuantity();
    }
}
