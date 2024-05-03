import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminInfo: localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      state.adminInfo = action.payload;
      localStorage.setItem('adminInfo', JSON.stringify(action.payload));
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      localStorage.removeItem('adminInfo');
    },
  },
});

export const { setAdminCredentials, logoutAdmin } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
