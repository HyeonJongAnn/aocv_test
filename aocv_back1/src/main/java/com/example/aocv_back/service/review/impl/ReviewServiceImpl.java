package com.example.aocv_back.service.review.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.aocv_back.dto.reivew.ReviewDTO;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.entity.review.Review;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.repository.item.ItemRepository;
import com.example.aocv_back.repository.review.ReviewRepository;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        Item item = itemRepository.findById(reviewDTO.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid item ID"));

        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        List<String> imageUrls = reviewDTO.getImages() != null && !reviewDTO.getImages().isEmpty()
                ? reviewDTO.getImages().stream()
                .map(this::uploadImageToS3)
                .collect(Collectors.toList())
                : List.of();  // 이미지가 없을 경우 빈 리스트 사용
        reviewDTO.setImageUrls(imageUrls);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        reviewDTO.setWriter(user.getUserId());
        reviewDTO.setCreatedAt(LocalDateTime.now().format(formatter));
        reviewDTO.setUpdatedAt(LocalDateTime.now().format(formatter));

        Review review = reviewDTO.toEntity(item, user, imageUrls);

        Review savedReview = reviewRepository.save(review);
        return savedReview.toDTO();
    }

    @Override
    public Page<ReviewDTO> getReviewsByItemId(Integer itemId, Pageable pageable) {
        return reviewRepository.findByItemIdOrderByIsBestDescCreatedAtDesc(itemId, pageable).map(Review::toDTO);
    }

    @Override
    public void deleteReview(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));
        reviewRepository.delete(review);
    }

    @Override
    public void markReviewAsBest(Integer reviewId, Integer itemId) {
        Review review = reviewRepository.findByIdAndItemId(reviewId, itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid review ID or item ID"));
        review.setBest(true);
        reviewRepository.save(review);
    }

    @Override
    public void unmarkReviewAsBest(Integer reviewId, Integer itemId) {
        Review review = reviewRepository.findByIdAndItemId(reviewId, itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid review ID or item ID"));
        review.setBest(false);
        reviewRepository.save(review);
    }

    @Override
    public Page<ReviewDTO> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(Review::toDTO);
    }

    private String uploadImageToS3(MultipartFile image) {
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