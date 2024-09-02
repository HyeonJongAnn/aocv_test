import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../scss/pages/order/Order.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Divider, Modal, Box } from '@mui/material';
import FullWidthButton from '../../components/button/FullWidthButton';
import JoinBox from '../../components/JoinBox';
import DaumPost from '../user/DaumPost';
import Button from '../../components/button/Button';
import { getUserAddress, getUserPoints, updateUserAddress } from '../../apis/userApi';
import { loadTossPayments } from "@tosspayments/payment-sdk";
import axios from 'axios';

const Order = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [userName, setUserName] = useState(user.loginUserName);
    const [tel, setTel] = useState(user.loginUserTel);
    const [userAddress, setUserAddress] = useState(user.loginUserAddress);
    const [detailedAddress, setDetailedAddress] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    const [customRequest, setCustomRequest] = useState('');
    const [open, setOpen] = useState(false);
    const [shippingCost, setShippingCost] = useState(3000);
    const location = useLocation();
    const { selectedItems, price, shipping } = location.state || { selectedItems: [], price: 0, shipping: 0 };
    const [totalAmount, setTotalAmount] = useState(price + shipping);
    const [initialAlertShown, setInitialAlertShown] = useState(false);
    const [usedPoints, setUsedPoints] = useState("");
    const points = useSelector((state) => state.user.loginUserPoint);
    const { loginUser } = useSelector((state) => state.user);
    const allItems = useSelector(state => state.item.itemDTO);

    useEffect(() => {
        dispatch(getUserAddress());
        dispatch(getUserPoints(loginUser));
    }, [dispatch, loginUser]);

    useEffect(() => {
        if (user.loginUserName) {
            setUserName(user.loginUserName);
        }
        if (user.loginUserTel) {
            setTel(user.loginUserTel);
        }
        if (user.loginUserAddress) {
            setUserAddress(user.loginUserAddress);
        }
    }, [user.loginUserName, user.loginUserTel, user.loginUserAddress]);

    useEffect(() => {
        if (userAddress) {
            const postalCode = extractPostalCode(userAddress);
            if (postalCode) {
                calculateShippingCost(postalCode, price, true);
            }
        }
    }, [userAddress]);

    useEffect(() => {
        setTotalAmount(price + shippingCost - usedPoints);
    }, [price, shippingCost, usedPoints]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        if (e.target.value !== '직접 입력') {
            setCustomRequest('');
        }
    };
    const API_URL = process.env.REACT_APP_API_URL;
    
    const calculateShippingCost = async (postalCode, price, initialLoad = false) => {
        try {
            const response = await axios.get(`${API_URL}/order/shippingcost?postalCode=${postalCode}&price=${price}`);
            const newShippingCost = response.data;
            setShippingCost(newShippingCost);
            setTotalAmount(price + newShippingCost - usedPoints);

            if ((newShippingCost > 3000) && (!initialLoad || !initialAlertShown)) {
                setInitialAlertShown(true);
                alert("입력하신 배송지에 따라 지역별 추가 배송비 금액이 변경되었으니 확인 바랍니다.");
            }
        } catch (error) {
            console.error('Error calculating shipping cost', error);
        }
    };

    const getItemType = (itemId) => {
        // allItems 객체에서 content 배열을 가져옵니다.
        const itemsArray = allItems.content;
      
        // itemsArray에서 해당 itemId와 일치하는 아이템을 찾습니다.
        const item = itemsArray.find(item => item.id === itemId);
      
        // 해당 아이템의 타입을 반환합니다. 아이템이 없으면 null을 반환합니다.
        return item ? item.type : null;
      };

    const handleSave = async () => {
        let fullAddress = userAddress;

        if (detailedAddress && !userAddress.includes(detailedAddress)) {
            fullAddress = `${userAddress} ${detailedAddress}`;
        } else if (detailedAddress && userAddress.includes(detailedAddress)) {
            fullAddress = userAddress;
        }

        const updatedAddress = { userName, userTel: tel, userAddress: fullAddress.trim() };

        dispatch(updateUserAddress(updatedAddress)).then(() => {
            handleClose();
        });
    };

    const handleDetailedAddressChange = (e) => {
        setDetailedAddress(e.target.value);
    };

    const telChange = (e) => {
        const { value } = e.target;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        setTel(formattedValue);
    };

    const containerHeight = selectedOption === '직접 입력' ? '250px' : '200px';

    const setAddressObj = ({ areaAddress, townAddress }) => {
        setUserAddress(`${areaAddress}${townAddress}`);
    };

    const handleImageClick = (itemId) => {
        navigate(`/item/${itemId}`);
    };

    const requestNote = selectedOption === '직접 입력' ? customRequest : selectedOption;

    const extractPostalCode = (address) => {
        const regex = /\((\d{5})\)/;
        const match = address.match(regex);
        return match ? match[1] : '';
    };

    const handlePointsChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, '');
        value = Number(value);
        if (value > points) {
            alert("보유하신 적립금을 초과하였습니다.");
            value = points;
        }
        setUsedPoints(value);
    };

    const handleMaxPoints = () => {
        setUsedPoints(points);
    };

    const renderOptions = (optionId) => {
        
        const option = allItems.content
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

    const handlePayment = async () => {
        const clientKey = process.env.REACT_APP_TOSSPAYMENTS_API_KEY;
        const tossPayments = await loadTossPayments(clientKey);
        try {
            const orderName = selectedItems.length > 1
                ? `${selectedItems[0].itemName} 외 ${selectedItems.length - 1}건`
                : selectedItems[0].itemName;

            const orderId = `orderId-${new Date().getTime()}`;
            const postalCode = extractPostalCode(userAddress);
            const addressParts = userAddress.match(/(.*)\s+(\d+동\s+\d+호)$/);
            let addressLine1 = addressParts ? addressParts[1] : userAddress;
            const addressLine2 = addressParts ? addressParts[2] : '';

            addressLine1 = addressLine1.replace(/\(\d{5}\)/, '').trim();

            const addressDTO = {
                recipientName: userName,
                phoneNumber: tel,
                addressLine1,
                addressLine2,
                postalCode,
                requestNote
            };

            const orderItems = selectedItems.map(item => {
                const orderItem = {
                    itemId: item.itemId,
                    cartItemId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    optionId: item.optionId
                };

                const itemType = getItemType(item.itemId);
            if (itemType === 'TSHIRT') {
                orderItem.petName = item.petName; // petName을 포함시킵니다.
            }

                return orderItem;
            });

            const orderInfo = {
                userId: user.loginUser,
                orderItems,
                totalAmount,
                status: 'PAID',
                orderNumber: orderId,
                orderName: orderName,
                address: addressDTO,
                usedPoints
            };

            console.log(orderItems)
            console.log('Order Info before navigate:', orderInfo);
            console.log('Used Points:', usedPoints);

            sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));

            const successUrl = `http://localhost:3000/success?orderId=${orderId}&amount=${totalAmount}`;
            const failUrl = 'http://localhost:3000/fail';

            const response = await tossPayments.requestPayment('카드', {
                amount: totalAmount,
                orderId: orderId,
                orderName: orderName,
                customerName: userName,
                successUrl: successUrl,
                failUrl: failUrl,
            });

            const paymentKey = response.paymentKey;
            console.log('Payment Key:', paymentKey);

            navigate(`/success`, { state: { paymentKey, orderId, amount: totalAmount } });
        } catch (error) {
            console.error("Payment failed:", error);

            navigate('/fail', { state: { error: error.message } });
        }
    };

    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <div className='orderContainer'>
            <h1>결제하기</h1>
            <div className='orderAddressContainer' style={{ height: containerHeight }}>
                <div className='address-titleBox'>
                    <h3 className='address-title'>배송지</h3>
                    <Button className='Button' color="shadegray" text="배송지 변경" onClick={handleOpen}></Button>
                </div>
                <div className='addressUserNameBox'>
                    <p className='addressUserName'>{userName}</p>
                </div>
                <span className='addressUserTel'>{tel}</span>
                <div className='delivery-address'>{userAddress}</div>
                {detailedAddress && !userAddress.includes(detailedAddress) && <div className='delivery-address'>{detailedAddress}</div>}
                <div className='deliveryRequestContainer'>
                    <select
                        className='deliveryRequestSelect'
                        value={selectedOption}
                        onChange={handleOptionChange}
                    >
                        <option value="" disabled>배송 시 요청사항을 선택해주세요</option>
                        <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
                        <option value="부재 시 택배함에 넣어주세요">부재 시 택배함에 넣어주세요</option>
                        <option value="부재 시 집 앞에 놔주세요">부재 시 집 앞에 놔주세요</option>
                        <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
                        <option value="파손의 위험이 있는 상품입니다. 배송 시 주의해 주세요.">파손의 위험이 있는 상품입니다. 배송 시 주의해 주세요.</option>
                        <option value="직접 입력">직접 입력</option>
                    </select>
                    {selectedOption === '직접 입력' && (
                        <input
                            type="text"
                            className='customRequestInput'
                            placeholder="요청사항을 입력해주세요 (최대 50자)"
                            value={customRequest}
                            onChange={(e) => setCustomRequest(e.target.value)}
                            maxLength="50"
                        />
                    )}
                </div>
            </div>
            <div className='orderPointContainer'>
                <div className='orderPointTextContainer'>
                    <h3 className='orderPoint-title'>적립금</h3>
                    <p className='usePointsText'>보유 적립금 사용</p>
                    <JoinBox
                        id={"usedPoints"}
                        name={"usedPoints"}
                        showButtonBox={false}
                        inputProps={{ maxLength: 8 }}
                        value={usedPoints}
                        onChange={handlePointsChange}
                        placeholder={'0원'}
                        className="pointsInput"
                    />
                    <Button text="최대 사용" className='usePointButton' color="shadegray" onClick={handleMaxPoints} />
                    <div className='havePointsBox'>
                        <p className='havePointsText'>보유 적립금</p><span className='havePoints'>{points.toLocaleString()}원</span>
                    </div>
                </div>
            </div>
            <div className='orderItemListContainer'>
                {selectedItems.map((item) => (
                    <div key={item.id} className='orderItemBox'>
                        <img src={item.imageUrl} alt={item.itemName} className='orderItemImage' onClick={() => handleImageClick(item.itemId)} />
                         <div className='orderItemDetails'>
                        <span className='orderItemName'>{item.itemName}</span>
                        {getItemType(item.itemId) === 'TSHIRT' && item.petName ? (
                            <span className='orderItemOption' style={{ display: 'block' }}>반려동물: {item.petName} | 수량: {item.quantity}개</span>
                        ) : (
                            <span className='orderItemOption' style={{ display: 'block' }}>수량: {item.quantity}개</span>
                        )}
                        {item.optionId && renderOptions(item.optionId)}
                        <span className='orderItemOption' style={{ display: 'block' }}>가격: {item.price ? item.price.toLocaleString() : '0'}원</span>
                    </div>
                    </div>
                ))}
            </div>
            <div className='orderSummaryContainer'>
                <div className='orderSummaryTextContainer'>
                    <h3 className='orderSummaryText'>결제할 상품</h3>
                </div>
                <div className='orderSummaryItemPriceBox'>
                    <p className='orderSummaryItemPriceText'>상품금액</p>
                    <span className='orderSummaryItemPrice'>{price.toLocaleString()}원</span>
                </div>
                <Divider />
                <div className='orderSummaryShippingPriceBox'>
                    <p className='orderSummaryShippingPriceText'>배송비</p>
                    <span className='orderSummaryShippingPrice'>+{shipping.toLocaleString()}원</span>
                </div>
                <Divider />
                {usedPoints > 0 && (
                    <div className='orderSummaryUsedPointsBox'>
                        <p className='orderSummaryUsedPointsText'>적립금 사용</p>
                        <span className='orderSummaryUsedPoints'>- {usedPoints.toLocaleString()}원</span>
                    </div>
                )}
                <Divider />
                <div className='orderSummaryTotalPriceBox'>
                    <p className='orderSummaryTotalPriceText'>총 결제 금액</p>
                    <p className='orderSummaryTotalPrice'>{totalAmount.toLocaleString()}원</p>
                </div>
            </div>
            <div className='cartOrderButton'>
                <FullWidthButton color={'thickgray'} text={`${totalAmount.toLocaleString()}원 결제하기`} onClick={handlePayment} />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <h1>배송지 변경</h1>
                        <JoinBox
                            name="userName"
                            titleName="이름"
                            placeholder="이름을 입력 해주세요."
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <JoinBox
                            name="userTel"
                            titleName="전화번호"
                            placeholder="핸드폰 번호 숫자만 11자리 입력 해주세요."
                            value={tel}
                            onChange={telChange}
                            inputProps={{ maxLength: 13 }}
                        />
                        <div className='addressBox'>
                            <p className='titleBox2'>기본주소</p>
                            <div className='inputBox2'>
                                <JoinBox
                                    id={"basicAddress"}
                                    name={"basicAddress"}
                                    type="text"
                                    value={userAddress}
                                    readOnly
                                    fullWidth
                                />
                            </div>
                            <div className='addressFindButton'>
                                <DaumPost style={{ marginTop: '10px', position: 'absolute', right: '0', marginRight: '6.5%' }} setAddressObj={setAddressObj} />
                            </div>
                        </div>
                        <div className='addressBox'>
                            <p className='titleBox2'>상세주소</p>
                            <div className='inputBox2'>
                                <JoinBox
                                    name="detailedAddress"
                                    placeholder="상세주소"
                                    value={detailedAddress}
                                    onChange={handleDetailedAddressChange}
                                    fullWidth
                                />
                            </div>
                        </div>
                        <FullWidthButton style={{ marginTop: '20px' }} color="gray" text="수정" type="submit" />
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default Order;