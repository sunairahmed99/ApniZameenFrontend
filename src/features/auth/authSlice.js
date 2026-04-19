import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/auth';

// Register seller
export const register = createAsyncThunk('auth/register', async (sellerData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/register`, sellerData);
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Invalid email or password' : 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Verify email
export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (verifyData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/verify-email`, verifyData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Invalid email or password' : 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Resend verification email
export const resendVerification = createAsyncThunk('auth/resendVerification', async (emailData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/resend-verification`, emailData);
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Login seller
export const login = createAsyncThunk('auth/login', async (sellerData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/login`, sellerData);
        if (response.data && !response.data.otpRequired) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Invalid email or password' : 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Google Login
export const googleLogin = createAsyncThunk('auth/googleLogin', async (tokenData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/google-login`, tokenData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Verify Admin OTP
export const verifyAdminOTP = createAsyncThunk('auth/verifyAdminOTP', async (otpData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/verify-admin-otp`, otpData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Invalid email or password' : 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Update Profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (sellerData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/update-profile`, sellerData, config);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Unauthorized' : 'Server error';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Change Password
export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(`${API_URL}/change-password`, passwordData, config);
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Unauthorized' : 'Server error';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Get current seller
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/me`, config);
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Unauthorized' : 'Server error';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout seller
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('seller');
});

// Forgot password
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (emailData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, emailData);
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Invalid email or password' : 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// Reset password
export const resetPassword = createAsyncThunk('auth/resetPassword', async (resetData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, resetData);
        return response.data;
    } catch (error) {
        let message = error.response?.data?.message || error.response?.data || error.message;
        if (typeof message === 'string' && message.includes('<!DOCTYPE html>')) {
            message = error.response?.status === 401 ? 'Invalid email or password' : 'Server error. Please try again.';
        }
        return thunkAPI.rejectWithValue(message);
    }
});

const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('seller'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    otpRequired: false,
    tempEmail: '', // For OTP flow
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        resetOTP: (state) => {
            state.otpRequired = false;
            state.tempEmail = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tempEmail = action.payload.email;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.otpRequired) {
                    state.otpRequired = true;
                    state.tempEmail = action.payload.email;
                } else {
                    state.isSuccess = true;
                    state.user = action.payload;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(verifyEmail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(resendVerification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resendVerification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(resendVerification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(verifyAdminOTP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyAdminOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.otpRequired = false;
            })
            .addCase(verifyAdminOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tempEmail = action.meta.arg.email;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Merge new seller data (payload) with existing seller data (to keep token if not in payload)
                const updatedUser = { ...state.user, ...action.payload };
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                state.message = 'Profile updated successfully';
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Merge new seller data (payload) with existing seller data (to keep token if not in payload)
                const updatedUser = { ...state.user, ...action.payload };
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
            });
    },
});

export const { reset, resetOTP } = authSlice.actions;
export default authSlice.reducer;
