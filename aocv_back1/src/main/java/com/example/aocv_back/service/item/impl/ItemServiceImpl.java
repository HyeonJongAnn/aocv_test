package com.example.aocv_back.service.item.impl;

import com.example.aocv_back.dto.item.ItemDTO;
import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.repository.item.ItemRepository;
import com.example.aocv_back.service.item.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final ItemRepository itemRepository;

    @Override
    public Page<ItemDTO> searchAll(Pageable pageable, String searchCondition, String searchKeyword, String sort) {
        // ItemRepository의 searchAll 메서드 사용
        Page<Item> itemPage = itemRepository.searchAll(pageable, searchCondition, searchKeyword, sort);

        // Item을 ItemDTO로 변환
        return itemPage.map(Item::toDTO);
    }

    @Override
    public ItemDTO findById(Integer id) {
        Optional<Item> optionalItem = itemRepository.findById(id);
        return optionalItem.map(Item::toDTO).orElse(null);
    }

    @Override
    public List<ItemDTO> getRandomItems() {
        List<Item> items = itemRepository.findAll();
        Collections.shuffle(items);
        return items.stream()
                .limit(4) // 상위 4개만 추출
                .map(Item::toDTO)
                .collect(Collectors.toList());
    }
}
