package com.example.aocv_back.repository.user;

import com.example.aocv_back.dto.user.UserDTO;
import com.example.aocv_back.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByUserId(String userId);

    Optional<User> findByUserId(String userId);

    Optional<User> findByUserNameAndUserTel(String userName, String userTel);

    Optional<User> findByUserIdAndUserNameAndUserTel(String userId, String userName, String userTel);

}
