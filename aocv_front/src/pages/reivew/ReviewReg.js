import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import '../../scss/pages/item/ItemDetail.scss';
import JoinBox from '../../components/JoinBox';
import Button from '../../components/button/Button';
import Button2 from '../../components/button/Button2';
import Rating from '@mui/material/Rating';
import { createReview, getReview } from '../../apis/reviewApi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReviewListContent from './ReviewListContent';
import CustomPagination from '../../components/ui/CustomPagination';
import { useNavigate } from 'react-router-dom';

const ReviewReg = ({
  modalIsOpen,
  setModalIsOpen,
  closeModal,
  reviewTitle,
  setReviewTitle,
  reviewContent,
  setReviewContent,
  reviewRating,
  setReviewRating,
  reviewImages,
  setReviewImages,
  userId,
  itemId,
}) => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.review.reviewDTO);
  const page = useSelector(state => state.review.page);
  const totalPages = useSelector(state => state.review.totalPages);
  const navi = useNavigate();

  useEffect(() => {
    if (itemId) {
      dispatch(getReview({ 
        itemId,
        page: 0 
      }));
    }
  }, [dispatch, itemId]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      height: '500px'
    },
  };

  const handleTitleChange = (e) => {
    setReviewTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setReviewContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setReviewImages(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleSubmit = () => {
    if (!reviewTitle) {
      alert('제목을 입력 해주세요.');
      return;
    }

    if (!reviewContent) {
      alert('내용을 입력 해주세요.');
      return;
    }

    if (!reviewRating) {
      alert('별점을 입력 해주세요.');
      return;
    }

    if (!userId) {
      alert('로그인 이후 리뷰 작성해주세요.');
      navi('/user/sign-in');
      return;
    }

    const formData = new FormData();
    formData.append('title', reviewTitle);
    formData.append('content', reviewContent);
    formData.append('rating', reviewRating);
    formData.append('userId', userId);
    formData.append('itemId', itemId);
    reviewImages.forEach((image) => {
      formData.append('images', image);
    });

    dispatch(createReview(formData)).unwrap()
      .then(response => {
        console.log('Review created successfully', response);
        dispatch(getReview({ itemId, page: 0 }));
        closeAndResetModal();
      })
      .catch(error => {
        console.error('Error creating review', error);
        alert('리뷰 등록 중 오류가 발생했습니다.');
      });
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(reviewImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setReviewImages(items);
  };

  const handlePageChange = (event, value) => {
    dispatch(getReview({
      itemId,
      page: value - 1
    }));
  };

  const closeAndResetModal = () => {
    setReviewTitle('');
    setReviewContent('');
    setReviewRating(0);
    setReviewImages([]);
    closeModal();
  };

  return (
    <>
      <div className='reviewContent'>
        <Button
          text={"후기 등록"}
          color={"thickgray"}
          onClick={() => setModalIsOpen(true)}
        />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeAndResetModal}
          style={customStyles}
          contentLabel="Review Modal"
        >
          <h2 className='regTitle'>후기 등록</h2>
          <button
            onClick={closeAndResetModal}
            className='regButton'
          >X</button>
          <form>
            <div className='regTextBox1'>
              <JoinBox
                id={"title"}
                name={"title"}
                value={reviewTitle}
                showButtonBox={false}
                onChange={handleTitleChange}
                placeholder={'제목을 입력 해주세요.'} />
            </div>

            <div className='regTextBox4'>
              <JoinBox
                id={"file"}
                name={"file"}
                type={"file"}
                multiple
                showButtonBox={false}
                onChange={handleFileChange} />
            </div>

            <div className='regTextBox4'>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided) => (
                    <div className="fileListContainer"
                     {...provided.droppableProps} 
                     ref={provided.innerRef}
                     style={{ overflow: 'auto' }}>
                      {reviewImages.map((file, index) => (
                        <Draggable key={file.name} draggableId={file.name} index={index}>
                          {(provided) => (
                            <div className="fileListItem" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <img src={URL.createObjectURL(file)} alt={file.name} className="filePreviewImage" />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className='regTextBox3'>
              <Rating
                name="simple-controlled"
                value={reviewRating}
                onChange={(event, newValue) => {
                  setReviewRating(newValue);
                }}
              />
            </div>

            <div className='regTextBox2'>
              <textarea
                value={reviewContent}
                onChange={handleContentChange}
                className='regContent'
                placeholder='내용을 입력 해주세요.'
              />
            </div>

            <Button2
              text={"후기 등록"}
              color={"thickgray"}
              onClick={handleSubmit}
              className="modal-button"
            />
          </form>
        </Modal>
      </div>
      <ReviewListContent reviews={reviews} />
      {reviews && <CustomPagination total={totalPages} page={page + 1} changePage={handlePageChange} />}
    </>
  );
};

export default ReviewReg;
