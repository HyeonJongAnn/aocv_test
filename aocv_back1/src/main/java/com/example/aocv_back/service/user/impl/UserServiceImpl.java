package com.example.aocv_back.service.user.impl;

import com.example.aocv_back.dto.user.UserDTO;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.findpw.PasswordGenerator;
import com.example.aocv_back.jwt.JwtTokenProvider;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.user.UserService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO signup(UserDTO userDTO) {
        if (userRepository.existsByUserId(userDTO.getUserId())) {
            throw new RuntimeException("User already exists");
        }
        if (StringUtils.isBlank(userDTO.getUserId())) {
            throw new IllegalArgumentException("id is required");
        }
        if (StringUtils.isBlank(userDTO.getUserPw())) {
            throw new IllegalArgumentException("password is required");
        }
        if (StringUtils.isBlank(userDTO.getUserName())) {
            throw new IllegalArgumentException("name is required");
        }
        User user = userRepository.save(userDTO.toEntity());

        return user.toDTO();
    }

    @Override
    public UserDTO signin(UserDTO userDTO) {
        Optional<User> signInUser = userRepository.findByUserId(userDTO.getUserId());

        if (signInUser.isEmpty()) {
            throw new RuntimeException("not exist userid");
        }

        if (!passwordEncoder.matches(userDTO.getUserPw(), signInUser.get().getUserPw())) {
            throw new RuntimeException("wrong password");
        }

        UserDTO signInUserDTO = signInUser.get().toDTO();

        signInUserDTO.setLastLoginDate(LocalDateTime.parse(LocalDateTime.now().toString()));
        signInUserDTO.setToken(jwtTokenProvider.create(signInUser.get()));
        userRepository.save(signInUserDTO.toEntity());
        userRepository.flush();

        return signInUserDTO;
    }

    @Override
    public UserDTO findPw(String userId, String userName, String userTel) {
        Optional<User> userOptional = userRepository.findByUserIdAndUserNameAndUserTel(userId, userName, userTel);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 임시 비밀번호 생성
            String temporaryPassword = PasswordGenerator.generateRandomPassword(8);

            // 비밀번호를 암호화하여 저장
            user.setUserPw(passwordEncoder.encode(temporaryPassword));

            // 사용자 정보 저장
            userRepository.save(user);

            return user.toDTO();
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Override
    public UserDTO modify(String userId, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findByUserId(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User existingUser = optionalUser.get();

        if (!userId.contains("@")) {
            if (!passwordEncoder.matches(userDTO.getCurUserPw(), existingUser.getUserPw())) {
                String errorMessage = "Current user password does not match.";
                log.error(errorMessage);
                throw new IllegalArgumentException(errorMessage);
            }
        }

        existingUser.setUserName(userDTO.getUserName());
        existingUser.setUserTel(userDTO.getUserTel());
        existingUser.setUserAddress(userDTO.getUserAddress());

        if (userDTO.getUserPw() != null && !userDTO.getUserPw().isEmpty()) {
            userDTO.setUserPw(passwordEncoder.encode(userDTO.getUserPw()));
        } else {
            userDTO.setUserPw(optionalUser.get().getUserPw());
        }


        User savedUser = userRepository.save(existingUser);

        UserDTO updatedUserDTO = savedUser.toDTO();

        return updatedUserDTO;
    }

    @Override
    public Optional<User> findById(String userId) {
        return userRepository.findByUserId(userId);
    }


    @Override
    public boolean isUserIdAvailable(String userId) {
        return !userRepository.existsByUserId(userId);
    }

    @Override
    public UserDTO findId(String userName, String userTel) {
        Optional<User> userOptional = userRepository.findByUserNameAndUserTel(userName, userTel);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.toDTO();
        } else {
            return null;
        }
    }

    @Override
    public void deleteUser(String userId) {
        Optional<User> userOptional = userRepository.findByUserId(userId);
        userOptional.ifPresent(user -> userRepository.delete(user));
    }

    public void checkPassword(String userPw, String userId) {
        Optional<User> optionalUser = userRepository.findByUserId(userId);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(userPw, user.getUserPw())) {
            throw new IllegalArgumentException("Current user password does not match");
        }
    }

    @Override
    public UserDTO updateUserAddress(UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findByUserId(userDTO.getUserId());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        user.setUserName(userDTO.getUserName());
        user.setUserTel(userDTO.getUserTel());
        user.setUserAddress(userDTO.getUserAddress());

        User updatedUser = userRepository.save(user);

        return updatedUser.toDTO();
    }

    @Override
    public void deductUserPoints(Integer id, int points) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        int currentPoints = user.getPoint();
        System.out.println(currentPoints);
        System.out.println(points);
        if (currentPoints < points) {
            throw new RuntimeException("Insufficient points");
        }
        user.setPoint(currentPoints - points);
        userRepository.save(user);
    }

    @Override
    public User findById(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void addUserPoints(Integer id, int points) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        int currentPoints = user.getPoint();
        user.setPoint(currentPoints + points);
        userRepository.save(user);
    }
}
