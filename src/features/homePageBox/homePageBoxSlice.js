import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/homepage-boxes';

// Async Thunks
export const fetchBoxes = createAsyncThunk(
    'homePageBox/fetchBoxes',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createBox = createAsyncThunk(
    'homePageBox/createBox',
    async (boxData, thunkAPI) => {
        try {
            const response = await axios.post(API_URL, boxData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateBox = createAsyncThunk(
    'homePageBox/updateBox',
    async ({ id, boxData }, thunkAPI) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, boxData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteBox = createAsyncThunk(
    'homePageBox/deleteBox',
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
const homePageBoxSlice = createSlice({
    name: 'homePageBox',
    initialState: {
        boxes: [],
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
            // Fetch
            .addCase(fetchBoxes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchBoxes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.boxes = action.payload;
            })
            .addCase(fetchBoxes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create
            .addCase(createBox.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createBox.fulfilled, (state, action) => {
                state.isLoading = false;
                state.boxes.push(action.payload);
                // Re-sort based on order if needed, but easier to just append for now or re-fetch
                state.boxes.sort((a, b) => a.order - b.order);
            })
            .addCase(createBox.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update
            .addCase(updateBox.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateBox.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.boxes.findIndex((box) => box._id === action.payload._id);
                if (index !== -1) {
                    state.boxes[index] = action.payload;
                    state.boxes.sort((a, b) => a.order - b.order);
                }
            })
            .addCase(updateBox.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete
            .addCase(deleteBox.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteBox.fulfilled, (state, action) => {
                state.isLoading = false;
                state.boxes = state.boxes.filter((box) => box._id !== action.payload);
            })
            .addCase(deleteBox.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = homePageBoxSlice.actions;
export default homePageBoxSlice.reducer;
