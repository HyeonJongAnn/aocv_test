package com.example.aocv_back.service.user;

import com.example.aocv_back.entity.user.User;

import java.util.Map;

public interface GoogleService {
    String googleLogin(String code);
    String getGoogleAccessToken(String code);
    Map<String, Object> getGoogleUserInfo(String accessToken);

    User saveOrUpdateUser(Map<String, Object> userInfo);
}
