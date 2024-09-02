import React, { useState } from 'react'
import '../../scss/pages/user/FindId.scss'
import JoinBox from '../../components/JoinBox';
import Button from '../../components/button/Button';
import axios from 'axios';

const FindId = () => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [tel, setTel] = useState('');
  const titleName = ["이름", "전화번호"];

  const userNameChange = (event)  => {
    const { name, value } = event.target;
    if (name === 'userName') setUserName(value);
  }

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    setTel(formattedValue);
  };

  const API_URL = "http://localhost:9090";

  const handleFindId = async (e) => {
    e.preventDefault();
    setShowResult(false);
    console.log('Form submitted with:', { userName, tel });
    try {
      const response = await axios.post(`${API_URL}/user/find-id`, null, {
        params: {
          userName: userName,
          userTel: tel
        }, 
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      setUserId(response.data.item.userId);
      setShowResult(true);
    } catch (error) {
      console.error('Error checking duplicate:', error);
      alert('이름 또는 전화번호가 불일치합니다. 다시 입력해주세요.')
      setUserId('')
      setShowResult(false);
    }
  };

  return (
    <div className='findIdContainer'>
     <form id="form-findId" 
      onSubmit={handleFindId}>
    <h2 className='title'>아이디 찾기</h2>
    <div className='inputBox'>
    <JoinBox
          id={"userName"}
          name={"userName"}
          titleName={titleName[0]}
          showButtonBox={false}
          onChange={userNameChange}
          placeholder={'이름을 입력해주세요.'} />
          <JoinBox
          id={"tel"}
          name={"tel"}
          value={tel}
          titleName={titleName[1]}
          showButtonBox={false}
          onChange={handlePhoneNumberChange}
          inputProps={{ maxLength: 11 }}
          placeholder={'전화번호를 입력해주세요.'} />
    </div>
    <div className="submitButton">
      <Button
      color={"gray"}
      text={"아이디 찾기"}
       type="submit"
      />
    </div>
    {showResult && (
        <div className='resultBox'>
          <br />
          <h2 className='text1'>검색결과 아이디는 아래와 같습니다.</h2>
          <br />
          <h2 className='text2'>"{userId}"</h2>
        </div>
      )}
      </form>
    </div>
  )
}

export default FindId