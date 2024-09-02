package com.example.aocv_back.service.notice.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.aocv_back.dto.notice.NoticeDTO;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.notice.Notice;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.repository.notice.NoticeRepository;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.notice.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NoticeServiceImpl implements NoticeService {
    private final NoticeRepository noticeRepository;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    public NoticeDTO createNotice(NoticeDTO noticeDTO) {


        List<String> imageUrls = noticeDTO.getImages() != null && !noticeDTO.getImages().isEmpty()
                ? noticeDTO.getImages().stream()
                .map(this::uploadImageToS3)
                .collect(Collectors.toList())
                : List.of();  // 이미지가 없을 경우 빈 리스트 사용
        noticeDTO.setImageUrls(imageUrls);

        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        noticeDTO.setCreatedAt(LocalDateTime.now().format(formatter));
        noticeDTO.setUpdatedAt(LocalDateTime.now().format(formatter));

        Notice notice = noticeDTO.toEntity(imageUrls);

        Notice savedNotice = noticeRepository.save(notice);
        return savedNotice.toDTO();
    }

    @Override
    public Page<NoticeDTO> getAllNotices(Pageable pageable, String searchCondition, String searchKeyword, String sort) {
        Page<Notice> noticePage = noticeRepository.searchAll(pageable, searchCondition, searchKeyword, sort);

        return noticePage.map(Notice::toDTO);
    }

    @Override
    public NoticeDTO getNoticeDetail(Integer id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + id));
        return notice.toDTO();
    }
    @Override
    public NoticeDTO updateNotice(NoticeDTO noticeDTO) {
        Notice existingNotice = noticeRepository.findById(noticeDTO.getId())
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + noticeDTO.getId()));

        List<String> imageUrls = noticeDTO.getImages() != null && !noticeDTO.getImages().isEmpty()
                ? noticeDTO.getImages().stream()
                .map(this::uploadImageToS3)
                .collect(Collectors.toList())
                : existingNotice.getImages();

        existingNotice.setTitle(noticeDTO.getTitle());
        existingNotice.setContent(noticeDTO.getContent());
        existingNotice.setImages(imageUrls);
        existingNotice.setUpdatedAt(LocalDateTime.now());

        Notice updatedNotice = noticeRepository.save(existingNotice);
        return updatedNotice.toDTO();
    }

    @Override
    public void deleteNotice(Integer id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with id: " + id));
        noticeRepository.delete(notice);
    }

    public String uploadImageToS3(MultipartFile image) {
        try {
            String fileName = image.getOriginalFilename();
            String fileUrl = "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/" + fileName;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getSize());
            amazonS3.putObject(bucket, fileName, image.getInputStream(), metadata);
            amazonS3.setObjectAcl(bucket, fileName, CannedAccessControlList.PublicRead);
            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to S3: " + e.getMessage());
        }
    }
}
