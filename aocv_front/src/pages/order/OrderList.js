import React, { useEffect } from 'react';
import '../../scss/pages/order/OrderList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../apis/orderApi';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);
  const itemDTO = useSelector((state) => state.item.itemDTO);
  const { loginUser } = useSelector((state) => state.user);
  
  useEffect(() => {
    dispatch(fetchOrders(loginUser));
  }, [dispatch, loginUser]);

  const allOrdersCancelled = orders && orders.length > 0 && orders.every(order => order.status === 'CANCELLED');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    }
    return '';
  };

  const statusMap = {
    PAID: '결제완료',
    SHIPPING: '배송중',
    DELIVERED: '배송 완료',
    CANCELLED: '주문 취소',
    COMPLETED: '구매 확정',
  };

  const handleImageClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleOrderDetailClick = (orderId) => {
    navigate(`/user/orderdetail/${orderId}`);
  };

  const handleRefundRequest = (orderItem, order) => {
    navigate('/order/orderrefund', { state: { orderItem, order } });
  };

  const handleConfirmPurchase = (order) => {
    dispatch(updateOrderStatus(order.id, 'COMPLETED'));
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  const getItemType = (itemId) => {
    const itemsArray = itemDTO.content;
    const item = itemsArray.find(item => item.id === itemId);
    return item ? item.type : null;
  };

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h1>주문 목록</h1>
      </div>
      <div className="order-summary">
        <div className="summary-item">
          <span className="summary-title">전체</span>
          <span className="summary-count">{orders.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-title">결제완료</span>
          <span className="summary-count">{orders.filter(order => order.status === 'PAID').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-title">배송중</span>
          <span className="summary-count">{orders.filter(order => order.status === 'SHIPPING').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-title">배송완료</span>
          <span className="summary-count">{orders.filter(order => order.status === 'DELIVERED').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-title">구매확정</span>
          <span className="summary-count">{orders.filter(order => order.status === 'COMPLETED').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-title">주문취소</span>
          <span className="summary-count">{orders.filter(order => order.status === 'CANCELLED').length}</span>
        </div>
      </div>
      {orders.length === 0 || allOrdersCancelled ? (
        <div className="no-orders">
          <img src={process.env.PUBLIC_URL + '/assets/icons/noorder.png'} alt="No Orders" className="no-orders-image" />
          <span>구매내역이 없습니다.</span>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="order-item-header">
              <span className="order-date">{formatDate(order.orderDate)}</span>
              <span className="order-status">{statusMap[order.status]}</span>
            </div>
            {order.orderItems.map((item, index) => {
              const itemName = itemDTO.content.find(dto => dto.id === item.itemId)?.name || '상품명 불러오기 실패';
              const itemType = getItemType(item.itemId); // 아이템 타입 가져오기
              return (
                <div key={index} className="order-item-details">
                  <img
                    src={item.productImages[0]}
                    alt={itemName}
                    className="order-item-image"
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
                    <span className="orderItemOption" style={{ display: 'block' }}>가격: {item.price ? item.price.toLocaleString() : 0}원</span>
                  </div>
                  <div className="order-item-actions">
                    {(order.status === 'PAID' || order.status === 'SHIPPING') && (
                      <button className="action-button" onClick={() => handleRefundRequest(item, order)}>환불 요청</button>
                    )}
                    {order.status === 'DELIVERED' && (
                      <button className="action-button" onClick={() => handleConfirmPurchase(order)}>구매 확정</button>
                    )}
                    <button className="action-button" onClick={() => handleOrderDetailClick(order.id)}>주문 상세</button>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;