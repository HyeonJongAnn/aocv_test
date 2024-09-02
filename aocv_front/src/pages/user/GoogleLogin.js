import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../slices/userSlice';
import AdditionalInfoModal from '../../components/AdditionalInfoModal';


function GoogleLogin() {
    const location = useLocation();
    const navigate = useNavigate();
    const API_URL = "http://localhost:9090";
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [additionalInfo, setAdditionalInfo] = useState({
        phoneNumber: '',
        birthdate: '',
        gender: '',
        basicAddress: '',
        detailedAddress: ''
    });

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            axios.post(`${API_URL}/user/auth/google`, {
                code: code,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    const { id, userId, userName, userTel, userAddress, token, point } = response.data;

                    if (!userTel || !userAddress) {
                        // 새로운 사용자이므로 추가 정보 입력 필요
                        setUserInfo(response.data);
                        setShowModal(true);
                    } else {
                        // 기존 회원이므로 바로 로그인 처리
                        sessionStorage.setItem('ACCESS_TOKEN', token);
                        dispatch(loginSuccess({ id, userId, userName, userTel, userAddress, point }));
                        navigate('/');
                    }
                })
                .catch(error => {
                    console.error('Google login failed:', error);
                    navigate('/user/sign-in');
                });
        }
    }, [location, navigate, dispatch]);

    const handleSaveAdditionalInfo = () => {
        const updatedUserInfo = { ...userInfo, ...additionalInfo };
        axios.post(`${API_URL}/user/auth/google/additional-info`, updatedUserInfo)
            .then(response => {
                console.log(response.data)
                const {id, userId, userName, userTel, userAddress, token, point } = response.data;
                sessionStorage.setItem('ACCESS_TOKEN', token);
                dispatch(loginSuccess({id, userId, userName, userTel, userAddress, point }));
                setShowModal(false);
                navigate('/');
            })
            .catch(error => {
                console.error('Failed to save additional info:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                }
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdditionalInfo({
            ...additionalInfo,
            [name]: value
        });
    };

    return (
        <div>
            구글 로그인 처리중...
            {showModal && (
                <AdditionalInfoModal
                    additionalInfo={additionalInfo}
                    handleChange={handleChange}
                    handleSave={handleSaveAdditionalInfo}
                />
            )}
        </div>
    );
}

export default GoogleLogin;