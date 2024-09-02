import axios from 'axios';
import React, { useState } from 'react'
import JoinBox from '../../components/JoinBox';
import Button from '../../components/button/Button';
import '../../scss/pages/user/FindId.scss'

const FindPassword = () => {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [tel, setTel] = useState('');
    const [userPw, setUserPw] = useState('');
    const titleName = ["아이디", "이름", "전화번호"];

    const userIdChange = (event) => {
        const { name, value } = event.target;
        if (name === 'userId') setUserId(value);
    }

    const userNameChange = (event) => {
        const { name, value } = event.target;
        if (name === 'userName') setUserName(value);
    }

    const handlePhoneNumberChange = (e) => {
        const { value } = e.target;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        setTel(formattedValue);
    };

    const API_URL = "http://localhost:9090";

    const handleFindPw = async (e) => {
        e.preventDefault();
        setShowResult(false);
        console.log('Form submitted with:', { userId, userName, tel });
        try {
            const response = await axios.post(`${API_URL}/user/find-pw`, null, {
                params: {
                    userId: userId,
                    userName: userName,
                    userTel: tel
                },
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                },
            });
            setUserPw(response.data.item.tempPassword);
            setShowResult(true);
        } catch (error) {
            console.error('Error checking duplicate:', error);
            alert('아이디, 이름, 전화번호가 불일치합니다. 다시 입력해주세요.')
            setUserPw('')
            setShowResult(false);
        }
    };

    return (
        <div className='findIdContainer'>
            <form id="form-findPw" onSubmit={handleFindPw}>
                <h2 className='title'>비밀번호 찾기</h2>
                <div className='inputBox'>
                    <JoinBox
                        id={"userId"}
                        name={"userId"}
                        titleName={titleName[0]}
                        showButtonBox={false}
                        onChange={userIdChange}
                        placeholder={'아이디를 입력해주세요.'} />
                    <JoinBox
                        id={"userName"}
                        name={"userName"}
                        titleName={titleName[1]}
                        showButtonBox={false}
                        onChange={userNameChange}
                        placeholder={'이름을 입력해주세요.'} />
                    <JoinBox
                        id={"tel"}
                        name={"tel"}
                        value={tel}
                        titleName={titleName[2]}
                        showButtonBox={false}
                        onChange={handlePhoneNumberChange}
                        inputProps={{ maxLength: 11 }}
                        placeholder={'전화번호를 입력해주세요.'} />
                </div>
                <div className="submitButton1">
                    <Button
                        color={"gray"}
                        text={"비밀번호 찾기"}
                        type="submit"
                    />
                </div>
                {showResult && (
                    <div className='resultBox1'>
                        <br />
                        <h2 className='text11'>새로운 비밀번호로 변경 됐습니다.</h2>
                        <br />
                        <h2 className='text11'>{`마이페이지 -> 내정보수정 에서 비밀번호를 변경해주세요.`}</h2>
                        <h2 className='text21'>"{userPw}"</h2>
                    </div>
                )}
            </form>
        </div>
    )
}

export default FindPassword