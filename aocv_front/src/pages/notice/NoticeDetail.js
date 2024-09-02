import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoticeDetail, deleteNotice } from '../../apis/noticeApi';
import '../../scss/pages/notice/NoticeDetail.scss';
import FullWidthButton from '../../components/button/FullWidthButton';
import NoticeModify from './NoticeModify';

const NoticeDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNotice, loading, error } = useSelector(state => state.notice);
  const userRole = useSelector(state => state.user.loginUserRole);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getNoticeDetail(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentNotice) return <div>No notice found</div>;

  const formattedDate = new Date(currentNotice.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const openModifyModal = () => {
    setIsModifyModalOpen(true);
  };

  const closeModifyModal = () => {
    setIsModifyModalOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await dispatch(deleteNotice(id)).unwrap();
        navigate('/notice/list');
      } catch (error) {
        console.error('공지사항 삭제 중 에러 발생:', error);
        alert('공지사항 삭제 중 에러가 발생했습니다.');
      }
    }
  };

  return (
    <div className="notice-detail-container">
      <div className="notice-header">
        <span className="notice-title">{currentNotice.title}</span>
        <span className="notice-date">{formattedDate}</span>
      </div>
      {userRole === "ROLE_ADMIN" && (
        <div className='modify'>
          <FullWidthButton text={"수정하기"} color={"green"} onClick={openModifyModal} />
        </div>
      )}
      {userRole === "ROLE_ADMIN" && (
        <div className='delete'>
          <FullWidthButton text={"삭제하기"} color={"red"} onClick={handleDelete} />
        </div>
      )}
      <div className="notice-content">
        <p>{currentNotice.content}</p>
      </div>
      <div className="notice-images">
        {currentNotice.imageUrls && currentNotice.imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Notice image ${index + 1}`} className="notice-image" />
        ))}
      </div>
      {isModifyModalOpen && (
        <NoticeModify
          notice={currentNotice}
          closeModal={closeModifyModal}
        />
      )}
    </div>
  );
};

export default NoticeDetail;
