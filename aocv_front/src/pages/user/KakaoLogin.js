import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../slices/userSlice';

function KakaoLogin() {
    const location = useLocation();
    const navigate = useNavigate();
    const API_URL = "http://localhost:9090";
    const dispatch = useDispatch();

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            // 백엔드로 코드 전송
            axios.post(`${API_URL}/user/auth/kakao`, {
                grant_type: 'authorization_code',
                client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
                redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
                code: code,
                client_secret: process.env.REACT_APP_KAKAO_CLIENT_SECRET
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    console.log('Kakao login successful:', response.data);
                
                    // 예시: 백엔드에서 userId, userName 등의 필드를 어떤 이름으로 제공하는지 확인
                    const { id, userId, userName, userTel, userAddress, point } = response.data;
                
                    // sessionStorage에 토큰 저장
                    const token = response.data.token;
                    if (token) {
                        sessionStorage.setItem('ACCESS_TOKEN', token);
                        dispatch(loginSuccess({ id, userId, userName, userTel, userAddress, point }));
                    } else {
                        console.error('Token not found in response');
                    }
                    navigate('/');
                })
                .catch(error => {
                    console.error('Kakao login failed:', error);
                    // 에러 처리 (예: 로그인 페이지로 리다이렉트)
                    navigate('/user/sign-in');
                });
            }
        }, [location, navigate, dispatch]);

    return <div>카카오 로그인 처리중...</div>;
}

export default KakaoLogin;