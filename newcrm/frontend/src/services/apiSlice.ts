import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // User endpoints
    getCurrentUser: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    getUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => `/users?page=${page}&limit=${limit}`,
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    // Lead endpoints
    getLeads: builder.query({
      query: ({ page = 1, limit = 10, search, status }) => {
        let url = `/leads?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Lead'],
    }),
    getLeadById: builder.query({
      query: (id) => `/leads/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
    }),
    createLead: builder.mutation({
      query: (lead) => ({
        url: '/leads',
        method: 'POST',
        body: lead,
      }),
      invalidatesTags: ['Lead'],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/leads/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lead', id }, 'Lead'],
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead'],
    }),
    
    // Opportunity endpoints
    getOpportunities: builder.query({
      query: () => '/opportunities',
      providesTags: ['Opportunity'],
    }),
    getOpportunityById: builder.query({
      query: (id) => `/opportunities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Opportunity', id }],
    }),
    createOpportunity: builder.mutation({
      query: (opportunity) => ({
        url: '/opportunities',
        method: 'POST',
        body: opportunity,
      }),
      invalidatesTags: ['Opportunity'],
    }),
    updateOpportunity: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/opportunities/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    
    // Contact endpoints
    getContacts: builder.query({
      query: () => '/contacts',
      providesTags: ['Contact'],
    }),
    getContactById: builder.query({
      query: (id) => `/contacts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contact', id }],
    }),
    createContact: builder.mutation({
      query: (contact) => ({
        url: '/contacts',
        method: 'POST',
        body: contact,
      }),
      invalidatesTags: ['Contact'],
    }),
    
    // Account endpoints
    getAccounts: builder.query({
      query: () => '/accounts',
      providesTags: ['Account'],
    }),
    getAccountById: builder.query({
      query: (id) => `/accounts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    createAccount: builder.mutation({
      query: (account) => ({
        url: '/accounts',
        method: 'POST',
        body: account,
      }),
      invalidatesTags: ['Account'],
    }),
    
    // Activity endpoints
    getActivities: builder.query({
      query: () => '/activities',
      providesTags: ['Activity'],
    }),
    getActivityById: builder.query({
      query: (id) => `/activities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Activity', id }],
    }),
    createActivity: builder.mutation({
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