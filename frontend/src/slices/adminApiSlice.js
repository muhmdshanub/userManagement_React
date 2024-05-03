import { apiSlice } from './apiSlice';
const ADMIN_URL = '/api/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: 'POST',
      }),
    }),
    registerAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    getAllUsers: builder.query({
        query: ( {page, search} ) => ({
          url: `${ADMIN_URL}/users?page=${page}&search=${search}`,
          method: 'GET',
        }),
      }),
    getSingleUser: builder.query({
      query: (userId) => ({
        url: `${ADMIN_URL}/users/${userId}`,
        method: 'GET',
      }),
    }),
    addUserFromAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/users/add`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUserFromAdmin: builder.mutation({
      query: ({ userId, data }) => ({
        url: `${ADMIN_URL}/users/edit/${userId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${ADMIN_URL}/users/delete/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useRegisterAdminMutation,
  useGetSingleUserQuery,
  useGetAllUsersQuery,
  useAddUserFromAdminMutation,
  useUpdateUserFromAdminMutation,
  useDeleteUserMutation,
} = adminApiSlice;
