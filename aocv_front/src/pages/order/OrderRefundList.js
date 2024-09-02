import React, { useEffect } from 'react';
import '../../scss/pages/order/OrderRefundList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRefundRequests, fetchOrders } from '../../apis/orderApi';
import { useNavigate } from 'react-router-dom';
import { clearState } from '../../slices/userSlice';
import { resetOrderState } from '../../slices/OrderSlice';

const OrderRefundList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refundRequests, orders, loading, error } = useSelector((state) => state.order);
  const itemDTO = useSelector((state) => state.item.itemDTO);
  const { isLogin, loginUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLogin) {
      dispatch(clearState());
      dispatch(resetOrderState());
    } else {
      dispatch(fetchRefundRequests(loginUser));
      dispatch(fetchOrders(loginUser));
    }
  }, [dispatch, isLogin, loginUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    }
    return '';
  };

  const getOrderDetails = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    if (!order) {
      return null;
    }
    return order;
  };

  const getItemType = (itemId) => {
    const item = itemDTO.content.find(dto => dto.id === itemId);
    return item ? item.type : null;
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


  return (
    <div className="refund-exchange-list-container">
      <div className="refund-exchange-list-header">
        <h1 className="refundMainText">환불 조회</h1>
      </div>
      <div className="refund-exchange-summary">
        <div className="summary-item">
          <span className="summary-title">전체</span>
          <span className="summary-count">{refundRequests.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-title">환불 요청</span>
          <span className="summary-count">{refundRequests.filter(request => request.status === 'PENDING').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-title">환불 완료</span>
          <span className="summary-count">{refundRequests.filter(request => request.status === 'COMPLETED').length}</span>
        </div>
      </div>
      {refundRequests.length === 0 ? (
        <div className="no-requests">
          <img src={process.env.PUBLIC_URL + '/assets/icons/noorder.png'} alt="No Requests" className="no-requests-image" />
          <span>환불내역이 없습니다.</span>
        </div>
      ) : (
        refundRequests.map((request) => {
          const orderDetails = getOrderDetails(request.orderId);
          if (!orderDetails) return null;

          return orderDetails.orderItems.map((orderItem) => {
            const itemDetails = itemDTO.content.find(dto => dto.id === orderItem.itemId);
            if (!itemDetails) return null;

            const usedPoints = orderDetails.usedPoints || 0;
            const refundAmountAfterPoints = request.refundAmount - usedPoints;

            const itemType = getItemType(orderItem.itemId);

            return (
              <div key={orderItem.id} className="request-item">
                <div className="request-item-header">
                  <span className="request-date">{formatDate(request.requestDate)}</span>
                  <span className="request-status">{request.status === 'PENDING' ? '환불 요청' : request.status}</span>
                </div>
                <div className="request-item-details">
                  <img
                    src={orderItem.productImages[0]}
                    alt={itemDetails.name}
                    className="request-item-image"
                  />
                  <div className="request-item-info">
                    <h2 className="request-item-name">{itemDetails.name}</h2>
                    {itemType === 'TSHIRT' && orderItem.petName ? (
                      <span className="orderItemOption" style={{ display: 'block' }}>반려동물: {orderItem.petName} | 수량: {orderItem.quantity}개</span>
                    ) : (
                      <span className="orderItemOption" style={{ display: 'block' }}>수량: {orderItem.quantity}개</span>
                    )}
                     {orderItem.optionId && renderOptions(orderItem.optionId)}
                    <span className="request-amount">금액: {refundAmountAfterPoints.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          });
        })
      )}
    </div>
  );
};

export default OrderRefundList;