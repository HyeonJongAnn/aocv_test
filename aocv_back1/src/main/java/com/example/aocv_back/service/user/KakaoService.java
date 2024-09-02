package com.example.aocv_back.service.user;

import java.util.Map;

public interface KakaoService {

    String kakaoLogin(String code);
    String getKakaoAccessToken(String code);
    Map<String, Object> getKakaoUserInfo(String accessToken);
}