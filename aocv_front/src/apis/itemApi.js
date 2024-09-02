import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const getItemDetail = createAsyncThunk(
  'item/getItemDetail',
  async (itemId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
          }
        }
      );
      console.log(response.data);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const getItem = createAsyncThunk(
  'item/getItem',
  async (search, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/item/list`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
          },
          params: {
            searchCondition: search.searchCondition,
            searchKeyword: search.searchKeyword,
            page: search.page,
            sort: search.sort
          }
        }
      );
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const addItem = createAsyncThunk(
  'item/add-item',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/add-item`,
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const modifyItem = createAsyncThunk(
  'item/modify-item',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/modify`,
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeItem = createAsyncThunk(
  'item/removeitem',
  async (itemId, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/delete/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
          }
        }
      );

      return response.data.pageItems;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getRandomItems = createAsyncThunk(
  'item/getRandomItems',
  async (key, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/item/random-items`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
          },
        }
      );
      return { key, items: response.data.item };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
