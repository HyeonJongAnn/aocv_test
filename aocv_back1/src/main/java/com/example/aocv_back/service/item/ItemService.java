package com.example.aocv_back.service.item;

import com.example.aocv_back.dto.item.ItemDTO;
import com.example.aocv_back.entity.item.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface ItemService {

    Page<ItemDTO> searchAll(Pageable pageable, String searchCondition, String searchKeyword, String sort);
    ItemDTO findById(Integer id);

    List<ItemDTO> getRandomItems();
}
