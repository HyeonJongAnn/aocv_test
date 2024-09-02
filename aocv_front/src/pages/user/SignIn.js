import React, { useCallback, useEffect, useState } from 'react';
import Input from '../../components/Input.js';
import FullWidthButton from '../../components/button/FullWidthButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../../scss/pages/user/SignIn.scss'
import { signin } from '../../apis/userApi.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
    const test = "test";
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_REST_API_KEY}&state=${test}&redirect_uri=${process.env.REACT_APP_NAVER_REDIRECT_URI}`;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
   
    const handleKakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    const handleNaverLogin = () => {
        window.location.href = NAVER_AUTH_URL;
    };

    const navi = useNavigate();
    const location = useLocation();
    const fromPath = location.state?.from?.pathname || '/';
    const dispatch = useDispatch();

    const [autoLogin, setAutoLogin] = useState(false);

    const handleLogoClick = () => {
        navi('/');
    };

    const [form, setForm] = useState({
        userId: '',
        userPw: ''
    });

    const inputFieldChanged = useCallback((e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    }, []);

    const handleSignIn = useCallback(
        (e) => {
            e.preventDefault();
            dispatch(signin({ userId: form.userId, userPw: form.userPw }))
                .then(() => {
                    navi(fromPath, { replace: true });
                })
                .catch((error) => {
                    console.error('Login failed:', error);
                });
        },
        [form, dispatch, fromPath]
    );

    return (
        <div className="sign_in_container">
            <form id="form-signin" onSubmit={handleSignIn}>
                <div className="logoBox">
                    <img
                        src={process.env.PUBLIC_URL + '/assets/icons/logo.webp'}
                        className='logo'
                        onClick={handleLogoClick} />
                </div>

                <div className='inputContaniner'>
                    <div className='inputBox1'>
                        <div className="idBox">
                            <p className='idBoxText'>아이디</p>
                        </div>
                        <div className='idInputBox'>
                            <Input
                                type="text"
                                name="userId"
                                placeholder="아이디를 입력해주세요."
                                value={form.userId}
                                onChange={inputFieldChanged}
                            />
                        </div>
                    </div>

                    <div className='inputBox2'>
                        <div className="pwBox">
                            <p className='pwBoxText'>비밀번호</p>
                        </div>
                        <div className='pwInputBox'>
                            <Input
                                type="password"
                                name="userPw"
                                placeholder="비밀번호를 입력해주세요."
                                value={form.userPw}
                                onChange={inputFieldChanged}
                            />
                        </div>
                    </div>
                </div>

                <div className="joinFindBox">
                    <div className='joinBox'>
                        <a href='/user/sign-up'>회원가입</a>
                    </div>
                    <div className='idFindBox'>
                        <a href='/user/find-id'>아이디 찾기</a>
                    </div>
                    <div className='pwFindBox'>
                        <a href='/user/find-pw'>비밀번호 찾기</a>
                    </div>
                </div>

                <FullWidthButton color="gray" text="로그인" type="submit" />


                <div className='lineContainer'>
                    <div className='comfortLoginLine'></div>
                    <p className='text'>간편 로그인</p>
                    <div className='comfortLoginLine'></div>
                </div>
                <div className='comfortLoginContainer'>
                    <div className='kakaoLoginBox'>
                        <img
                            className="kakaoLogin"
                            src={process.env.PUBLIC_URL + '/assets/icons/kakao_login(원형).png'}
                            onClick={handleKakaoLogin}
                        />
                    </div>
                    <div className='googleLoginBox'>
                        <img className="googleLogin" src={process.env.PUBLIC_URL + '/assets/icons/google_login(원형).png'}
                            onClick={handleGoogleLogin}
                        />
                    </div>
                    <div className='naverLoginBox'>
                        <img className="naverLogin" src={process.env.PUBLIC_URL + '/assets/icons/naver_login(원형).png'}
                            onClick={handleNaverLogin} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SignIn;