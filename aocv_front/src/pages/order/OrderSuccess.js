import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../scss/pages/order/OrderSuccess.scss';
import Button from '../../components/button/Button';
import { resetOrderState } from '../../slices/OrderSlice';
import { fetchOrders } from '../../apis/orderApi';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { orderInfo } = location.state || {};
    const itemDTO = useSelector((state) => state.item.itemDTO);
    const [isExpanded, setIsExpanded] = useState(false);
    const [images, setImages] = useState({});
  const { loginUser } = useSelector((state) => state.user);
  const { orders, loading } = useSelector((state) => state.order);

  console.log(orderInfo)
  useEffect(() => {
    dispatch(fetchOrders(loginUser));
  }, [dispatch, loginUser]);

    useEffect(() => {
        if (orderInfo && orderInfo.orderItems && orderInfo.orderItems.length > 0) {
            const fetchImages = () => {
                const imageMap = {};
                orderInfo.orderItems.forEach(item => {
                    const productImage = itemDTO.content.find(dto => dto.id === item.itemId)?.productImages[0];
                    imageMap[item.itemId] = productImage;
                });
                setImages(imageMap);
            };
            fetchImages();
        }
        return () => {
            dispatch(resetOrderState());
        };
    }, [dispatch, orderInfo, itemDTO]);

    const handleGoHome = () => {
        navigate('/');
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const getItemType = (itemId) => {
        const itemsArray = itemDTO.content;
        const item = itemsArray.find(item => item.id === itemId);
        return item ? item.type : null;
    };

    const renderOptions = (optionId) => {
        const option = itemDTO.content
            .flatMap(item => item.options)
            .find(opt => opt.id === optionId);
    
        if (!option) return null;
    
        const optionEntries = Object.entries(option.optionAttributes);
        const optionPairs = [];
    
        // 옵션을 두 개씩 묶어서 한 줄로 표시하기 위한 배열 생성
        for (let i = 0; i < optionEntries.length; i += 2) {
            optionPairs.push([optionEntries[i], optionEntries[i + 1] || null]);
        }
    
        return (
            <div className="orderItemOption">
                {optionPairs.map(([opt1, opt2], index) => (
                    <div key={`${index}-${opt1[0]}`} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <span>{opt1[0]}: {opt1[1]}</span>
                        {opt1[0].includes("옵션") && option.optionPrice > 0 && (
                            <span> (+{formatCurrency(option.optionPrice)}원)</span>
                        )}
                        {opt2 && (
                            <>
                                <span> | {opt2[0]}: {opt2[1]}</span>
                                {opt2[0].includes("옵션") && option.optionPrice > 0 && (
                                    <span> (+{formatCurrency(option.optionPrice)}원)</span>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const handleImageClick = (itemId) => {
        navigate(`/item/${itemId}`);
    };

    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleViewOrderDetail = () => {
        const orderId = orders.find(order => order.orderNumber === orderInfo.orderNumber)?.id;
        console.log(orders)
        if (orderId) {
            navigate(`/user/orderdetail/${orderId}`, { state: { orders } });
        } else {
            console.error("Order ID (orderSeq) is missing or not found.");
        }
    };

    return (
        <div className="order-success-container">
            <div className="orderinfo-container">
                <h1>주문이 완료되었습니다.</h1>
                <div className="order-info">
                    <div className='recipientBox'>
                        <p className='recipientName'>{orderInfo.address.recipientName}</p>
                        <span className='recipientTel'>{orderInfo.address.phoneNumber}</span>
                    </div>
                    <div className='recipientAddressBox'>
                        <p className='recipientAddress'>{orderInfo.address.addressLine1} {orderInfo.address.addressLine2}</p>
                    </div>
                    <div className='recipientItemNameBox'>
                        <p className='recipientItemName'>
                            <strong className='itemNameText'>상품정보</strong> {orderInfo.orderName}
                            <img
                                src={process.env.PUBLIC_URL + (isExpanded ? '/assets/icons/up_arrow.png' : '/assets/icons/down_arrow.png')}
                                alt='화살표'
                                className='expand-arrow'
                                onClick={toggleExpand}
                                style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(0deg)' }}
                            />
                        </p>
                    </div>
                    {isExpanded && orderInfo.orderItems && (
                        <div className='expanded-info'>
                            {orderInfo.orderItems.map((item) => (
                                <div key={item.itemId} className='orderItemBox'>
                                    <img
                                        src={images[item.itemId] ? images[item.itemId] : 'default-image-url'}
                                        alt={item.itemName}
                                        className='item-image'
                                        onClick={() => handleImageClick(item.itemId)}
                                    />
                                    <div className='orderItemListBox'>
                                        {getItemType(item.itemId) === 'TSHIRT' && item.petName ? (
                                            <span className='orderItemOption' style={{ display: 'block' }}>반려동물: {item.petName} | 수량: {item.quantity}개</span>
                                        ) : (
                                            <span className='orderItemOption' style={{ display: 'block' }}>수량: {item.quantity}개</span>
                                        )}
                                        {item.optionId && renderOptions(item.optionId)}
                                        <span className='orderItemOption' style={{ display: 'block' }}>가격: {item.price ? item.price.toLocaleString() : 0}원</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='recipientItemPriceBox'>
                        <p className='recipientItemPrice'>
                            <strong className='itemPriceText'>결제금액</strong> {orderInfo.totalAmount.toLocaleString()}원
                        </p>
                    </div>
                    <div className="order-actions">
                        <Button text="주문 상세 보기" className="details-button"  onClick={handleViewOrderDetail} />
                        <Button text="다음" className="home-button" onClick={handleGoHome} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;