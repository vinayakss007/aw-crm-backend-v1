import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define the base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1', // Update this to match your backend URL
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Account',
    'Contact',
    'Lead',
    'Opportunity',
    'Activity',
    'Role',
    'Permission',
    'CustomField',
    'AuditLog',
  ],
  endpoints: () => ({}),
});