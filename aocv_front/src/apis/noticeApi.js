import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const addNotice = createAsyncThunk(
    'notice/addNotice',
    async (formData, thunkAPI) => {
      try {
        const response = await axios.post(
          `${API_URL}/notice/create`,
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

  export const getNoticeList = createAsyncThunk(
    'notice/getNoticeList',
    async (noticeDTO, thunkAPI) => {
      try {
        const response = await axios.get(`${API_URL}/notice/list`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
          },
          params: {
            page: noticeDTO.page,
            searchCondition: noticeDTO.searchCondition,
            searchKeyword: noticeDTO.searchKeyword,
            sort: noticeDTO.sort,
          },
        });
        console.log('API Response:', response.data); 
        return response.data;
      } catch (error) {
        console.error('API Error:', error);
        return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );
  

  export const getNoticeDetail = createAsyncThunk(
    'notice/getNoticeDetail',
    async (id, thunkAPI) => {
      try {
        const response = await axios.get(`${API_URL}/notice/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
          },
        });
        return response.data.item;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );

  export const modifyNotice = createAsyncThunk(
    'notice/modifyNotice',
    async (formData, thunkAPI) => {
      try {
        const response = await axios.put(
          `${API_URL}/notice/modify`,
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

  export const deleteNotice = createAsyncThunk(
    'notice/deleteNotice',
    async (id, thunkAPI) => {
      try {
        const response = await axios.delete(`${API_URL}/notice/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
          },
        });
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );