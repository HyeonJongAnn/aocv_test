package com.example.aocv_back.service.user.impl;

import com.example.aocv_back.entity.user.Gender;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.jwt.JwtTokenProvider;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.user.GoogleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleServiceImpl implements GoogleService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    @Override
    public String googleLogin(String code) {
        String accessToken = getGoogleAccessToken(code);
        Map<String, Object> userInfo = getGoogleUserInfo(accessToken);

        // 사용자 정보 추출
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");
        String googleId = (String) userInfo.get("id");


        // 사용자 정보 확인
        User existingUser = userRepository.findByUserId(email).orElse(null);

        if (existingUser != null) {
            // 기존 회원이면 JWT 토큰만 생성하여 반환
            String token = jwtTokenProvider.create(existingUser);
            existingUser.setToken(token);
            userRepository.save(existingUser);

            try {
                Map<String, Object> responseMap = Map.of(
                        "id", existingUser.getId(),
                        "userId", existingUser.getUserId(),
                        "userName", existingUser.getUserName(),
                        "userTel", existingUser.getUserTel() != null ? existingUser.getUserTel() : "",
                        "userAddress", existingUser.getUserAddress() != null ? existingUser.getUserAddress() : "",
                        "token", token,
                        "googleId", googleId,
                        "point", existingUser.getPoint()
                );
                return objectMapper.writeValueAsString(responseMap);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to convert user to JSON", e);
            }
        }

        // 새로운 사용자라면 추가 입력 필요
        User user = new User();
        user.setUserId(email);
        user.setUserName(name);
        user.setUserPw(googleId);
        String token = jwtTokenProvider.create(user);
        user.setToken(token);

        try {
            Map<String, Object> responseMap = Map.of(
                    "userId", user.getUserId(),
                    "userName", user.getUserName(),
                    "userTel", user.getUserTel() != null ? user.getUserTel() : "",
                    "userAddress", user.getUserAddress() != null ? user.getUserAddress() : "",
                    "token", token,
                    "googleId", googleId,
                    "point", user.getPoint()
            );
            return objectMapper.writeValueAsString(responseMap);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to convert user to JSON", e);
        }
    }


    @Override
    public String getGoogleAccessToken(String code) {
        String tokenUrl = "https://oauth2.googleapis.com/token";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        String body = String.format(
                "grant_type=authorization_code&client_id=%s&client_secret=%s&redirect_uri=%s&code=%s",
                clientId, clientSecret, redirectUri, code
        );

        HttpEntity<String> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
        System.out.println((String) response.getBody().get("access_token"));
        return (String) response.getBody().get("access_token");
    }

    @Override
    public Map<String, Object> getGoogleUserInfo(String accessToken) {
        String userInfoUrl = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);
        System.out.println(response.getBody());
        return response.getBody();
    }

    @Override
    public User saveOrUpdateUser(Map<String, Object> userInfo) {

        String email = (String) userInfo.get("userId");
        String googleId = (String) userInfo.get("googleId");
        String name = (String) userInfo.get("userName");
        String genderStr = (String) userInfo.get("gender");
        Gender gender = Gender.valueOf(genderStr.toUpperCase());
        String birthdate = (String) userInfo.get("birthdate");
        LocalDate userBirth = LocalDate.parse(birthdate);
        String phoneNumber = (String) userInfo.get("phoneNumber");
        String address = userInfo.get("basicAddress") + " " + userInfo.get("detailedAddress");
        String token = (String) userInfo.get("token");

        User user = userRepository.findByUserId(email)
                .orElse(User.builder()
                        .userId(email)
                        .userPw(googleId)
                        .userName(name)
                        .gender(gender)
                        .userAddress(address)
                        .userBirth(userBirth.atStartOfDay())
                        .userTel(phoneNumber)
                        .userRegDate(LocalDateTime.now())
                        .isActive(true)
                        .lastLoginDate(LocalDateTime.now())
                        .build());
        user.setPoint(1000);
        user.setLastLoginDate(LocalDateTime.now());
        user.setRole("ROLE_USER");
        user.setToken(token);
        return userRepository.save(user);
    }
}