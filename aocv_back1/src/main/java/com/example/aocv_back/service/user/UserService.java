package com.example.aocv_back.service.user;

import com.example.aocv_back.dto.user.UserDTO;
import com.example.aocv_back.entity.user.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserDTO signup(UserDTO userDTO);

    boolean isUserIdAvailable(String userId);

    UserDTO findId(String userName,String userTel);

    UserDTO signin(UserDTO userDTO);

    UserDTO findPw(String userId, String userName, String userTel);

    void saveUser(User user);

    UserDTO modify(String userId, UserDTO userDTO);

    Optional<User> findById(String userId);

    void deleteUser(String userId);

    void checkPassword(String userPw, String userId);

    UserDTO updateUserAddress(UserDTO userDTO);

    void deductUserPoints(Integer id, int points);

    User findById(Integer id);

    void addUserPoints(Integer id, int rewardPoints);
}
