import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  User,
  Lead,
  Opportunity,
  Contact,
  Account,
  Activity,
  ApiResponse,
  PaginatedResponse
} from '../types';

// Define the base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }: any) => {
      // Get token from auth state
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Lead', 'Opportunity', 'Contact', 'Account', 'Activity'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<ApiResponse<{ user: User; token: string; refreshToken: string }>, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<{ user: User; token: string; refreshToken: string }>, { email: string; password: string; firstName: string; lastName: string }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // User endpoints
    getCurrentUser: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    getUsers: builder.query<PaginatedResponse<User>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/users?page=${page}&limit=${limit}`,
      providesTags: ['User'],
    }),
    getUserById: builder.query<ApiResponse<{ user: User }>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<ApiResponse<{ user: User }>, { id: string; firstName?: string; lastName?: string; role?: string }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // Lead endpoints
    getLeads: builder.query<PaginatedResponse<Lead>, { page?: number; limit?: number; search?: string; status?: string }>({
      query: ({ page = 1, limit = 10, search, status }) => {
        let url = `/leads?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Lead'],
    }),
    getLeadById: builder.query<ApiResponse<{ lead: Lead }>, string>({
      query: (id) => `/leads/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
    }),
    createLead: builder.mutation<ApiResponse<{ lead: Lead }>, Partial<Lead>>({
      query: (lead) => ({
        url: '/leads',
        method: 'POST',
        body: lead,
      }),
      invalidatesTags: ['Lead'],
    }),
    updateLead: builder.mutation<ApiResponse<{ lead: Lead }>, { id: string; [key: string]: any }>({
      query: ({ id, ...patch }) => ({
        url: `/leads/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lead', id }, 'Lead'],
    }),
    deleteLead: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead'],
    }),

    // Opportunity endpoints
    getOpportunities: builder.query<ApiResponse<Opportunity[]>, void>({
      query: () => '/opportunities',
      providesTags: ['Opportunity'],
    }),
    getOpportunityById: builder.query<ApiResponse<{ opportunity: Opportunity }>, string>({
      query: (id) => `/opportunities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Opportunity', id }],
    }),
    createOpportunity: builder.mutation<ApiResponse<{ opportunity: Opportunity }>, Partial<Opportunity>>({
      query: (opportunity) => ({
        url: '/opportunities',
        method: 'POST',
        body: opportunity,
      }),
      invalidatesTags: ['Opportunity'],
    }),
    updateOpportunity: builder.mutation<ApiResponse<{ opportunity: Opportunity }>, { id: string; [key: string]: any }>({
      query: ({ id, ...patch }) => ({
        url: `/opportunities/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),

    // Contact endpoints
    getContacts: builder.query<ApiResponse<Contact[]>, void>({
      query: () => '/contacts',
      providesTags: ['Contact'],
    }),
    getContactById: builder.query<ApiResponse<{ contact: Contact }>, string>({
      query: (id) => `/contacts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contact', id }],
    }),
    createContact: builder.mutation<ApiResponse<{ contact: Contact }>, Partial<Contact>>({
      query: (contact) => ({
        url: '/contacts',
        method: 'POST',
        body: contact,
      }),
      invalidatesTags: ['Contact'],
    }),

    // Account endpoints
    getAccounts: builder.query<ApiResponse<Account[]>, void>({
      query: () => '/accounts',
      providesTags: ['Account'],
    }),
    getAccountById: builder.query<ApiResponse<{ account: Account }>, string>({
      query: (id) => `/accounts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    createAccount: builder.mutation<ApiResponse<{ account: Account }>, Partial<Account>>({
      query: (account) => ({
        url: '/accounts',
        method: 'POST',
        body: account,
      }),
      invalidatesTags: ['Account'],
    }),

    // Activity endpoints
    getActivities: builder.query<ApiResponse<Activity[]>, void>({
      query: () => '/activities',
      providesTags: ['Activity'],
    }),
    getActivityById: builder.query<ApiResponse<{ activity: Activity }>, string>({
      query: (id) => `/activities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Activity', id }],
    }),
    createActivity: builder.mutation<ApiResponse<{ activity: Activity }>, Partial<Activity>>({
      query: (activity) => ({
        url: '/activities',
        method: 'POST',
        body: activity,
      }),
      invalidatesTags: ['Activity'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetOpportunitiesQuery,
  useGetOpportunityByIdQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useGetAccountsQuery,
  useGetAccountByIdQuery,
  useCreateAccountMutation,
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
} = apiSlice;