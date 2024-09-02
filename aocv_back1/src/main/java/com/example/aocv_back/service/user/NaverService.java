package com.example.aocv_back.service.user;

import java.util.Map;

public interface NaverService {
    String naverLogin(String code, String state);
    String getNaverAccessToken(String code, String state);
    Map<String, Object> getNaverUserInfo(String accessToken);
}
