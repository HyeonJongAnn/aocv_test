package com.example.aocv_back.controller.item;

import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.item.ItemDTO;
import com.example.aocv_back.service.item.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/item")
public class ItemController {
    private final ItemService itemService;


    @GetMapping("/list")
    public ResponseEntity<?> getItemList(@PageableDefault(page = 0, size = 12) Pageable pageable,
                                         @RequestParam("searchCondition") String searchCondition,
                                         @RequestParam("searchKeyword") String searchKeyword,
                                         @RequestParam(name = "sort", defaultValue = "latest") String sort) {

        ResponseDTO<ItemDTO> responseDTO = new ResponseDTO<>();

        try {
            Page<ItemDTO> itemDTOPage = itemService.searchAll(pageable, searchCondition, searchKeyword, sort);

            responseDTO.setPageItems(itemDTOPage);
            responseDTO.setItem(ItemDTO.builder()
                    .searchCondition(searchCondition)
                    .searchKeyword(searchKeyword)
                    .sort(sort)
                    .build());
            responseDTO.setStatusCode(HttpStatus.OK.value());

            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            log.error("Error processing request: {}", e.getMessage(), e);
            responseDTO.setErrorCode(201);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());

            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Integer id) {
        ResponseDTO<ItemDTO> responseDTO = new ResponseDTO<>();

        ItemDTO itemDTO = itemService.findById(id);


        if (itemDTO != null) {
            return ResponseEntity.ok(itemDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/random-items")
    public ResponseEntity<ResponseDTO<List<ItemDTO>>> getRandomItems() {
        ResponseDTO<List<ItemDTO>> responseDTO = new ResponseDTO<>();
        try {
            List<ItemDTO> randomItems = itemService.getRandomItems();
            responseDTO.setItem(randomItems);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Error getting random items: {}", e.getMessage(), e);
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
}
