package com.example.aocv_back.entity.review;

import com.example.aocv_back.dto.reivew.ReviewDTO;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Table(name = "T_REVIEW")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_seq")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_seq", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_seq", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private int rating;

    @ElementCollection
    @CollectionTable(name = "T_REVIEW_IMAGE", joinColumns = @JoinColumn(name = "review_seq"))
    @Column(name = "images")
    private List<String> images;

    @Column(nullable = false)
    private String writer;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean isBest = false;

    public ReviewDTO toDTO() {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return ReviewDTO.builder()
                .id(this.id)
                .itemId(this.item.getId())
                .userId(this.user.getId())
                .title(this.title)
                .content(this.content)
                .rating(this.rating)
                .writer(this.writer)
                .imageUrls(this.images)
                .createdAt(this.createdAt.format(formatter))
                .updatedAt(this.updatedAt.format(formatter))
                .isBest(this.isBest)
                .itemName(this.item.getName()) // 추가
                .itemImage(this.item.getProductImages().isEmpty() ? null : this.item.getProductImages().get(0)) // 추가
                .build();
    }
}
