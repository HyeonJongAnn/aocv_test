import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/button/Button';
import '../../scss/pages/order/TossPaymentsFail.scss';

const TossPaymentsFail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { error } = location.state || {};

    const handleRetryPayment = () => {
        navigate(-1); 
    };

    return (
        <div className="toss-payments-fail-container">
            <h1>결제에 실패했습니다</h1>
            {error && <p>{error}</p>}
            <div className="order-actions">
                <Button text="다시 결제하기" className="retry-button" onClick={handleRetryPayment}/>
            </div>
        </div>
    );
};

export default TossPaymentsFail;