import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // 백엔드 API 엔드포인트



export const signup = createAsyncThunk(
  "user/signup",
  async (user, thunkAPI) => {
    try {
        // console.log(user);
      const response = await axios.post(`${API_URL}/user/sign-up`, user);
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const signin = createAsyncThunk(
  "user/signin",
  async (user , thunkAPI) => {
    try {
        // console.log(user);
      const response = await axios.post(`${API_URL}/user/sign-in`, user);

      // sessionStorage.setItem("ACCESS_TOKEN", user.token);
      // console.log(user.token)
      return response.data.item;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const signout = createAsyncThunk(
  "user/signout",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/user/sign-out`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      return { success: true }; // 성공 여부만 리턴
    } catch (e) {
      return thunkAPI.rejectWithValue({ success: false, error: e.message }); // 에러 메시지만 리턴
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("ACCESS_TOKEN");
      const response = await axios.post(`${API_URL}/user/delete`, { userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  }
);

export const getUserAddress = createAsyncThunk(
  "user/getUserAddress",
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("ACCESS_TOKEN");
      console.log("Access token from sessionStorage:", token); // 여기서 토큰 값 확인

      const response = await axios.get(`${API_URL}/user/get-address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  "user/updateUserAddress",
  async (user, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/user/update-address`, user, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserPoints = createAsyncThunk(
  "user/getUserPoints",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/user/points?id=${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
