import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../scss/pages/order/OrderDetail.scss';
import Button from '../../components/button/Button';
import { fetchAddress } from '../../apis/orderApi';
import axios from 'axios';

const OrderDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = useState({});
  const [isShippingInfoExpanded, setIsShippingInfoExpanded] = useState(false);
  const [isPaymentInfoExpanded, setIsPaymentInfoExpanded] = useState(false);
  const [shippingCost, setShippingCost] = useState(3000);
  const { address, loading, error } = useSelector((state) => state.order);
  const itemDTO = useSelector((state) => state.item.itemDTO);
  const location = useLocation();
  const { orders: locationOrders } = location.state || {};
  const { orders: reduxOrders } = useSelector((state) => state.order);
  const orders = locationOrders || reduxOrders;
  const orderId = useParams().orderId;
  const orderInfo = orders.find(order => order.id.toString() === orderId);
  console.log(itemDTO)
  console.log(orderInfo)
  useEffect(() => {
    if (orderInfo && orderInfo.addressId) {
      dispatch(fetchAddress(orderInfo.addressId));
    }
  }, [dispatch, orderInfo]);

  useEffect(() => {
    if (address && address.postalCode && orderInfo) {
      const pureProductPrice = calculatePureProductPrice(orderInfo.orderItems);
      calculateShippingCost(address.postalCode, pureProductPrice);
    }
  }, [address, orderInfo]);

  const calculatePureProductPrice = (orderItems) => {
    return orderItems.reduce((total, item) => {
      const itemPrice = itemDTO.content.find(dto => dto.id === item.itemId)?.price || item.price;
      const sale = itemDTO.content.find(dto => dto.id === item.itemId)?.sale || 0;
      const discountedPrice = itemPrice * (1 - sale / 100);
      return total + (discountedPrice) * item.quantity;
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

  const getItemType = (itemId) => {
    const itemsArray = itemDTO.content;
    const item = itemsArray.find(item => item.id === itemId);
    return item ? item.type : null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orderInfo) return <div>주문 정보를 불러오는 중 문제가 발생했습니다.</div>;

  const handleImageClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const statusMap = {
    PAID: '결제완료',
    SHIPPING: '배송중',
    DELIVERED: '배송 완료',
    CANCELLED: '주문 취소'
  };

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length >= 5) {
      const [year, month, day, hour] = dateArray;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`;
    }
    return '';
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

 
  const calculateAdditionalOptionsPrice = (orderItems = [], itemDTO) => {
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
        console.log(`No option found with ID ${optionId} in item ${item.itemId}`);
        return total;
      }
    }, 0);
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

  return (
    <div className="orderDetailContainer">
      <h1>주문 상세 내역</h1>
      <div className="orderDetailSummary">
        <div className="orderHeader">
          <span className="order-number">No.{orderInfo.orderNumber.replace('orderId-', '')}</span>
          <span className="order-date">{formatDate(orderInfo.orderDate)}</span>
        </div>
        <div className="orderItems">
          {orderInfo.orderItems.map((item, index) => {
            const itemName = itemDTO.content.find(dto => dto.id === item.itemId)?.name || '상품명 불러오기 실패';
            const itemPrice = itemDTO.content.find(dto => dto.id === item.itemId)?.price || item.price;
            const sale = itemDTO.content.find(dto => dto.id === item.itemId)?.sale || 0;
            const discountedPrice = itemPrice * (1 - sale / 100);
            const additionalOptionsPrice = calculateAdditionalOptionsPrice([item], itemDTO);
            const isExpanded = expandedItems[item.itemId];
            const itemType = getItemType(item.itemId); // 아이템 타입 가져오기
            return (
              <React.Fragment key={index}>
                <div className="orderItemBox">
                  <div className="orderItem-status">{statusMap[orderInfo.status]}</div>
                  <img
                    src={item.productImages[0]}
                    alt={itemName}
                    className="orderItemImage"
                    onClick={() => handleImageClick(item.itemId)}
                  />
                  <div className="order-item-info">
                    <span className="item-name">{itemName}</span>
                    {itemType === 'TSHIRT' && item.petName ? (
                      <span className="orderItemOption" style={{ display: 'block' }}>반려동물: {item.petName} | 수량: {item.quantity}개</span>
                    ) : (
                      <span className="orderItemOption" style={{ display: 'block' }}>수량: {item.quantity}개</span>
                    )}
                   {item.optionId && renderOptions(item.optionId)}
                    <span className="item-price">주문금액(상세)</span>
                  </div>
                  <div className="item-allPriceContainer">
                    <span className="item-allPrice">{orderInfo.totalAmount.toLocaleString()}원</span>
                    <img
                      src={process.env.PUBLIC_URL + (isExpanded ? '/assets/icons/up_arrow.png' : '/assets/icons/down_arrow.png')}
                      alt='화살표'
                      className='expand-arrow'
                      onClick={() => toggleExpand(item.itemId)}
                      style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(0deg)' }}
                    />
                  </div>
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
                      <span className="detail-value">- {orderInfo.usedPoints.toLocaleString()}원</span>
                    </div>
                    <div className="price-detail">
                      <span className="detail-title">배송비:</span>
                      <span className="detail-value">{shippingCost.toLocaleString()}원</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <div className="order-actions">
            <Button className="action-button" text="배송 조회" onClick={() => {/* 배송 조회 기능 */}} />
            <Button className="action-button" text="후기 작성" onClick={() => {/* 후기 작성 기능 */}} />
          </div>
        </div>
        <div className="shippingInfo">
          <div className="info-header" onClick={() => setIsShippingInfoExpanded(!isShippingInfoExpanded)}>
            배송지 정보
            <img
              src={process.env.PUBLIC_URL + (isShippingInfoExpanded ? '/assets/icons/up_arrow.png' : '/assets/icons/down_arrow.png')}
              alt='화살표'
              className='expand-arrow'
              style={{ transform: isShippingInfoExpanded ? 'rotate(0deg)' : 'rotate(0deg)' }}
            />
          </div>
          {isShippingInfoExpanded && (
            <div className="shipping-details">
              <p>받으시는 분:<span>{address.recipientName}</span></p>
              <p>연락처:<span>{address.phoneNumber}</span></p>
              <p>배송지: <span>({address.postalCode}) {address.addressLine1} {address.addressLine2}</span></p>
              <p>배송 메시지:<span>{address.requestNote}</span></p>
            </div>
          )}
        </div>
        <div className="paymentInfo">
          <div className="info-header" onClick={() => setIsPaymentInfoExpanded(!isPaymentInfoExpanded)}>
            결제 수단
            <img
              src={process.env.PUBLIC_URL + (isPaymentInfoExpanded ? '/assets/icons/up_arrow.png' : '/assets/icons/down_arrow.png')}
              alt='화살표'
              className='expand-arrow'
              style={{ transform: isPaymentInfoExpanded ? 'rotate(0deg)' : 'rotate(0deg)' }}
            />
          </div>
          {isPaymentInfoExpanded && (
            <div className="payment-details">
              <p>결제 방법: {orderInfo.paymentMethod}</p>
            </div>
          )}
        </div>
        <Button className="backbutton" text="뒤로 가기" onClick={() => navigate(-1)} />
      </div>
    </div>
  );
};

export default OrderDetail;