package com.example.aocv_back.controller.admin;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.item.ItemDTO;
import com.example.aocv_back.dto.item.OptionDTO;
import com.example.aocv_back.dto.reivew.ReviewDTO;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.service.admin.AdminService;
import com.example.aocv_back.service.review.ReviewService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final ReviewService reviewService;
    private final AmazonS3 amazonS3;
    private final ObjectMapper objectMapper;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping("/add-item")
    public ResponseEntity<ResponseDTO<ItemDTO>> addItem(
            @RequestParam("name") String name,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("contentImages") List<MultipartFile> contentImages,
            @RequestParam("productImages") List<MultipartFile> productImages,
            @RequestParam("price") double price,
            @RequestParam("status") String status,
            @RequestParam("type") String type,
            @RequestParam("category") String category,
            @RequestParam("sale") double sale,
            @RequestParam("options") String optionsJson
    ) {
        ResponseDTO<ItemDTO> responseDTO = new ResponseDTO<>();
        try {
            List<OptionDTO> options = objectMapper.readValue(optionsJson, new TypeReference<List<OptionDTO>>() {});

            List<String> contentImageUrls = uploadImagesToS3(contentImages);
            List<String> productImageUrls = uploadImagesToS3(productImages);

            ItemDTO itemDTO = ItemDTO.builder()
                    .name(name)
                    .title(title)
                    .content(content)
                    .contentImages(contentImageUrls)
                    .productImages(productImageUrls)
                    .price(price)
                    .status(status)
                    .type(type)
                    .category(category)
                    .sale(sale)
                    .options(options)
                    .quantity(options.stream().mapToInt(OptionDTO::getQuantity).sum())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            ItemDTO addedItem = adminService.addItem(itemDTO);

            responseDTO.setItem(addedItem);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Failed to add item: {}", e.getMessage(), e);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage("Failed to add item: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/modify")
    public ResponseEntity<ResponseDTO<ItemDTO>> modifyItem(
            @RequestParam("id") int id,
            @RequestParam("name") String name,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "contentImages", required = false) List<MultipartFile> contentImages,
            @RequestParam(value = "productImages", required = false) List<MultipartFile> productImages,
            @RequestParam("price") double price,
            @RequestParam("status") String status,
            @RequestParam("type") String type,
            @RequestParam("category") String category,
            @RequestParam("sale") double sale,
            @RequestParam("options") String optionsJson,
            @RequestParam(value = "existingContentImages", required = false) List<String> existingContentImages,
            @RequestParam(value = "existingProductImages", required = false) List<String> existingProductImages
    ) {
        ResponseDTO<ItemDTO> responseDTO = new ResponseDTO<>();
        try {
            List<OptionDTO> options = objectMapper.readValue(optionsJson, new TypeReference<List<OptionDTO>>(){});

            Item existingItem = adminService.findItemById(id);
            if (existingItem == null) {
                throw new RuntimeException("Item not found");
            }

            List<String> contentImageUrls = existingContentImages != null ? new ArrayList<>(existingContentImages) : new ArrayList<>(existingItem.getContentImages());
            if (contentImages != null) {
                contentImageUrls.addAll(contentImages.stream()
                        .map(this::uploadImageToS3)
                        .collect(Collectors.toList()));
            }

            List<String> productImageUrls = existingProductImages != null ? new ArrayList<>(existingProductImages) : new ArrayList<>(existingItem.getProductImages());
            if (productImages != null) {
                productImageUrls.addAll(productImages.stream()
                        .map(this::uploadImageToS3)
                        .collect(Collectors.toList()));
            }

            ItemDTO itemDTO = ItemDTO.builder()
                    .id(id)
                    .name(name)
                    .title(title)
                    .content(content)
                    .contentImages(contentImageUrls)
                    .productImages(productImageUrls)
                    .price(price)
                    .status(status)
                    .type(type)
                    .category(category)
                    .sale(sale)
                    .options(options)
                    .quantity(options.stream().mapToInt(OptionDTO::getQuantity).sum())
                    .updatedAt(LocalDateTime.now())
                    .build();

            ItemDTO updatedItem = adminService.modifyItem(itemDTO);

            responseDTO.setItem(updatedItem);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Failed to modify item: {}", e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage("Failed to modify item: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<ResponseDTO<Void>> deleteItem(@PathVariable int itemId) {
        ResponseDTO<Void> responseDTO = new ResponseDTO<>();
        try {
            adminService.deleteItem(itemId);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Failed to delete item: {}", e.getMessage(), e);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage("Failed to delete item: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/review/list")
    public ResponseEntity<ResponseDTO<Page<ReviewDTO>>> getReviewList(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        ResponseDTO<Page<ReviewDTO>> responseDTO = new ResponseDTO<>();
        try {
            log.info("Fetching reviews with pageable: {}", pageable);
            Page<ReviewDTO> reviewPage = reviewService.getAllReviews(pageable);
            log.info("Found {} reviews", reviewPage.getTotalElements());
            responseDTO.setItem(reviewPage);
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

    private List<String> uploadImagesToS3(List<MultipartFile> images) {
        return images.stream()
                .map(this::uploadImageToS3)
                .collect(Collectors.toList());
    }
}
