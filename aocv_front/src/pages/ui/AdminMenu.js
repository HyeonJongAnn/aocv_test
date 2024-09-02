import React, { useState } from 'react';
import '../../scss/AdminMenu.scss';
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

const AdminMenu = () => {
    const navi = useNavigate();
    const [showProductSubMenu, setShowProductSubMenu] = useState(false);
    const [showOrderSubMenu, setShowOrderSubMenu] = useState(false);
    const [showReviewSubMenu, setShowReviewSubMenu] = useState(false);
    const [showStatisticsSubMenu, setShowStatisticsSubMenu] = useState(false);


    const handleProductMouseEnter = () => {
        setShowProductSubMenu(true);
    };

    const handleProductMouseLeave = () => {
        setShowProductSubMenu(false);
    };

    const handleOrderMouseEnter = () => {
        setShowOrderSubMenu(true);
    };

    const handleOrderMouseLeave = () => {
        setShowOrderSubMenu(false);
    };
    const handleReviewMouseEnter = () => {
        setShowReviewSubMenu(true);
    };

    const handleReviewMouseLeave = () => {
        setShowReviewSubMenu(false);
    };
    const handleStatisticsMouseEnter = () => {
        setShowStatisticsSubMenu(true);
    };

    const handleStatisticsMouseLeave = () => {
        setShowStatisticsSubMenu(false);
    };

    return (
        <div className='menu-bar'>
            <Navbar bg="light" expand="lg" className="custom-navbar">
                <>
                    <div className='menu-item' onMouseEnter={handleProductMouseEnter} onMouseLeave={handleProductMouseLeave}>
                        <Nav.Link className="SMN_effect-13" data-hover="상품/유저관리">상품/유저관리</Nav.Link>
                        {showProductSubMenu && (
                            <div className='sub-menu-container'>
                                <Nav.Link className="SMN_effect-13" data-hover="상품등록" onClick={() => navi('/admin')}>상품등록</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="유저관리" onClick={() => navi('/admin/user')}>유저관리</Nav.Link>
                            </div>
                        )}
                    </div>
                    <div className='menu-item' onMouseEnter={handleOrderMouseEnter} onMouseLeave={handleOrderMouseLeave}>
                        <Nav.Link className="SMN_effect-13" data-hover="주문관리">주문관리</Nav.Link>
                        {showOrderSubMenu && (
                            <div className='sub-menu-container'>
                                <Nav.Link className="SMN_effect-13" data-hover="발주관리">발주관리</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="반품관리">반품관리</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="교환관리">교환관리</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="취소관리">취소관리</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="배송관리">배송관리</Nav.Link>
                            </div>
                        )}
                    </div>
                    <div className='menu-item' onMouseEnter={handleReviewMouseEnter} onMouseLeave={handleReviewMouseLeave}>
                        <Nav.Link className="SMN_effect-13" data-hover="리뷰/공지사항">리뷰/공지사항</Nav.Link>
                        {showReviewSubMenu && (
                            <div className='sub-menu-container'>
                                <Nav.Link className="SMN_effect-13" data-hover="리뷰관리" onClick={() => navi('/admin/review/list')}>리뷰관리</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="공지사항 등록" onClick={() => navi('/notice/create')}>공지사항 등록</Nav.Link>
                            </div>
                        )}
                    </div>
                    <div className='menu-item' onMouseEnter={handleStatisticsMouseEnter} onMouseLeave={handleStatisticsMouseLeave}>
                        <Nav.Link className="SMN_effect-13" data-hover="통계">통계</Nav.Link>
                        {showStatisticsSubMenu && (
                            <div className='sub-menu-container'>
                                <Nav.Link className="SMN_effect-13" data-hover="요약">요약</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="나이/성별/지역">나이/성별/지역</Nav.Link>
                                <Nav.Link className="SMN_effect-13" data-hover="날자별">날자별</Nav.Link>
                            </div>
                        )}
                    </div>
                </>
            </Navbar>
        </div>
    );
};

export default AdminMenu;
