package com.example.aocv_back.repository.admin;

import com.example.aocv_back.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<User, Integer> {
}
