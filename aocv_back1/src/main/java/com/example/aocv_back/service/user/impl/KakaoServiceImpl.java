package com.example.aocv_back.service.user.impl;

import com.example.aocv_back.entity.user.Gender;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.jwt.JwtTokenProvider;
import com.example.aocv_back.repository.user.UserRepository;
import com.example.aocv_back.service.user.KakaoService;
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
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
 public class KakaoServiceImpl implements KakaoService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Override
    public String kakaoLogin(String code) {
        String accessToken = getKakaoAccessToken(code);
        Map<String, Object> userInfo = getKakaoUserInfo(accessToken);
        String userAddress = getUserShippingAddress(accessToken);
        User user = saveOrUpdateUser(userInfo, userAddress);


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
    public String getKakaoAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        String body = String.format(
                "grant_type=authorization_code&client_id=%s&redirect_uri=%s&code=%s&client_secret=%s",
                clientId, redirectUri, code, clientSecret
        );

        HttpEntity<String> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        return (String) response.getBody().get("access_token");
    }

    @Override
    public Map<String, Object> getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);

        return response.getBody();
    }

    public String getUserShippingAddress(String accessToken) {
        String url = "https://kapi.kakao.com/v1/user/shipping_address";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
        );

        Map<String, Object> responseBody = responseEntity.getBody();
        String userAddress = null;

        if (responseBody != null && responseBody.containsKey("shipping_addresses")) {
            List<Map<String, Object>> shippingAddresses = (List<Map<String, Object>>) responseBody.get("shipping_addresses");

            if (!shippingAddresses.isEmpty()) {
                Map<String, Object> firstAddress = shippingAddresses.get(0);
                String baseAddress = (String) firstAddress.get("base_address");
                String detailAddress = (String) firstAddress.get("detail_address");

                userAddress = baseAddress;
                if (detailAddress != null && !detailAddress.isEmpty()) {
                    userAddress += " " + detailAddress;
                }
            }
        }
        return userAddress;
    }

    private User saveOrUpdateUser(Map<String, Object> userInfo, String userAddress) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        String kakaoId = userInfo.get("id").toString();
        String email = (String) kakaoAccount.get("email");
        String name = (String) kakaoAccount.get("name");
        String genderStr = (String) kakaoAccount.get("gender");
        Gender gender = genderStr != null && genderStr.equals("male") ? Gender.MALE : Gender.FEMALE;
        String birthday = (String) kakaoAccount.get("birthday");
        String birthyear = (String) kakaoAccount.get("birthyear");

        LocalDate userBirth = null;
        if (birthyear != null && birthday != null) {
            userBirth = LocalDate.from(LocalDate.of(Integer.parseInt(birthyear), Integer.parseInt(birthday.substring(0, 2)), Integer.parseInt(birthday.substring(2, 4))).atStartOfDay());
        }

        String phoneNumber = (String) kakaoAccount.get("phone_number");

        String formattedPhoneNumber = null;
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            // 공백과 '-'를 제거하고 숫자만 남기기
            formattedPhoneNumber = phoneNumber.replaceAll("[^0-9]", "");

            // 국내 전화번호 형식으로 변환: +821089759219 -> 010-8975-9219
            if (formattedPhoneNumber.startsWith("82")) {
                formattedPhoneNumber = "0" + formattedPhoneNumber.substring(2); // "01089759219"
            }

            formattedPhoneNumber = formattedPhoneNumber.substring(0, 3) + "-" + formattedPhoneNumber.substring(3, 7) + "-" + formattedPhoneNumber.substring(7); // "010-8975-9219"

            System.out.println("Formatted phone number: " + formattedPhoneNumber); // 결과 출력

            // 이제 formattedPhoneNumber을 DB에 저장하면 됩니다.
        } else {
            // 전화번호가 없는 경우 예외 처리
            System.out.println("Phone number is null or empty.");
        }

        User user = userRepository.findByUserId(email)
                .orElse(User.builder()
                        .userId(email)
                        .userPw(kakaoId)
                        .userName(name)
                        .gender(gender)
                        .userAddress(userAddress)
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
            user.setUserAddress(userAddress);
        }

        return userRepository.save(user);
    }
}
