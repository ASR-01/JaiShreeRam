// src/services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { login, logout } from '../features/authSlice';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://api.adityasinghrawat.com/api/v1",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: "/register",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),

    VerifyUser: builder.mutation({
      query: (user) => {
        return {
          url: "/verify",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),

    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: "/login",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        };
      },
    }),

    Profile: builder.query({
      query: () => {
        return {
          url: "/profile",
          method: "GET",
          credentials: "include",
        };
      },
    }),

    logout: builder.mutation({
      query: () => {
        return {
          url: "/logout",
          body: {},
          method: "POST",
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyUserMutation,
  useLoginUserMutation,
  useProfileQuery,
  useLogoutMutation,
} = authApi;
