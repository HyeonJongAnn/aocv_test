import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TossPaymentsSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const confirmPayment = async () => {
            console.log(paymentKey, orderId, amount);
            console.log(orderInfo);
            try {
                await axios.post(`${API_URL}/payments/confirm`, {
                    paymentKey,
                    orderId,
                    amount,
                    orderInfo,
                });
                navigate('/order-success', { state: { orderId, orderInfo } });
            } catch (error) {
                console.error('Payment confirmation failed:', error);
                navigate('/fail', { state: { error: error.message } });
            }
        };

        confirmPayment();
    }, [paymentKey, orderId, amount, navigate, orderInfo ]);

    return <div>결제가 성공적으로 완료되었습니다. 잠시만 기다려주세요...</div>;
};

export default TossPaymentsSuccess;