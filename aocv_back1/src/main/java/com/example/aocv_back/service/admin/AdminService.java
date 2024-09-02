package com.example.aocv_back.service.admin;

import com.example.aocv_back.dto.item.ItemDTO;
import com.example.aocv_back.entity.item.Item;

import java.util.List;

public interface AdminService {

    ItemDTO addItem(ItemDTO itemDTO);

    ItemDTO modifyItem(ItemDTO itemDTO);

    void deleteItem(int itemId);

    Item findItemById(int id);
}
