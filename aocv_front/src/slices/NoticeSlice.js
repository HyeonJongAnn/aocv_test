import { createSlice } from '@reduxjs/toolkit';
import { addNotice, getNoticeList, getNoticeDetail, modifyNotice, deleteNotice } from '../apis/noticeApi';

const noticeSlice = createSlice({
  name: 'notice',
  initialState: {
    noticeDTO: [],
    loading: false,
    currentNotice: null,
    error: null,
    page: 0,
    totalPages: 0,
    searchCondition: '',
    searchKeyword: '',
    sort: 'latest',
  },
  reducers: {
    change_searchCondition: (state, action) => {
      state.searchCondition = action.payload;
    },
    change_searchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    change_sort: (state, action) => {
      state.sort = action.payload;
    },
    setNoticeId: (state, action) => {
      state.noticeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.noticeDTO.push(action.payload);
        alert('공지사항이 등록되었습니다.');
      })
      .addCase(addNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert('에러 발생: 공지사항 등록 중 문제가 발생했습니다.');
      })
      .addCase(getNoticeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNoticeList.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.pageItems && payload.pageItems.content) {
          state.noticeDTO = payload.pageItems.content;
          state.page = payload.pageItems.pageable.pageNumber;
          state.totalPages = payload.pageItems.totalPages;
          state.totalElements = payload.pageItems.totalElements;
        }
        state.searchCondition = payload.searchCondition;
        state.searchKeyword = payload.searchKeyword;
        state.sort = payload.sort;
      })
      .addCase(getNoticeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: 공지사항을 불러오는 중 문제가 발생했습니다.");
      })
      .addCase(getNoticeDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNoticeDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotice = action.payload;
      })
      .addCase(getNoticeDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: 공지사항 상세 정보를 불러오는 중 문제가 발생했습니다.");
      })
      .addCase(modifyNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modifyNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotice = action.payload;
        alert('공지사항이 수정되었습니다.');
      })
      .addCase(modifyNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: 공지사항 수정 중 문제가 발생했습니다.");
      })
      .addCase(deleteNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotice = null;
        alert('공지사항이 삭제되었습니다.');
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("에러 발생: 공지사항 삭제 중 문제가 발생했습니다.");
      });
  },
});
export const { change_searchCondition, change_searchKeyword, change_sort, setNoticeId } = noticeSlice.actions;
export default noticeSlice.reducer;