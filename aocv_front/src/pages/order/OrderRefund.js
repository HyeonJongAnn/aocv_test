import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../scss/pages/order/OrderRefund.scss';
import { createRefundRequest, fetchAddress } from '../../apis/orderApi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OrderRefund = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { orderItem, order } = location.state || {};
  const [shippingCost, setShippingCost] = useState(3000);
  const [sellerReason, setSellerReason] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [address, setAddress] = useState(null);
  const itemDTO = useSelector((state) => state.item.itemDTO || { content: [] });
  
  useEffect(() => {
    if (order && order.addressId) {
      dispatch(fetchAddress(order.addressId)).then((response) => {
        if (response.payload) {
          setAddress(response.payload);
        }
      });
    }
  }, [dispatch, order]);

  useEffect(() => {
    if (address && address.postalCode && order) {
      const pureProductPrice = calculatePureProductPrice(order.orderItems);
      calculateShippingCost(address.postalCode, pureProductPrice);
    }
  }, [address, order]);

  const calculatePureProductPrice = (orderItems) => {
    return orderItems.reduce((total, item) => {
      const itemPrice = itemDTO.content.find(dto => dto.id === item.itemId)?.price || item.price;
      const sale = itemDTO.content.find(dto => dto.id === item.itemId)?.sale || 0;
      const discountedPrice = itemPrice * (1 - sale / 100);
      const additionalOptionsPrice = calculateAdditionalOptionsPrice([item], itemDTO);
      return total + (discountedPrice + additionalOptionsPrice) * item.quantity;
    }, 0);
  };
  const API_URL = process.env.REACT_APP_API_URL;
  
  const calculateShippingCost = async (postalCode, price) => {
    if (price >= 100000) {
      setShippingCost(0);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/order/shippingcost?postalCode=${postalCode}&price=${price}`);
      setShippingCost(response.data);
    } catch (error) {
      console.error('Error calculating shipping cost', error);
    }
  };

  const calculateAdditionalOptionsPrice = useMemo(() => (orderItems = [], itemDTO) => {
    if (!orderItems || orderItems.length === 0) {
      return 0;
    }

    return orderItems.reduce((total, item) => {
      const itemDTOContent = itemDTO.content.find(dto => dto.id === item.itemId);
      if (!itemDTOContent) {
        return total;
      }

      const optionId = item.optionId;
      const option = itemDTOContent.options.find(opt => opt.id === optionId);

      if (option) {
        return total + (option.optionPrice || 0);
      } else {
        return total;
      }
    }, 0);
  }, [orderItem, itemDTO]);

  const additionalOptionsPrice = calculateAdditionalOptionsPrice([orderItem], itemDTO);

  if (!orderItem || !order) {
    return <div>주문 항목을 찾을 수 없습니다.</div>;
  }


  if (!orderItem || !order) {
    return <div>주문 항목을 찾을 수 없습니다.</div>;
  }

  const selectedItem = itemDTO.content.find(dto => dto.id === orderItem.itemId);
  const itemPrice = selectedItem ? selectedItem.price : orderItem.price;
  const sale = selectedItem ? selectedItem.sale : 0;
  const discountedPrice = itemPrice * (1 - sale / 100);

  const handleSellerReasonChange = (e) => {
    setSellerReason(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reason = sellerReason;
    if (!reason) {
      alert('환불 사유를 선택해주세요.');
      return;
    }

    const refundRequest = {
      orderId: order.id,
      userId: order.userId,
      refundReason: reason,
      refundAmount: discountedPrice + calculateAdditionalOptionsPrice([orderItem], itemDTO) + shippingCost,
    };

    try {
      await dispatch(createRefundRequest(refundRequest)).unwrap();
      alert('환불 요청이 성공적으로 제출되었습니다.');
      navigate('/user/order-list');
    } catch (error) {
      console.error('환불 요청 실패:', error);
      alert('환불 요청 중 오류가 발생했습니다.');
    }
  };

  const getItemType = (itemId) => {
    const itemsArray = itemDTO.content;
    const item = itemsArray.find(item => item.id === itemId);
    return item ? item.type : null;
  };

  const renderOptions = (optionId) => {
    // `itemDTO`에서 `optionId`를 기반으로 옵션을 찾습니다.
    const option = itemDTO.content
      .flatMap(item => item.options)
      .find(opt => opt.id === optionId);

    if (!option) return null;

    // 옵션의 속성을 키-값 쌍으로 분리합니다.
    const optionEntries = Object.entries(option.optionAttributes);
    const optionPairs = [];

    // 속성을 두 개씩 묶어서 한 줄로 표시하기 위한 배열 생성
    for (let i = 0; i < optionEntries.length; i += 2) {
      optionPairs.push([optionEntries[i], optionEntries[i + 1] || null]);
    }

    return optionPairs.map(([opt1, opt2], index) => {
      const opt1Price = opt1[0].includes("옵션") ? option.optionPrice || 0 : 0;
      const opt2Price = opt2 && opt2[0].includes("옵션") ? option.optionPrice || 0 : 0;

      return (
        <div key={index} className="orderItemOption">
          <span>{opt1[0]}: {opt1[1]}</span>
          {opt1Price > 0 && <span> (+{formatCurrency(opt1Price)}원)</span>}
          {opt2 && (
            <>
              <span> | {opt2[0]}: {opt2[1]}</span>
              {opt2Price > 0 && <span> (+{formatCurrency(opt2Price)}원)</span>}
            </>
          )}
        </div>
      );
    });
  };

  const handleImageClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='orderRefundContainer'>
      <h1>환불 요청</h1>
      <div className='productInfo'>
        <img
          src={orderItem.productImages[0]}
          alt={orderItem.itemName}
          className="refundItem-image"
          onClick={() => handleImageClick(orderItem.itemId)}
        />
        <div className="refundItem-info">
          <h2 className="refundItem-name">{order.orderName}</h2>
          {getItemType(orderItem.itemId) === 'TSHIRT' && orderItem.petName ? (
            <span className="orderItemOption" style={{ display: 'block' }}>반려동물: {orderItem.petName} | 수량: {orderItem.quantity}개</span>
          ) : (
            <span className="orderItemOption" style={{ display: 'block' }}>수량: {orderItem.quantity}개</span>
          )}
          {orderItem.optionId && renderOptions(orderItem.optionId)}
          <span className="refundItem-price">{(discountedPrice + calculateAdditionalOptionsPrice(orderItem.options)).toLocaleString()}원</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='refundSection'>
          <label className='reasonText'>판매자 책임 사유</label>
          <select
            className='reasonBox'
            id='sellerReason'
            value={sellerReason}
            onChange={handleSellerReasonChange}
          >
            <option value="" disabled>취소 사유를 선택하세요.</option>
            <option value="상품 불량">상품 불량</option>
            <option value="상품과 다른 상품이 배송됨">상품과 다른 상품이 배송됨</option>
            <option value="주문과 다른 색상/사이즈 배송됨">주문과 다른 색상/사이즈 배송됨</option>
            <option value="주문과 다른 디자인 배송됨">주문과 다른 디자인 배송됨</option>
            <option value="배송사고 및 누락">배송사고 및 누락</option>
            <option value="주문과 출고일 다름">주문과 출고일 다름</option>
          </select>
        </div>
        <div className='refundprice-container'>
          <span className="refundAmount">환불 금액</span><span className='refundPrice'>{(discountedPrice + additionalOptionsPrice + shippingCost - order.usedPoints).toLocaleString()}원</span>
          <img
            src={process.env.PUBLIC_URL + (isExpanded ? '/assets/icons/up_arrow.png' : '/assets/icons/down_arrow.png')}
            alt='화살표'
            className='expand-arrow2'
            onClick={toggleExpand}
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
        {isExpanded && (
          <div className="detailExpanded-info">
            <div className="price-detail">
              <span className="detail-title">상품금액:</span>
              <span className="detail-value">{discountedPrice.toLocaleString()}원</span>
            </div>
            <div className="price-detail">
              <span className="detail-title">추가금액:</span>
              <span className="detail-value">{additionalOptionsPrice.toLocaleString()}원</span>
            </div>
            <div className="price-detail">
              <span className="detail-title">적립금 사용:</span>
              <span className="detail-value">- {order.usedPoints.toLocaleString()}원</span>
            </div>
            <div className="price-detail">
              <span className="detail-title">배송비:</span>
              <span className="detail-value">{shippingCost.toLocaleString()}원</span>
            </div>
          </div>
        )}
        <button type='submit' className='submitBtn'>신청하기</button>
      </form>
    </div>
  );
};

export default OrderRefund;