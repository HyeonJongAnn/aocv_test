package com.example.aocv_back.dto.notice;

import com.example.aocv_back.entity.notice.Notice;
import com.example.aocv_back.entity.user.User;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class NoticeDTO {
    private Integer id;
    private String title;
    private String content;
    private List<MultipartFile> images;
    private List<String> imageUrls;
    private String createdAt;
    private String updatedAt;

    private String searchCondition;
    private String searchKeyword;
    private String sort;

    public Notice toEntity(List<String> imageUrls) {
        return Notice.builder()
                .id(this.id)
                .title(this.title)
                .content(this.content)
                .images(imageUrls)
                .createdAt(LocalDateTime.parse(this.createdAt))
                .updatedAt(LocalDateTime.parse(this.updatedAt))
                .build();
    }
}