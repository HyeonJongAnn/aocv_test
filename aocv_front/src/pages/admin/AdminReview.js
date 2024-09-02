import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewList, markReviewAsBest, unmarkReviewAsBest, deleteReview } from '../../apis/reviewApi';
import { Button, Spinner, Table } from 'react-bootstrap';
import '../../scss/pages/admin/AdminReview.scss';
import CustomPagination from '../../components/ui/CustomPagination';
import { useNavigate } from 'react-router-dom';
import useBodyClass from '../../components/useBodyClass';
import AdminMenu from '../ui/AdminMenu';

const AdminReview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviewDTO, loading, error } = useSelector(state => state.review);
  const page = useSelector(state => state.review.page);
  const totalPages = useSelector(state => state.review.totalPages);

  useBodyClass('admin-page');

  useEffect(() => {
    dispatch(getReviewList({ page: 0 }));
  }, [dispatch]);

  const handleMarkAsBest = (itemId, reviewId) => {
    dispatch(markReviewAsBest({ itemId, reviewId }))
      .unwrap()
      .then(() => {
        dispatch(getReviewList({ page }));
      })
      .catch((error) => {
        console.error('Failed to mark review as best:', error);
      });
  };

  const handleUnmarkAsBest = (itemId, reviewId) => {
    dispatch(unmarkReviewAsBest({ itemId, reviewId }))
      .unwrap()
      .then(() => {
        dispatch(getReviewList({ page }));
      })
      .catch((error) => {
        console.error('Failed to unmark review as best:', error);
      });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      dispatch(deleteReview(reviewId))
        .unwrap()
        .then(() => {
          dispatch(getReviewList({ page }));
        })
        .catch((error) => {
          console.error('Failed to delete review:', error);
        });
    }
  };

  const handlePageChange = (event, value) => {
    dispatch(getReviewList({ page: value - 1 }));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid Date' : `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-review-container">
      <header>
        <AdminMenu />
      </header>
      {reviewDTO.length > 0 ? (
        <>
          <Table striped bordered hover className="review-table">
            <thead>
              <tr>
                <th>리뷰번호</th>
                <th>제품 이름</th>
                <th>제품 이미지</th>
                <th>평점</th>
                <th>리뷰 제목</th>
                <th>리뷰 내용</th>
                <th>리뷰 이미지</th>
                <th>리뷰 등록일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {reviewDTO.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.itemName}</td>
                  <td>
                    <img
                      src={review.itemImage}
                      alt={review.itemName}
                      style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                      onClick={() => navigate(`/item/${review.itemId}`)}
                    />
                  </td>
                  <td>{review.rating}</td>
                  <td className="truncate">{review.title}</td>
                  <td className="truncate">{review.content}</td>
                  <td>
                    {review.imageUrls && review.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Review ${review.id} - ${index}`}
                        style={{ width: '50px', height: '50px', marginRight: '5px', cursor: 'pointer' }}
                        onClick={() => navigate(`/item/${review.itemId}`)}
                      />
                    ))}
                  </td>
                  <td>{formatDate(review.createdAt)}</td>
                  <td className="actions">
                    <Button
                      variant="success"
                      onClick={() => handleMarkAsBest(review.itemId, review.id)}
                      disabled={review.best === true}
                    >
                      Best 리뷰로 지정
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleUnmarkAsBest(review.itemId, review.id)}
                      disabled={review.best !== true}
                    >
                      Best 리뷰 해제
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <CustomPagination total={totalPages} page={page + 1} changePage={handlePageChange} />
        </>
      ) : (
        <div className="no-reviews">리뷰가 존재하지 않습니다.</div>
      )}
    </div>
  );
};

export default AdminReview;
