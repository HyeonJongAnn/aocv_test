package com.example.aocv_back.repository.item;

import com.example.aocv_back.entity.item.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ItemRepositoryCustom {
    Page<Item> searchAll(Pageable pageable, String searchCondition, String searchKeyword, String sort);
}
