import React, { useState } from 'react';
import { useGetOpportunitiesQuery, useCreateOpportunityMutation, useUpdateOpportunityMutation, useDeleteOpportunityMutation } from '../services/opportunityApi';
import { Opportunity } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Opportunities: React.FC = () => {
  const { data: opportunities = [], isLoading, isError } = useGetOpportunitiesQuery();
  const [createOpportunity] = useCreateOpportunityMutation();
  const [updateOpportunity] = useUpdateOpportunityMutation();
  const [deleteOpportunity] = useDeleteOpportunityMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: 0,
    probability: 50,
    stage: 'prospecting',
    closeDate: '',
    accountId: '',
    leadId: '',
    status: 'open' as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' || name === 'probability' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOpportunity) {
        await updateOpportunity({ id: editingOpportunity.id, ...formData }).unwrap();
        toast.success('Opportunity updated successfully');
      } else {
        await createOpportunity(formData).unwrap();
        toast.success('Opportunity created successfully');
      }
      
      setIsModalOpen(false);
      setEditingOpportunity(null);
      setFormData({
        name: '',
        description: '',
        amount: 0,
        probability: 50,
        stage: 'prospecting',
        closeDate: '',
        accountId: '',
        leadId: '',
        status: 'open',
      });
    } catch (error) {
      toast.error('Failed to save opportunity');
      console.error('Error saving opportunity:', error);
    }
  };

  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({
      name: opportunity.name,
      description: opportunity.description || '',
      amount: opportunity.amount || 0,
      probability: opportunity.probability,
      stage: opportunity.stage,
      closeDate: opportunity.closeDate || '',
      accountId: opportunity.accountId,
      leadId: opportunity.leadId || '',
      status: opportunity.status as any,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await deleteOpportunity(id).unwrap();
        toast.success('Opportunity deleted successfully');
      } catch (error) {
        toast.error('Failed to delete opportunity');
        console.error('Error deleting opportunity:', error);
      }
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity => 
    opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opportunity.description && opportunity.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (opportunity.account?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="spinner"></div></div>;
  if (isError) return <div className="text-center text-red-500">Error loading opportunities</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Opportunities</h1>
        <button
          onClick={() => {
            setEditingOpportunity(null);
            setFormData({
              name: '',
              description: '',
              amount: 0,
              probability: 50,
              stage: 'prospecting',
              closeDate: '',
              accountId: '',
              leadId: '',
              status: 'open',
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Opportunity
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOpportunities.map((opportunity) => (
            <li key={opportunity.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600 truncate">
                    {opportunity.name}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      opportunity.status === 'open' ? 'bg-blue-100 text-blue-800' :
                      opportunity.status === 'won' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {opportunity.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mr-6 flex items-center text-sm text-gray-500">
                      <span>{opportunity.account?.name || 'No Account'}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span>${opportunity.amount?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span>{opportunity.probability}%</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(opportunity)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(opportunity.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Add/Edit Opportunity */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Opportunity Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                              Amount ($)
                            </label>
                            <input
                              type="number"
                              name="amount"
                              id="amount"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.amount}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                          <div>
                            <label htmlFor="probability" className="block text-sm font-medium text-gray-700">
                              Probability (%)
                            </label>
                            <input
                              type="number"
                              name="probability"
                              id="probability"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.probability}
                              onChange={handleInputChange}
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                              Stage
                            </label>
                            <select
                              name="stage"
                              id="stage"
                              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.stage}
                              onChange={handleInputChange}
                            >
                              <option value="prospecting">Prospecting</option>
                              <option value="qualification">Qualification</option>
                              <option value="needs_analysis">Needs Analysis</option>
                              <option value="value_proposition">Value Proposition</option>
                              <option value="decision_makers">Decision Makers</option>
                              <option value="proposal">Proposal</option>
                              <option value="negotiation">Negotiation</option>
                              <option value="closed_won">Closed Won</option>
                              <option value="closed_lost">Closed Lost</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              name="status"
                              id="status"
                              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.status}
                              onChange={handleInputChange}
                            >
                              <option value="open">Open</option>
                              <option value="won">Won</option>
                              <option value="lost">Lost</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="closeDate" className="block text-sm font-medium text-gray-700">
                              Close Date
                            </label>
                            <input
                              type="date"
                              name="closeDate"
                              id="closeDate"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.closeDate}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                              Account ID
                            </label>
                            <input
                              type="text"
                              name="accountId"
                              id="accountId"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.accountId}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="leadId" className="block text-sm font-medium text-gray-700">
                            Lead ID
                          </label>
                          <input
                            type="text"
                            name="leadId"
                            id="leadId"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.leadId}
                            onChange={handleInputChange}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;