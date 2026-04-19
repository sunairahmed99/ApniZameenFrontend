import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/banners';

// Async Thunks
export const fetchBanners = createAsyncThunk(
  'banner/fetchBanners',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createBanner = createAsyncThunk(
  'banner/createBanner',
  async (bannerData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, bannerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banner/updateBanner',
  async ({ id, bannerData }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bannerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banner/deleteBanner',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Slice
const bannerSlice = createSlice({
  name: 'banner',
  initialState: {
    banners: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners.unshift(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.banners.findIndex((banner) => banner._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners = state.banners.filter((banner) => banner._id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bannerSlice.actions;
export default bannerSlice.reducer;
