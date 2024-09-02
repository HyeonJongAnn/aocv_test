import { createSlice } from '@reduxjs/toolkit';
import { getItemDetail, getItem, removeItem, addItem, modifyItem, getRandomItems } from '../apis/itemApi.js';

const itemSlice = createSlice({
  name: 'item',
  initialState: {
    itemDTO: [],
    searchCondition: '',
    searchKeyword: '',
    page: 0,
    sort: 'latest',
    itemId: null,
    randomItems1: [],
    randomItems2: [],
    currentItem: null,
    loading: false,
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
    setItemId: (state, action) => {
      state.itemId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getItemDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getItemDetail.fulfilled, (state, action) => {
      state.currentItem = action.payload;
      state.loading = false; 
      console.log("State updated with item:", action.payload); 
    });
    builder.addCase(getItemDetail.rejected, (state, action) => {
      state.loading = false; 
      alert("에러 발생: 상품을 불러오는 중 문제가 발생했습니다.");
      console.error("Error:", action.error.message);
    });

    builder.addCase(getItem.fulfilled, (state, action) => {
      state.itemDTO = action.payload.pageItems;
      state.searchCondition = action.payload.searchCondition;
      state.searchKeyword = action.payload.searchKeyword;
      state.page = action.payload.pageItems.pageable.pageNumber;
      state.sort = action.payload.sort;
    });

    builder.addCase(getItem.rejected, (state, action) => {
      alert("에러 발생: 상품을 불러오는 중 문제가 발생했습니다.");
      console.error(action.error);
      console.log(action.payload);
    });

    builder.addCase(addItem.fulfilled, (state, action) => {
      alert(`상품이 등록되었습니다.`);
    });

    builder.addCase(addItem.rejected, (state, action) => {
      alert("에러 발생: 상품 등록 중 문제가 발생했습니다.");
      console.error(action.error);
    });

    builder.addCase(modifyItem.fulfilled, (state, action) => {
      alert(`상품이 수정되었습니다.`);
    });

    builder.addCase(modifyItem.rejected, (state, action) => {
      alert("에러 발생: 상품 수정 중 문제가 발생했습니다.");
      console.error(action.error);
    });

    builder.addCase(removeItem.fulfilled, (state, action) => {
      alert("상품이 정상적으로 삭제되었습니다.");
      state.itemDTO = action.payload;
      state.page = 0;
      state.searchCondition = 'all';
      state.searchKeyword = '';
      state.sort = 'latest';
    });

    builder.addCase(removeItem.rejected, (state, action) => {
      alert("에러 발생: 상품 삭제 중 문제가 발생했습니다.");
      console.error(action.error);
    });

    builder.addCase(getRandomItems.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.key === 'randomItems1') {
        state.randomItems1 = action.payload.items;
      } else if (action.payload.key === 'randomItems2') {
        state.randomItems2 = action.payload.items;
      }
    });
  },
});

export const { change_searchCondition, change_searchKeyword, change_sort, setItemId } = itemSlice.actions;
export default itemSlice.reducer;
