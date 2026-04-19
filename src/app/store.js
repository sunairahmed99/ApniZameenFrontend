import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import bannerReducer from '../features/banner/bannerSlice';
import homePageBoxReducer from '../features/homePageBox/homePageBoxSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banner: bannerReducer,
    homePageBox: homePageBoxReducer,
  },
});
