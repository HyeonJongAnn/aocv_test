import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import '../../scss/Header.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../../apis/userApi';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isUserPage = location.pathname === '/user/mypage' || location.pathname === '/user/cart' || location.pathname === '/user/order-list' || location.pathname === '/user/orderrefund-list';
  const navi = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.user.isLogin);
  const admin = useSelector(state => state.user.loginUserRole);
  const path = window.location.pathname;
  if (path === '/user/sign-in' || path === '/user/sign-up' || path === '/admin/home' || path === '/admin/review/list' || path === '/admin/user' ) return null;

  const loginClick = () => {
    navi('/user/sign-in');
  };

  const handleLogoClick = () => {
    navi('/');
  };

  const instarClick = () => {
    window.open('https://www.instagram.com/animal_oh/', '_blank');
  };

  const signoutHandler = () => {
    dispatch(signout());
    navi('/');
    alert("정상적으로 로그아웃 되었습니다.");
  };

  return (
    <div className="home-container">
      <div className='loginJoinBox'>
        {isLogin ? (
          <>
            {admin === 'ROLE_ADMIN' && (
              <div className='admin-home' onClick={() => navi('/admin/home')}>
                <img className='adminHomeImg' src={process.env.PUBLIC_URL + `/assets/icons/관리자.png`} alt='관리자 홈 아이콘' />
              </div>
            )}
          <div className='cart' onClick={() => navi('/user/cart')}>
            <img className='cartImg' src={process.env.PUBLIC_URL + '/assets/icons/cart_black.png'} alt='장바구니 아이콘' />
          </div>
            <div className='mypage' onClick={() => navi('/user/mypage')}>
              <img className='mypageImg' src={process.env.PUBLIC_URL + `/assets/icons/mypage.png`} alt='마이페이지 아이콘' />
            </div>
            <div className='logout' onClick={signoutHandler}>
              <img className='logoutImg' src={process.env.PUBLIC_URL + `/assets/icons/logout_black.png`} alt='로그아웃 아이콘' />
            </div>
          </>
        ) : (
          <img className='loginImg' src={process.env.PUBLIC_URL + `/assets/icons/login_black.svg`} alt='로그인 아이콘' onClick={loginClick} />
        )}
      </div>
      <div className="main-logo">
        <img src={process.env.PUBLIC_URL + '/assets/icons/logo.webp'} className='logo' onClick={handleLogoClick} />
      </div>
      <div className='menu-bar'>
        <Navbar bg="light" expand="lg" className="custom-navbar">
          {isUserPage ? (
            <>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="HOME" onClick={handleLogoClick}>HOME</Nav.Link>
              </div>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="내 정보" onClick={() => navi('/user/mypage')}>내 정보</Nav.Link>
              </div>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="주문/배송 조회" onClick={() => navi('/user/order-list')}>주문/배송 조회</Nav.Link>
              </div>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="환불 조회" onClick={() => navi('/user/orderrefund-list')}>환불 조회</Nav.Link>
              </div>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="장바구니" onClick={() => navi('/user/cart')}>장바구니</Nav.Link>
              </div>
            </>
          ) : (
            <>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="HOME" onClick={handleLogoClick}>HOME</Nav.Link>
              </div>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="ABOUT" onClick={() => navi('/about')}>ABOUT</Nav.Link>
              </div>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="NOTICE" onClick={() => navi('/notice/list')}>NOTICE</Nav.Link>
              </div>
              <div className='menu-item'>
                <Nav.Link className="SMN_effect-13" data-hover="INSTAGRAM" onClick={instarClick}>INSTAGRAM</Nav.Link>
              </div>
            </>
          )}
        </Navbar>
      </div>
    </div>
  );
};

export default Header;
