package com.example.aocv_back.controller.review;

import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.reivew.ReviewDTO;
import com.example.aocv_back.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/add-review")
    public ResponseEntity<ResponseDTO<ReviewDTO>> createReview(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("rating") int rating,
            @RequestParam("userId") Integer userId,
            @RequestParam("itemId") Integer itemId,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        ResponseDTO<ReviewDTO> responseDTO = new ResponseDTO<>();
        try {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setTitle(title);
            reviewDTO.setContent(content);
            reviewDTO.setRating(rating);
            reviewDTO.setImages(images);
            reviewDTO.setUserId(userId);
            reviewDTO.setItemId(itemId);

            ReviewDTO createdReview = reviewService.createReview(reviewDTO);

            responseDTO.setItem(createdReview);
            responseDTO.setStatusCode(HttpStatus.CREATED.value());

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            log.error("Error creating review: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<?> getReviewsByItemId(
            @PathVariable Integer itemId,
            @PageableDefault(page = 0, size = 5) Pageable pageable) {

        ResponseDTO<ReviewDTO> responseDTO = new ResponseDTO<>();
        try {
            Page<ReviewDTO> reviewDTOPage = reviewService.getReviewsByItemId(itemId, pageable);

            responseDTO.setPageItems(reviewDTOPage);
            responseDTO.setItem(ReviewDTO.builder().build());

            responseDTO.setStatusCode(HttpStatus.OK.value());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error getting reviews: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<ResponseDTO<Void>> deleteReview(@PathVariable Integer reviewId) {
        ResponseDTO<Void> responseDTO = new ResponseDTO<>();
        try {
            reviewService.deleteReview(reviewId);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error deleting review: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
    @PostMapping("/mark-best/{itemId}/{reviewId}")
    public ResponseEntity<ResponseDTO<Void>> markReviewAsBest(@PathVariable Integer itemId, @PathVariable Integer reviewId) {
        ResponseDTO<Void> responseDTO = new ResponseDTO<>();
        try {
            reviewService.markReviewAsBest(reviewId, itemId);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error marking review as best: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/unmark-best/{itemId}/{reviewId}")
    public ResponseEntity<ResponseDTO<Void>> unmarkReviewAsBest(@PathVariable Integer itemId, @PathVariable Integer reviewId) {
        ResponseDTO<Void> responseDTO = new ResponseDTO<>();
        try {
            reviewService.unmarkReviewAsBest(reviewId, itemId);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error unmarking review as best: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

}