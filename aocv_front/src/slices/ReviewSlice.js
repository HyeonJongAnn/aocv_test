import { createSlice } from '@reduxjs/toolkit';
import { createReview, getReview, getReviewList, deleteReview, markReviewAsBest, unmarkReviewAsBest } from '../apis/reviewApi';

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    reviewDTO: [],
    loading: false,
    error: null,
    page: 0,
    totalPages: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDTO.push(action.payload);
        alert('리뷰가 등록되었습니다.');
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert('에러 발생: 리뷰 등록 중 문제가 발생했습니다.');
      })
      .addCase(getReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDTO = action.payload.pageItems?.content || [];
        state.page = action.payload.pageItems?.pageable?.pageNumber || 0;
        state.totalPages = action.payload.pageItems?.totalPages || 0;
      })
      .addCase(getReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: 후기를 불러오는 중 문제가 발생했습니다.");
      })
      .addCase(getReviewList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewList.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDTO = action.payload.item.content || [];
        state.page = action.payload.item.pageable.pageNumber;
        state.totalPages = action.payload.item.totalPages;
        state.totalElements = action.payload.item.totalElements;
      })
      .addCase(getReviewList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: 전체 리뷰를 불러오는 중 문제가 발생했습니다.");
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDTO = state.reviewDTO.filter(review => review.id !== action.payload);
        alert("리뷰가 삭제되었습니다.");
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: 리뷰 삭제 중 문제가 발생했습니다.");
      })
      .addCase(markReviewAsBest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markReviewAsBest.fulfilled, (state, action) => {
        state.loading = false;
        const reviewIndex = state.reviewDTO.findIndex(review => review.id === action.payload);
        if (reviewIndex !== -1) {
          state.reviewDTO[reviewIndex].isBest = true;
        }
        alert("Best 리뷰로 지정되었습니다.");
      })
      .addCase(markReviewAsBest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: Best 리뷰 지정 중 문제가 발생했습니다.");
      })
      .addCase(unmarkReviewAsBest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unmarkReviewAsBest.fulfilled, (state, action) => {
        state.loading = false;
        const reviewIndex = state.reviewDTO.findIndex(review => review.id === action.payload);
        if (reviewIndex !== -1) {
          state.reviewDTO[reviewIndex].isBest = false;
        }
        alert("Best 리뷰 해제되었습니다.");
      })
      .addCase(unmarkReviewAsBest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: Best 리뷰 해제 중 문제가 발생했습니다.");
      });
  },
});

export default reviewSlice.reducer;
