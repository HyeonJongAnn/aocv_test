package com.example.aocv_back.repository.order;

import com.example.aocv_back.entity.order.Address;
import com.example.aocv_back.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Integer> {
}
