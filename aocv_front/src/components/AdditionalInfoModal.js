import React, { useEffect, useState } from 'react';
import JoinBox from './JoinBox';
import DaumPost from '../pages/user/DaumPost';
import '../scss/ui/AdditionalInfoModal.scss';
import FullWidthButton from './button/FullWidthButton';
import Input from './Input';

const AdditionalInfoModal = ({ additionalInfo, handleChange, handleSave }) => {
    const [addressObj, setAddressObj] = useState({
        areaAddress: '',
        townAddress: '',
    });
    const [detailedAddress, setDetailedAddress] = useState(additionalInfo.detailedAddress || '');

    const handleDetailedAddressChange = (e) => {
        setDetailedAddress(e.target.value);
        handleChange(e);
    };

    const handlePhoneNumberChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        handleChange({ target: { name, value: formattedValue } });
    };

    const handleBirthChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        handleChange({ target: { name, value: formattedValue } });
    };

    useEffect(() => {
        handleChange({ target: { name: 'basicAddress', value: `${addressObj.areaAddress} ${addressObj.townAddress}`.trim() } });
    }, [addressObj]);

    return (
        <div className="modal">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <h1>추가 정보 입력</h1>

                <JoinBox
                    name="phoneNumber"
                    titleName="전화번호"
                    placeholder="핸드폰 번호 숫자만 11자리 입력 해주세요."
                    value={additionalInfo.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    inputProps={{ maxLength: 13 }}
                />

                <JoinBox
                    name="birthdate"
                    titleName="생년월일"
                    placeholder="생년월일 숫자만 8자리 입력 해주세요."
                    value={additionalInfo.birthdate}
                    onChange={handleBirthChange}
                    inputProps={{ maxLength: 10 }}
                />

                <div className="box2">
                    <div className='titleBox2'>
                        <p>성별</p>
                    </div>
                    <div className='inputBox2'>
                        <input
                            className='radio'
                            type="radio"
                            id="male"
                            name="gender"
                            value="MALE"
                            checked={additionalInfo.gender === 'MALE'}
                            onChange={handleChange}
                        />
                        <label htmlFor="male">남성</label>
                        <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="FEMALE"
                            checked={additionalInfo.gender === 'FEMALE'}
                            onChange={handleChange}
                        />
                        <label htmlFor="female">여성</label>
                    </div>
                </div>

                <div className='addressBox'>
                    <p className='titleBox2'>기본주소</p>
                    <div className='inputBox2'>
                        <Input
                            id={"basicAddress"}
                            name={"basicAddress"}
                            type="text"
                            value={`${addressObj.areaAddress}${addressObj.townAddress}`}
                            readOnly
                        />
                    </div>
                    <DaumPost setAddressObj={setAddressObj} />
                </div>

                <div className='addressBox'>
                    <p className='titleBox2'>상세주소</p>
                    <div className='inputBox2'>
                        <Input
                            name="detailedAddress"
                            placeholder="상세주소"
                            value={detailedAddress}
                            onChange={handleDetailedAddressChange}
                        />
                    </div>
                </div>

                <FullWidthButton color="gray" text="가입하기" type="submit" />
            </form>
        </div>
    );
};

export default AdditionalInfoModal;