package com.example.aocv_back.service.review;

import com.example.aocv_back.dto.reivew.ReviewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewDTO createReview(ReviewDTO reviewDTO);

    Page<ReviewDTO> getReviewsByItemId(Integer itemId, Pageable pageable);

    void deleteReview(Integer reviewId);

    void markReviewAsBest(Integer reviewId, Integer itemId);

    void unmarkReviewAsBest(Integer reviewId, Integer itemId);

    Page<ReviewDTO> getAllReviews(Pageable pageable);
}
