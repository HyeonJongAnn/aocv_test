import React from 'react'
import '../../scss/Footer.scss';

const Footer = () => {
  const path = window.location.pathname;
  if (path === '/user/sign-in' || path === '/user/sign-up' || path === '/user/find-id' 
    || path === '/user/find-pw'|| path === '/admin/home'|| path === '/admin/review/list'
    || path === '/admin/user') return null;
  return (
    <div className='footerContanior'>
      <p className='text1'>회사명: 애니오 아카이브 | 대표자: 오승현 | 사업자 등록번호: 476-11-02405 | 도매 및 소매업</p>
      <p className='text2'>전화: 010-4597-8783 | 주소: 서울특별시 용산구 보광로60길 14-22, 에이동 2층 202호</p>
      <p className='text3'>개인정보관리 책임자: 오승현 dhtmdgus@naver.com</p>
      <p className='text4'>계좌: 신한은행 110-395-568861 김종범</p>
      <br/>
      <br/>
      <p className='text5'>Copyrlght ⓒ2024 애니오 아카이브.all rlghts reserved.</p>
      <p className='text6'>Hosting by JBHJ</p>
    </div>
  )
}

export default Footer;