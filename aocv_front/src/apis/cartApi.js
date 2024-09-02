import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart/items?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      console.log(response.data);
      const cartItems = response.data.item.cartItems.map((item) => {
        return {
          itemId: item.itemId,
          id: item.id,
          itemName: item.itemName, 
          petName: item.petName,
          price: item.price,
          checked: false,
          imageUrl: item.productImages[0],
          quantity: item.quantity,
          optionId: item.optionId
        };
      });
      return cartItems;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCartItem = createAsyncThunk(
    'cart/addCartItem',
    async ({ userId, cartItem }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${API_URL}/cart/add-item`,
          { userId, cartItems: [cartItem] },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ userId, updatedItem }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/update-item?userId=${userId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
          }
        }
      );
      return response.data.item;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ userId, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/cart/delete-items?userId=${userId}`, {
        data: [id],
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSelectedCartItems = createAsyncThunk(
  'cart/deleteSelectedCartItems',
  async ({ userId, selectedIds }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/cart/delete-items?userId=${userId}`, {
        data: selectedIds,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      return selectedIds;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);