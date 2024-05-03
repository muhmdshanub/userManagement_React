import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminAuthReducer from './slices/adminAuthSlice'; // Import the adminAuthSlice reducer
import { apiSlice } from './slices/apiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer, // Add the adminAuthSlice reducer to the store
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
