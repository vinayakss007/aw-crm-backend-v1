import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Form, { FormField } from '../components/Form';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { opportunityService } from '../api';
import { Opportunity } from '../types/Opportunity';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState<Opportunity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = () => {
    setLoading(true);
    const opportunitiesData = opportunityService.getAll();
    setOpportunities(opportunitiesData);
    setLoading(false);
  };

  const columns = [
    { key: 'name', header: 'Opportunity', className: 'font-medium text-gray-900' },
    { key: 'company', header: 'Company' },
    { key: 'value', header: 'Value' },
    { key: 'stage', header: 'Stage' },
    { key: 'closeDate', header: 'Close Date' },
    { key: 'probability', header: 'Probability' },
  ];

  const handleAddOpportunity = () => {
    setCurrentOpportunity(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setCurrentOpportunity(opportunity);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    if (window.confirm(`Are you sure you want to delete ${opportunity.name}?`)) {
      opportunityService.delete(opportunity.id);
      loadOpportunities();
    }
  };

  const handleSubmit = (data: any) => {
    if (isEditing && currentOpportunity) {
      // Update existing opportunity
      opportunityService.update(currentOpportunity.id, data);
    } else {
      // Add new opportunity
      opportunityService.create(data);
    }
    setIsModalOpen(false);
    loadOpportunities();
  };

  const opportunityActions = (opportunity: Opportunity) => (
    <div className="flex space-x-2">
      <button 
        className="text-indigo-600 hover:text-indigo-900"
        onClick={() => handleEditOpportunity(opportunity)}
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button 
        className="text-red-600 hover:text-red-900"
        onClick={() => handleDeleteOpportunity(opportunity)}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );

  const opportunityFormFields: FormField[] = [
    { name: 'name', label: 'Opportunity Name', type: 'text', required: true },
    { name: 'company', label: 'Company', type: 'text', required: true },
    { name: 'value', label: 'Value', type: 'text', required: true },
    { 
      name: 'stage', 
      label: 'Stage', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Prospecting', label: 'Prospecting' },
        { value: 'Qualified', label: 'Qualified' },
        { value: 'Proposal', label: 'Proposal' },
        { value: 'Negotiation', label: 'Negotiation' },
        { value: 'Closed Won', label: 'Closed Won' },
        { value: 'Closed Lost', label: 'Closed Lost' },
      ]
    },
    { name: 'closeDate', label: 'Expected Close Date', type: 'date', required: true },
    { name: 'probability', label: 'Probability (%)', type: 'number', required: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <button 
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleAddOpportunity}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Opportunity
        </button>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Opportunities List</CardTitle>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search opportunities..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={opportunities.map(opp => ({
              ...opp,
              stage: (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  opp.stage === 'Closed Won' 
                    ? 'bg-green-100 text-green-800' 
                    : opp.stage === 'Proposal' || opp.stage === 'Negotiation'
                      ? 'bg-yellow-100 text-yellow-800' 
                      : opp.stage === 'Prospecting'
                        ? 'bg-blue-100 text-blue-800'
                        : opp.stage === 'Closed Lost'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                }`}>
                  {opp.stage}
                </span>
              )
            }))} 
            actions={opportunityActions}
          />
        </CardContent>
      </Card>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? "Edit Opportunity" : "Add New Opportunity"}
      >
        <Form
          title={isEditing ? "Edit Opportunity" : "Add New Opportunity"}
          fields={opportunityFormFields}
          initialValues={currentOpportunity || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Opportunities;