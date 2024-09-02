import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const createReview = createAsyncThunk(
  'review/createReview',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/review/add-review`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.item;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getReview = createAsyncThunk(
  'review/getReview',
  async (reviewDTO, thunkAPI) => {
    const itemId = reviewDTO.itemId;
    try {
      const response = await axios.get(
        `${API_URL}/review/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
          },
          params: {
            page: reviewDTO.page
          }
        }
      );
      console.log('API Response:', response.data); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getReviewList = createAsyncThunk(
  'review/getReviewList',
  async (reviewDTO, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/admin/review/list`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
        },
        params: {
          page: reviewDTO.page
        }
      });
      console.log('API Response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId, thunkAPI) => {
    try {
      await axios.delete(
        `${API_URL}/review/delete/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
          }
        }
      );
      return reviewId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const markReviewAsBest = createAsyncThunk(
  'review/markReviewAsBest',
  async ({ itemId, reviewId }, thunkAPI) => {
    try {
      await axios.post(
        `${API_URL}/review/mark-best/${itemId}/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
          }
        }
      );
      return reviewId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const unmarkReviewAsBest = createAsyncThunk(
  'review/unmarkReviewAsBest',
  async ({ itemId, reviewId }, thunkAPI) => {
    try {
      await axios.post(
        `${API_URL}/review/unmark-best/${itemId}/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
          }
        }
      );
      return reviewId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
