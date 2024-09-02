import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JoinBox from '../../components/JoinBox';
import '../../scss/pages/user/MyPage.scss';
import DaumPost from './DaumPost';
import FullWidthButton from '../../components/button/FullWidthButton';
import axios from 'axios';
import { deleteUser } from '../../apis/userApi';
import { clearState, updateUserSuccess } from '../../slices/userSlice';
import Input from '../../components/Input';

const MyPage = () => {
    const dispatch = useDispatch();

    const deleteStatus = useSelector(state => state.user.deleteStatus);
    const userId = useSelector(state => state.user.loginUserId);
    const userName = useSelector(state => state.user.loginUserName);
    const userTel = useSelector(state => state.user.loginUserTel);
    const userAddress = useSelector(state => state.user.loginUserAddress);
    const userPoint = useSelector(state => state.user.loginUserPoint);
    const titleName = ['아이디', '현재 비밀번호', '이름', '전화번호', '비밀번호', '비밀번호 확인', '적립금'];

    const [point, setPoint] = useState(userPoint);
    const [detailedAddress, setDetailedAddress] = useState('');
    const [name, setName] = useState(userName);
    const [tel, setTel] = useState(userTel);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordCheck, setNewPasswordCheck] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [addressObj, setAddressObj] = useState({
        areaAddress: '',
        townAddress: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'newPasswordCheck') {
            setNewPasswordCheck(value);
        }

        if (name === 'newPassword' || name === 'newPasswordCheck') {
            setPasswordMatch(newPassword === newPasswordCheck);
            setShowPasswordMessage(true);
        }
    };

    useEffect(() => {
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        setPasswordValid(passwordPattern.test(newPassword));
    }, [newPassword]);

    useEffect(() => {
        setPasswordMatch(newPassword === newPasswordCheck);
    }, [newPassword, newPasswordCheck]);

    const splitAddress = (fullAddress) => {
        const regex = /(\d{3,4}동\s\d{3,4}호)$/;
        const match = fullAddress.match(regex);
        if (match) {
            const basicAddress = fullAddress.replace(match[0], '').trim();
            const detailedAddress = match[0];
            return { basicAddress, detailedAddress };
        }
        return { basicAddress: fullAddress, detailedAddress: '' };
    };

    useEffect(() => {
        if (userAddress) {
            const { basicAddress, detailedAddress } = splitAddress(userAddress);
            setAddressObj({ areaAddress: basicAddress, townAddress: '' });
            setDetailedAddress(detailedAddress);
        }
    }, [userAddress]);

    useEffect(() => {
        setName(userName);
        setTel(userTel);
        if (userAddress) {
            const { basicAddress, detailedAddress } = splitAddress(userAddress);
            setAddressObj({ areaAddress: basicAddress, townAddress: '' });
            setDetailedAddress(detailedAddress);
        }
    }, [userName, userTel, userAddress]);

    const handleDetailedAddressChange = (e) => {
        setDetailedAddress(e.target.value);
    };

    const nameChange = (e) => {
        setName(e.target.value);
    };

    const passwordChange = (e) => {
        setPassword(e.target.value);
    };

    const telChange = (e) => {
        const { value } = e.target;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        setTel(formattedValue);
    };

    const API_URL = "http://localhost:9090";

    const handleSubmit = async () => {
        if (newPassword && newPassword !== newPasswordCheck) {
            alert("새 비밀번호를 확인해주세요.");
            return;
        }
        if (name === '') {
            alert("이름을 입력해주세요.");
            return;
        }
        if (tel === '') {
            alert("전화번호를 입력해주세요.");
            return;
        }
        if (detailedAddress === '') {
            alert("상세주소를 입력해주세요.");
            return;
        }
        const data = {
            curUserPw: password,
            userPw: newPassword,
            userName: name,
            userTel: tel,
            userAddress: `${addressObj.areaAddress}${addressObj.townAddress} ${detailedAddress}`
        };
        console.log('Sending data:', data);
    
        try {
            const response = await axios.put(`${API_URL}/user/modify/${userId}`, data);
            console.log('Server response:', response);
            if (response.status === 200) {
                dispatch(updateUserSuccess(response.data.item)); // Redux 상태 업데이트
                alert('정보가 성공적으로 수정되었습니다.');
            } else {
                alert('정보 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('There was an error updating the user information!', error);
            if (error.response && error.response.data && error.response.data.errorMessage) {
                alert("현재 비밀번호를 다시 확인해주세요.");
            } else {
                alert('정보 수정 중 오류가 발생했습니다.');
            }
        }
    };
    
    const handleExit = async () => {
        if (!password) {
            alert("현재 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/user/check-password`, null, {
                params: {
                    curUserPw: password,
                    userId: userId
                }
            });

            console.log(response.data);

            if (response.status === 200 && response.data.item.checkPasswordMsg === "success") {
                const userConfirmation = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?");
                if (userConfirmation) {
                    dispatch(deleteUser(userId));
                } else {
                    alert("회원 탈퇴가 취소되었습니다.");
                }
            } else {
                alert("현재 비밀번호를 다시 확인해주세요.");
            }
        } catch (error) {
            console.error('There was an error checking the password!', error);
            alert("현재 비밀번호를 다시 확인해주세요.");
        }
    };

    useEffect(() => {
        if (deleteStatus === "succeeded") {
            alert("회원 탈퇴가 성공적으로 처리되었습니다.");
            window.location.href = "/";
            dispatch(clearState());
        } else if (deleteStatus === "failed") {
            alert("회원 탈퇴에 실패했습니다. 관리자에게 문의하세요.");
        }
    }, [deleteStatus]);

    // 포인트 포맷팅 함수
    const formatPoints = (points) => {
        return new Intl.NumberFormat('ko-KR').format(points) + 'P';
    };

    return (
        <div className='myPageContainer'>
            <div className='inputBox'>
                <JoinBox
                    id={"id"}
                    name={"id"}
                    value={userId}
                    titleName={titleName[0]}
                    showButtonBox={false}
                    readOnly={true}
                />
                <JoinBox
                    id={"password"}
                    name={"password"}
                    type={"password"}
                    value={password}
                    onChange={passwordChange}
                    titleName={titleName[1]}
                    showButtonBox={false}
                    placeholder={"현재 비밀번호 입력은 필수입니다."}
                />
                <JoinBox
                    id={"newPassword"}
                    name={"newPassword"}
                    type={"password"}
                    onChange={handleChange}
                    titleName={titleName[4]}
                    showButtonBox={false}
                    placeholder={"새로운 비밀번호 8~20자 영문자,숫자,특수문자를 포함하여 입력하세요."}
                />
                <JoinBox
                    id={"newPasswordCheck"}
                    name={"newPasswordCheck"}
                    type={"password"}
                    onChange={handleChange}
                    titleName={titleName[5]}
                    showButtonBox={false}
                    placeholder={"새로운 비밀번호를 한번 더 입력하세요."}
                />
                {showPasswordMessage && !passwordMatch && <p className="error-message">비밀번호가 일치하지 않습니다.</p>}
                {showPasswordMessage && passwordMatch && <p className="success-message">비밀번호가 일치합니다.</p>}
                <JoinBox
                    id={"name"}
                    name={"name"}
                    onChange={nameChange}
                    value={name}
                    titleName={titleName[2]}
                    showButtonBox={false}
                />
                <JoinBox
                    id={"tel"}
                    name={"tel"}
                    value={tel}
                    onChange={telChange}
                    titleName={titleName[3]}
                    showButtonBox={false}
                    inputProps={{ maxLength: 11 }}
                />
                <div className='addressBox'>
                    <p className='titleBox2'>주소</p>
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
                            id={"detailAddress"}
                            name={"detailAddress"}
                            type="text"
                            value={detailedAddress}
                            onChange={handleDetailedAddressChange}
                            className='detaileAddress'
                        />
                    </div>
                </div>
                <JoinBox
                    id={"point"}
                    name={"point"}
                    value={formatPoints(point)} // 포인트 포맷팅 함수 사용
                    titleName={titleName[6]}
                    readOnly
                    showButtonBox={false}
                />
                <div className='modifyButton'>
                    <FullWidthButton color={'gray'} text={'수정하기'} onClick={handleSubmit}></FullWidthButton>
                </div>
                <div className='areaBox'>
                </div>
                <div className='quit'>
                    <FullWidthButton color={'red'} text={'회원탈퇴'} onClick={handleExit}></FullWidthButton>
                </div>
            </div>
        </div>
    )
}

export default MyPage;
