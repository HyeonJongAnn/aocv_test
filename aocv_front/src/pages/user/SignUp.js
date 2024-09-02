import React, { useEffect, useState } from 'react'
import '../../scss/pages/user/SignUp.scss'
import DaumPost from './DaumPost';
import JoinBox from '../../components/JoinBox';
import Button from '../../components/button/Button';
import FullWidthButton from '../../components/button/FullWidthButton';
import { useDispatch } from 'react-redux';
import { signup } from '../../apis/userApi.js';
import axios from 'axios';
import Input from '../../components/Input.js';

const SignUp = () => {
  const dispatch = useDispatch();

  const [addressObj, setAddressObj] = useState({
    areaAddress: '',
    townAddress: '',
  });

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [detailedAddress, setDetailedAddress] = useState('');
  const [tel, setTel] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState(true);
  const [isIdAvailable, setIsIdAvailable] = useState(true);
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  const titleName = ['아이디', '비밀번호', '비밀번호 확인', '이름', '전화번호', '생년월일'];

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'id') {
      setUserId(value);
      setIsIdChecked(false);
    }
    else if (name === 'password') setPassword(value);
    else if (name === 'passwordCheck') setPasswordCheck(value);
    setIsIdAvailable(true);

    if (name === 'password' || name === 'passwordCheck') {
      if (passwordCheck !== '') {
        setPasswordMatch(password === passwordCheck);
        setShowPasswordMessage(true);
      } else {
        setShowPasswordMessage(false);
      }
    }
  };

  useEffect(() => {
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    setPasswordValid(passwordPattern.test(password));
  }, [password]);

  useEffect(() => {
    setPasswordMatch(password === passwordCheck);
  }, [password, passwordCheck]);

  const handleDetailedAddressChange = (e) => {
    setDetailedAddress(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    setTel(formattedValue);
  };

  const handleBirthChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    setBirth(formattedValue);
  }

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const API_URL = "http://localhost:9090";

  const handleIdCheck = async (event) => {
    event.preventDefault();
    console.log('Checking userId:', userId);

    try {
      const response = await axios.get(`${API_URL}/user/check-userid?userId=${userId}`);
      const result = await response.data;
      console.log(result);
      setIsIdAvailable(result.item.available);
      setIsIdChecked(true);

      if (result.item.available === false) {
        alert('이미 존재하는 아이디입니다.');
      } else {
        alert('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      console.error('Error checking duplicate:', error);
      alert('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!isIdChecked) {
      alert('아이디 중복을 확인해주세요.');
      return;
    }

    if (!isIdAvailable) {
      alert('사용할 수 없는 아이디입니다.');
      return;
    }

    if (!passwordMatch) {
      alert('비밀번호를 다시 한번 확인해주세요.');
      return;
    }

    const formData = new FormData(event.target);

    let genderValue = '';
    if (formData.get('gender') === 'male') {
      genderValue = 'MALE';
    } else if (formData.get('gender') === 'female') {
      genderValue = 'FEMALE';
    }

    const user = {
      userId: formData.get('id'),
      userPw: formData.get('password'),
      userName: formData.get('name'),
      userTel: formData.get('tel'),
      userBirth: `${formData.get('birth')}T00:00:00`,
      userAddress: `${formData.get('basicAddress')} ${formData.get('detailAddress')}`,
      gender: genderValue,
    };

    try {
      console.log(user)
      await dispatch(signup(user));
    } catch (error) {
      console.log(user)
      console.error("Sign up failed:", error);
    }
  }



  return (
    <div className='sign_up_container'>
      <form id="form-signup" onSubmit={handleSignUp}>
        <h1 className='title'>회원가입</h1>
        <JoinBox
          id={"id"}
          name={"id"}
          value={userId}
          titleName={titleName[0]}
          showButtonBox={true}
          onClick={handleIdCheck}
          onChange={handleChange}
          placeholder={'아이디를 입력 해주세요.'} />
        <JoinBox
          id={"password"}
          name={"password"}
          titleName={titleName[1]}
          showButtonBox={false}
          type={"password"}
          onChange={handleChange}
          placeholder={'8~20자리 사이의 영문자,특수문자,숫자를 사용해서 입력해주세요.'}
        />
        <JoinBox
          id={"passwordCheck"}
          name={"passwordCheck"}
          titleName={titleName[2]}
          showButtonBox={false}
          type={"password"}
          onChange={handleChange}
          placeholder={'비밀번호를 다시 입력 해주세요.'}
        />
        {showPasswordMessage && !passwordMatch && <p className="error-message">비밀번호가 일치하지 않습니다.</p>}
        {showPasswordMessage && passwordMatch && <p className="success-message">비밀번호가 일치합니다.</p>}

        <JoinBox
          id={"name"}
          name={"name"}
          titleName={titleName[3]}
          showButtonBox={false}
          placeholder={'이름을 입력 해주세요.'} />

        <JoinBox
          id={"tel"}
          name={"tel"}
          titleName={titleName[4]}
          showButtonBox={false}
          value={tel}
          type={tel}
          onChange={handlePhoneNumberChange}
          inputProps={{ maxLength: 11 }}
          placeholder={'핸드폰 번호 숫자만 11자리 입력 해주세요.'} />

        <JoinBox
          id={"birth"}
          name={"birth"}
          titleName={titleName[5]}
          showButtonBox={false}
          inputProps={{ maxLength: 8 }}
          value={birth}
          onChange={handleBirthChange}
          placeholder={'생년월일 숫자만 8자리 입력 해주세요.'} />

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
              id={"detailAddress"}
              name={"detailAddress"}
              type="text"
              value={detailedAddress}
              onChange={handleDetailedAddressChange}
              className='detaileAddress'
            />
          </div>
        </div>


        <div className="box2">
          <div className='titleBox2'>
            <p>성별</p>
          </div>
          <div className='inputBox2'>
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={handleGenderChange}
              className='radio'
            />
            <label
              htmlFor="male"
              className='maleText'
            >남성</label>

            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={handleGenderChange}
            />
            <label htmlFor="female">여성</label>
          </div>
        </div>
        <div className='textBox'>
          <p className='text'>회원가입을 하시면 바로 사용가능한 1,000 포인트에 적립금을 드려요 !</p>
        </div>

        <FullWidthButton color="gray" text="가입하기" type="submit" />
      </form>
    </div>
  )
}

export default SignUp