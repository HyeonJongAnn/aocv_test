package com.example.aocv_back.service.admin.impl;

import com.example.aocv_back.dto.item.ItemDTO;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.repository.item.ItemRepository;
import com.example.aocv_back.repository.review.ReviewRepository;
import com.example.aocv_back.service.admin.AdminService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ItemRepository itemRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public ItemDTO addItem(ItemDTO itemDTO) {
        Item item = itemDTO.toEntity();
        item.getOptions().forEach(option -> option.setItem(item));
        Item savedItem = itemRepository.save(item);
        return savedItem.toDTO();
    }

    @Override
    public ItemDTO modifyItem(ItemDTO itemDTO) {
        Item item = itemRepository.findById(itemDTO.getId()).orElseThrow(() -> new RuntimeException("Item not found"));
        item.updateFromDTO(itemDTO);
        Item savedItem = itemRepository.save(item);
        return savedItem.toDTO();
    }

    @Override
    @Transactional
    public void deleteItem(int itemId) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
        reviewRepository.deleteByItemId(itemId);
        itemRepository.delete(item);
    }

    @Override
    public Item findItemById(int id) {
        return itemRepository.findById(id).orElse(null);
    }
}
