import { api } from '../services/api';
import { Lead } from '../types';

const leadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<Lead[], void>({
      query: () => '/leads',
      providesTags: ['Lead'],
    }),
    getLeadById: builder.query<Lead, string>({
      query: (id) => `/leads/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
    }),
    createLead: builder.mutation<Lead, Partial<Lead>>({
      query: (newLead) => ({
        url: '/leads',
        method: 'POST',
        body: newLead,
      }),
      invalidatesTags: ['Lead'],
    }),
    updateLead: builder.mutation<Lead, { id: string } & Partial<Lead>>({
      query: ({ id, ...patch }) => ({
        url: `/leads/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lead', id }, 'Lead'],
    }),
    deleteLead: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead'],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = leadApi;