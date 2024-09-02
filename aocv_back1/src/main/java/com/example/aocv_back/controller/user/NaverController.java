package com.example.aocv_back.controller.user;

import com.example.aocv_back.jwt.JwtTokenProvider;
import com.example.aocv_back.service.user.NaverService;
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
public class NaverController {
    private final NaverService naverService;
    private final ObjectMapper objectMapper; // ObjectMapper 주입

    @PostMapping("/auth/naver")
    public ResponseEntity<?> naverLogin(@RequestBody Map<String, String> payload) {
        try {
            String code = payload.get("code");
            String state = payload.get("state");

            if (code == null || state == null) {
                return ResponseEntity.badRequest().body("Code and state must be provided");
            }

            String userJson = naverService.naverLogin(code, state);

            // JSON 문자열을 JsonNode로 변환하여 필요한 정보를 추출
            JsonNode userNode = objectMapper.readTree(userJson);

            return ResponseEntity.ok().body(Map.of(
                    "id", userNode.path("id").asText(),
                    "userId", userNode.path("userId").asText(null),
                    "userName", userNode.path("userName").asText(null),
                    "userTel", userNode.path("userTel").asText(null),
                    "userAddress", userNode.path("userAddress").asText(null),
                    "token", userNode.path("token").asText(null),
                    "point", userNode.path("point").asText(null)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while processing the request");
        }
    }
}
