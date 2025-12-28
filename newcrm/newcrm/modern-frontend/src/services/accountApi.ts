import { api } from '../services/api';
import { Account } from '../types';

const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => '/accounts',
      providesTags: ['Account'],
    }),
    getAccountById: builder.query<Account, string>({
      query: (id) => `/accounts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    createAccount: builder.mutation<Account, Partial<Account>>({
      query: (newAccount) => ({
        url: '/accounts',
        method: 'POST',
        body: newAccount,
      }),
      invalidatesTags: ['Account'],
    }),
    updateAccount: builder.mutation<Account, { id: string } & Partial<Account>>({
      query: ({ id, ...patch }) => ({
        url: `/accounts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Account', id }, 'Account'],
    }),
    deleteAccount: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetAccountByIdQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountApi;