import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input';
import Button from '../../components/button/Button';
import '../../scss/pages/order/TrackingForm.scss';

const statusDescriptions = {
  UNKNOWN: '상태를 알 수 없음',
  INFORMATION_RECEIVED: '배송 정보 수신됨',
  AT_PICKUP: '픽업 위치에 있음',
  IN_TRANSIT: '배송 중',
  OUT_FOR_DELIVERY: '배송 출발',
  ATTEMPT_FAIL: '배송 실패',
  DELIVERED: '배송 완료',
  AVAILABLE_FOR_PICKUP: '픽업 가능',
  EXCEPTION: '배송 예외 발생',
};

const getStatusDescription = (code) => statusDescriptions[code] || '상태를 알 수 없음';

const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    const options = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

const EventList = ({ events }) => (
  <div className="eventList">
    <ul>
      {events.map((event, index) => (
        <li key={index} className="eventItem">
          <div className="eventTime">{formatDate(event.time)}</div>
          <div className="eventLocation">{event.location.name}</div>
          <div className="eventStatus">{getStatusDescription(event.status.code)}</div>
          <div className="eventDescription">{event.description}</div>
        </li>
      ))}
    </ul>
  </div>
);

const TrackingForm = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/shipments/${trackingNumber}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
        },
      });
      setShipment(response.data);
      setStatus('succeeded');
    } catch (error) {
      setError(error.response ? error.response.data : 'Network Error');
      setStatus('failed');
    }
  };

  return (
    <div className='shipmentContainer'>
      <form className='shipmentCheckForm' onSubmit={handleSubmit}>
        <div className='shipmentCheckBox'>
          <Input
            id="trackingNumber"
            placeholder="운송장 번호를 입력하세요"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            label="운송장 번호"
            className="trackingInput"
          />
          <Button 
            type="submit"
            text="조회"
            color="green"
            className="trackingButton"
          />
        </div>
      </form>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && shipment && (
          <div className='lastShipmentCheckContainer'>
          {shipment.lastEvent && (
            <div className="lastEvent">
              <div className="lastEventHeader">
                <h3>배송 현황</h3>
                <span className="eventStatus">{getStatusDescription(shipment.lastEvent.status.code)}</span>
              </div>
              <div className="lastEventDetails">
                <p>{formatDate(shipment.lastEvent.time)}</p>
                <p>{shipment.lastEvent.description}</p>
                <p>{shipment.lastEvent.location.name}</p>
              </div>
            </div>
          )}
          {shipment.events && <EventList events={shipment.events} />}
        </div>
      )}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default TrackingForm;