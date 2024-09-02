package com.example.aocv_back.controller.notice;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.notice.NoticeDTO;
import com.example.aocv_back.dto.reivew.ReviewDTO;
import com.example.aocv_back.service.notice.NoticeService;
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
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<NoticeDTO>> createNotice(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        ResponseDTO<NoticeDTO> responseDTO = new ResponseDTO<>();
        try {
            NoticeDTO noticeDTO = new NoticeDTO();
            noticeDTO.setTitle(title);
            noticeDTO.setContent(content);
            noticeDTO.setImages(images);

            NoticeDTO createdNotice = noticeService.createNotice(noticeDTO);

            responseDTO.setItem(createdNotice);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Failed to create notice: {}", e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage("Failed to create notice: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getNoticeList(@PageableDefault(page = 0, size = 12) Pageable pageable,
                                                                      @RequestParam("searchCondition") String searchCondition,
                                                                      @RequestParam("searchKeyword") String searchKeyword,
                                                                      @RequestParam(name = "sort", defaultValue = "latest") String sort) {
        ResponseDTO<NoticeDTO> responseDTO = new ResponseDTO<>();
        try {
            Page<NoticeDTO> noticeDTOPage = noticeService.getAllNotices(pageable, searchCondition, searchKeyword, sort);

            responseDTO.setPageItems(noticeDTOPage);
            responseDTO.setItem(NoticeDTO.builder()
                    .searchCondition(searchCondition)
                    .searchKeyword(searchKeyword)
                    .sort(sort)
                    .build());
            responseDTO.setStatusCode(HttpStatus.OK.value());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error getting notices: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<NoticeDTO>> getNoticeDetail(@PathVariable Integer id) {
        ResponseDTO<NoticeDTO> responseDTO = new ResponseDTO<>();
        try {
            NoticeDTO noticeDTO = noticeService.getNoticeDetail(id);
            responseDTO.setItem(noticeDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error getting notice detail: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PutMapping("/modify")
    public ResponseEntity<ResponseDTO<NoticeDTO>> updateNotice(
            @RequestParam("id") Integer id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        ResponseDTO<NoticeDTO> responseDTO = new ResponseDTO<>();
        try {
            NoticeDTO noticeDTO = new NoticeDTO();
            noticeDTO.setId(id);
            noticeDTO.setTitle(title);
            noticeDTO.setContent(content);
            noticeDTO.setImages(images);

            NoticeDTO updatedNotice = noticeService.updateNotice(noticeDTO);

            responseDTO.setItem(updatedNotice);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Failed to update notice: {}", e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage("Failed to update notice: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDTO<Void>> deleteNotice(@PathVariable Integer id) {
        ResponseDTO<Void> responseDTO = new ResponseDTO<>();
        try {
            noticeService.deleteNotice(id);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Failed to delete notice: {}", e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage("Failed to delete notice: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
}
