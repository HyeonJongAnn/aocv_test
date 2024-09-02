package com.example.aocv_back.service.user.impl;
import com.example.aocv_back.entity.user.Gender;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.jwt.JwtTokenProvider;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.user.NaverService;
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
public class NaverServiceImpl implements NaverService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    @Value("${naver.redirect-uri}")
    private String redirectUri;

    @Override
    public String naverLogin(String code, String state) {
        String accessToken = getNaverAccessToken(code, state);
        Map<String, Object> userInfo = getNaverUserInfo(accessToken);
        User user = saveOrUpdateUser(userInfo);

        // JWT 토큰 생성
        String token = jwtTokenProvider.create(user);
        user.setToken(token); // Token을 User 객체에 설정

        // User 객체를 JSON 문자열로 변환
        try {
            Map<String, Object> responseMap = Map.of(
                    "id", user.getId(),
                    "userId", user.getUserId(),
                    "userName", user.getUserName(),
                    "userTel", user.getUserTel(),
                    "userAddress", user.getUserAddress(),
                    "token", token,
                    "point", user.getPoint()
            );
            return objectMapper.writeValueAsString(responseMap);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert user to JSON", e);
        }
    }

    @Override
    public String getNaverAccessToken(String code, String state) {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        String body = String.format(
                "grant_type=authorization_code&client_id=%s&client_secret=%s&redirect_uri=%s&code=%s&state=%s",
                clientId, clientSecret, redirectUri, code, state
        );

        HttpEntity<String> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
        return (String) response.getBody().get("access_token");
    }

    @Override
    public Map<String, Object> getNaverUserInfo(String accessToken) {
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }

    private User saveOrUpdateUser(Map<String, Object> userInfo) {
        Map<String, Object> response = (Map<String, Object>) userInfo.get("response");
        String naverId = (String) response.get("id");
        String email = (String) response.get("email");
        String name = (String) response.get("name");
        String genderStr = (String) response.get("gender");
        Gender gender = genderStr != null && genderStr.equals("M") ? Gender.MALE : Gender.FEMALE;
        String birthday = (String) response.get("birthday");
        String birthyear = (String) response.get("birthyear");

        LocalDate userBirth = null;
        if (birthyear != null && birthday != null) {
            userBirth = LocalDate.parse(birthyear + "-" + birthday);
        }

        String phoneNumber = (String) response.get("mobile");

        String formattedPhoneNumber = null;
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            formattedPhoneNumber = phoneNumber.replaceAll("[^0-9]", "");

            if (formattedPhoneNumber.startsWith("82")) {
                formattedPhoneNumber = "0" + formattedPhoneNumber.substring(2);
            }

            formattedPhoneNumber = formattedPhoneNumber.substring(0, 3) + "-" + formattedPhoneNumber.substring(3, 7) + "-" + formattedPhoneNumber.substring(7);

            System.out.println("Formatted phone number: " + formattedPhoneNumber);
        } else {
            System.out.println("Phone number is null or empty.");
        }


        User user = userRepository.findByUserId(email)
                .orElse(User.builder()
                        .userId(email)
                        .userPw(naverId)
                        .userName(name)
                        .gender(gender)
                        .userAddress("배송지 주소 설정은 필수입니다")
                        .userBirth(userBirth != null ? userBirth.atStartOfDay() : null)
                        .userTel(formattedPhoneNumber)
                        .userRegDate(LocalDateTime.now())
                        .isActive(true)
                        .lastLoginDate(LocalDateTime.now())
                        .build());

        // 업데이트 시 로그인 날짜 갱신
        user.setLastLoginDate(LocalDateTime.now());
        user.setPoint(1000);
        user.setRole("ROLE_USER");

        // 필요한 경우만 업데이트
        if (user.getUserName() == null) {
            user.setUserName(name);
        }
        if (user.getGender() == null) {
            user.setGender(gender);
        }
        if (user.getUserBirth() == null) {
            user.setUserBirth(userBirth != null ? userBirth.atStartOfDay() : null);
        }
        if (user.getUserTel() == null) {
            user.setUserTel(formattedPhoneNumber);
        }
        if (user.getUserAddress() == null) {
            user.setUserAddress("배송지 주소 설정은 필수입니다");
        }

        return userRepository.save(user);
    }
}
