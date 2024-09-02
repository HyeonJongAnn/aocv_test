package com.example.aocv_back.controller.user;

import com.example.aocv_back.jwt.JwtTokenProvider;
import com.example.aocv_back.service.user.KakaoService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class KakaoController {
    private final KakaoService kakaoService;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper; // ObjectMapper 주입

    @PostMapping("/auth/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> payload) throws JsonProcessingException {
        String code = payload.get("code");
        String userJson = kakaoService.kakaoLogin(code);

        // JSON 문자열을 JsonNode로 변환하여 필요한 정보를 추출
        JsonNode userNode = objectMapper.readTree(userJson);

        return ResponseEntity.ok().body(Map.of(
                "id", userNode.get("id").asText(),
                "userId", userNode.get("userId").asText(),
                "userName", userNode.get("userName").asText(),
                "userTel", userNode.get("userTel").asText(),
                "userAddress", userNode.get("userAddress").asText(),
                "token", userNode.get("token").asText(),
                "point", userNode.path("point").asText(null)
        ));
    }
}