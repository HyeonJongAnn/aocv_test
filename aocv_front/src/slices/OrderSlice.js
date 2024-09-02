import { createSlice } from '@reduxjs/toolkit';
import { fetchAddress, fetchOrders, fetchRefundRequests, updateOrderStatus } from '../apis/orderApi';

const OrderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    refundRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.orders = [];
      state.refundRequests = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRefundRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefundRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.refundRequests = action.payload;
      })
      .addCase(fetchRefundRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = OrderSlice.actions;

export default OrderSlice.reducer;