import { api } from '../services/api';
import { Opportunity } from '../types';

const opportunityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOpportunities: builder.query<Opportunity[], void>({
      query: () => '/opportunities',
      providesTags: ['Opportunity'],
    }),
    getOpportunityById: builder.query<Opportunity, string>({
      query: (id) => `/opportunities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Opportunity', id }],
    }),
    createOpportunity: builder.mutation<Opportunity, Partial<Opportunity>>({
      query: (newOpportunity) => ({
        url: '/opportunities',
        method: 'POST',
        body: newOpportunity,
      }),
      invalidatesTags: ['Opportunity'],
    }),
    updateOpportunity: builder.mutation<Opportunity, { id: string } & Partial<Opportunity>>({
      query: ({ id, ...patch }) => ({
        url: `/opportunities/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Opportunity', id }, 'Opportunity'],
    }),
    deleteOpportunity: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/opportunities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Opportunity'],
    }),
  }),
});

export const {
  useGetOpportunitiesQuery,
  useGetOpportunityByIdQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
} = opportunityApi;