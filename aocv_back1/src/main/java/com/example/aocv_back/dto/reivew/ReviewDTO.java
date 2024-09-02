package com.example.aocv_back.dto.reivew;

import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.review.Review;
import com.example.aocv_back.entity.user.User;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Integer id;
    private Integer itemId;
    private Integer userId;
    private String writer;
    private String title;
    private String content;
    private int rating;
    private List<MultipartFile> images;
    private List<String> imageUrls;
    private String createdAt;
    private String updatedAt;
    private boolean isBest;
    private String itemName; // 추가
    private String itemImage; // 추가

    public Review toEntity(Item item, User user, List<String> imageUrls) {
        return Review.builder()
                .id(this.id)
                .item(item)
                .user(user)
                .title(this.title)
                .writer(this.writer)
                .content(this.content)
                .rating(this.rating)
                .images(imageUrls)
                .createdAt(LocalDateTime.parse(this.createdAt))
                .updatedAt(LocalDateTime.parse(this.updatedAt))
                .isBest(this.isBest)
                .build();
    }
}
