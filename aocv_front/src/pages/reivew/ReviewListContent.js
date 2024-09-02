import React from 'react';
import '../../scss/pages/item/ItemDetail.scss';
import ReviewListContentItem from './ReviewListContentItem';

const ReviewListContent = ({ reviews }) => {
  return (
    <>
      {reviews && reviews.map((review, index) => (
        <ReviewListContentItem key={index} review={review} />
      ))}
    </>
  );
};

export default ReviewListContent;
