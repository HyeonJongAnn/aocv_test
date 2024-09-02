import React from 'react';
import useDaumPostcodePopup from './useDaumPostcodePopup';
import '../../scss/pages/user/SignUp.scss';
import Button from '../../components/button/Button';

const DaumPost = (props) => {
  const open = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = ''; // 추가될 주소
    let localAddress = data.sido + ' ' + data.sigungu; // 지역주소(시, 도 + 시, 군, 구)
    let postalCode = data.zonecode; // 우편번호

    if (data.addressType === 'R') { // 주소타입이 도로명주소일 경우
      if (data.bname !== '') {
        extraAddress += data.bname; // 법정동, 법정리
      }
      if (data.buildingName !== '') { // 건물명
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      // 지역주소 제외 전체주소 치환
      fullAddress = fullAddress.replace(localAddress, '');
      // 조건 판단 완료 후 지역 주소 및 상세주소 state 수정
      props.setAddressObj({
        postalCode: postalCode, // 우편번호 추가
        areaAddress: `(${postalCode}) ${localAddress}`,
        townAddress: fullAddress += (extraAddress !== '' ? `(${extraAddress})` : '')
      });
    } else {
      // 도로명주소가 아닌 경우도 처리
      props.setAddressObj({
        postalCode: postalCode, // 우편번호 추가
        areaAddress: `(${postalCode}) ${localAddress}`,
        townAddress: fullAddress
      });
    }
  };

  const handleClick = () => {
    // 주소검색이 완료되고, 결과 주소를 클릭 시 해당 함수 수행
    open({ onComplete: handleComplete });
  };

  return <>
    <div className='addressJoinBox'  style={props.style}>
      <Button className='Button'
        type="button"
        text={"주소찾기"}
        color={"gray"}
        onClick={handleClick}></Button>
    </div>
  </>
};

export default DaumPost;