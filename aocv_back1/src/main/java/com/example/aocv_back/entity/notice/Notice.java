package com.example.aocv_back.entity.notice;

import com.example.aocv_back.dto.notice.NoticeDTO;
import com.example.aocv_back.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Table(name = "T_NOTICE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "NoticeSeqGenerator",
        sequenceName = "T_NOTICE_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_seq")
    private Integer id;


    private String title;
    private String content;


    @ElementCollection
    @CollectionTable(name = "T_NOTICE_IMAGES", joinColumns = @JoinColumn(name = "notice_seq"))
    @Column(name = "images")
    private List<String> images;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public NoticeDTO toDTO() {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        return NoticeDTO.builder()
                .id(this.id)
                .title(this.title)
                .content(this.content)
                .imageUrls(this.images)
                .createdAt(this.createdAt.format(formatter))
                .updatedAt(this.updatedAt.format(formatter))
                .build();
    }

}
