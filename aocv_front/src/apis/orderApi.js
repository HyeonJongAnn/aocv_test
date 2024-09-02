import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/order?id=${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const confirmPayment = async (paymentKey, orderId, amount, orderInfo) => {
  const response = await fetch(`${API_URL}/payments/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
    },
    body: JSON.stringify({
      paymentKey: paymentKey,
      orderId: orderId,
      amount: amount,
      orderInfo: orderInfo
    })
  });
  if (!response.ok) {
    throw new Error('Payment confirmation failed');
  }
  return response.json();
};

export const fetchAddress = createAsyncThunk(
  'order/fetchAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      console.log(addressId)
      const response = await axios.get(`${API_URL}/order/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createRefundRequest = createAsyncThunk(
  'refund/createRefundRequest',
  async (refundRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/order/refund`, refundRequest, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRefundRequests = createAsyncThunk(
  'order/fetchRefundRequests',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/order/refund-requests?id=${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/order/${orderId}`, { status }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);