import React, { useState } from 'react';
import Modal from 'react-modal';
import Rating from '@mui/material/Rating';
import Button3 from '../../components/button/Button3';
import '../../scss/pages/item/ItemDetail.scss';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview } from '../../apis/reviewApi';

const ReviewListContentItem = ({ review }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const loginUserId = useSelector(state => state.user.loginUserId);
  const loginUserRole = useSelector(state => state.user.loginUserRole); // 추가된 부분
  const dispatch = useDispatch();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const maskUserId = (userId) => {
    if (!userId) return 'Anonymous';

    if (userId.length <= 3) {
      return userId;
    }
    const visiblePart = userId.slice(0, 3);
    const maskedPart = '*'.repeat(userId.length - 3);
    return visiblePart + maskedPart;
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      dispatch(deleteReview(review.id))
        .catch((error) => {
          alert('리뷰 삭제 중 오류가 발생했습니다.');
          console.error(error);
        });
    }
  };

  return (
    <div className='ReviewContainor'>
      <div className='ReviewBox1'>
        <Rating
          className='rating'
          value={review.rating}
          readOnly />
        {review.best === true && <div className='bestLabel'>BEST</div>}

        <div className='userId'>{maskUserId(review.writer)}</div>
      </div>
      <div className='ReviewBox2'>
        <div className='title'>{review.title}</div>
        <div className='regDate'>{formatDate(review.createdAt)}</div>
      </div>
      <div className='ReviewBox3'>
        {review.imageUrls && review.imageUrls.map((image, index) => {
          const imageUrl = image instanceof Blob ? URL.createObjectURL(image) : image;
          return (
            <img key={index} src={imageUrl} alt={`review-${index}`} className="reviewImage2" onClick={() => openModal(imageUrl)} />
          );
        })}
      </div>
      <div className='content'>{review.content}</div>
      {(loginUserId === review.writer || loginUserRole === "ROLE_ADMIN") && ( // 수정된 부분
        <div className='Button3Box'>
          <Button3
            text={"삭제"}
            color={"red"}
            onClick={handleDelete}
          />
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="imageModal"
        overlayClassName="imageOverlay"
      >
        <img src={selectedImage} alt="Selected" className="modalImage" />
        <button onClick={closeModal} className="closeButton">Close</button>
      </Modal>
    </div>
  );
};

export default ReviewListContentItem;
