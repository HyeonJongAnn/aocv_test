package com.example.aocv_back.controller.user;

import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.service.user.GoogleService;
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
public class GoogleController {
    private final GoogleService googleService;
    private final ObjectMapper objectMapper;

    @PostMapping("/auth/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            String code = payload.get("code");

            if (code == null) {
                return ResponseEntity.badRequest().body("Code must be provided");
            }

            String userJson = googleService.googleLogin(code);

            JsonNode userNode = objectMapper.readTree(userJson);

            return ResponseEntity.ok().body(Map.of(
                    "id", userNode.path("id").asText(),
                    "userId", userNode.path("userId").asText(null),
                    "userName", userNode.path("userName").asText(null),
                    "userTel", userNode.path("userTel").asText(null),
                    "userAddress", userNode.path("userAddress").asText(null),
                    "token", userNode.path("token").asText(null),
                    "googleId", userNode.path("googleId").asText(null),
                    "point", userNode.path("point").asText(null)
            ));
        } catch (Exception e) {
            e.printStackTrace(); // 오류를 출력합니다.
            return ResponseEntity.status(500).body("An error occurred while processing the request");
        }
    }

    @PostMapping("/auth/google/additional-info")
    public ResponseEntity<?> updateAdditionalInfo(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("userId");
            if (email == null) {
                return ResponseEntity.badRequest().body("Email must be provided");
            }

            User updatedUser = googleService.saveOrUpdateUser(payload);

            return ResponseEntity.ok().body(Map.of(
                    "id", updatedUser.getId(),
                    "userId", updatedUser.getUserId(),
                    "userName", updatedUser.getUserName(),
                    "userTel", updatedUser.getUserTel(),
                    "userAddress", updatedUser.getUserAddress(),
                    "token", updatedUser.getToken(),
                    "point", updatedUser.getPoint()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred while updating additional info");
        }
    }
}