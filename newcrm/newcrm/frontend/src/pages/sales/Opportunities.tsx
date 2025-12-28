import React, { useState } from 'react';
import { useGetOpportunitiesQuery, useCreateOpportunityMutation } from '../services/apiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import KanbanBoard from '../components/common/KanbanBoard';
import { Plus, Search, Filter, Download, Upload, List, Columns } from 'lucide-react';

const Opportunities: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban'); // Default to kanban view
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const { data: opportunities, isLoading, error, refetch } = useGetOpportunitiesQuery();
  const [createOpportunity, { isLoading: isCreating }] = useCreateOpportunityMutation();

  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    description: '',
    accountId: '',
    contactId: '',
    stage: 'prospecting',
    probability: 25,
    amount: 0,
    currency: 'USD',
    closeDate: '',
    type: 'New Business'
  });

  const handleCreateOpportunity = async () => {
    try {
      await createOpportunity(newOpportunity).unwrap();
      setNewOpportunity({
        name: '',
        description: '',
        accountId: '',
        contactId: '',
        stage: 'prospecting',
        probability: 25,
        amount: 0,
        currency: 'USD',
        closeDate: '',
        type: 'New Business'
      });
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to create opportunity:', err);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleMoveOpportunity = (itemId: string, fromColumn: string, toColumn: string) => {
    console.log(`Moving opportunity ${itemId} from ${fromColumn} to ${toColumn}`);
    // In a real app, this would update the opportunity's stage
  };

  const handleAddToColumn = (columnId: string) => {
    setNewOpportunity({...newOpportunity, stage: columnId});
    setShowCreateModal(true);
  };

  // Define pipeline stages
  const pipelineStages = [
    { id: 'prospecting', name: 'Prospecting' },
    { id: 'qualification', name: 'Qualification' },
    { id: 'proposal', name: 'Proposal' },
    { id: 'negotiation', name: 'Negotiation' },
    { id: 'closed-won', name: 'Closed Won' },
    { id: 'closed-lost', name: 'Closed Lost' },
  ];

  // Mock data since we don't have real data yet
  const mockOpportunities = [
    {
      id: '1',
      name: 'Acme Manufacturing Contract',
      accountId: 'Account 1',
      contactId: 'Contact 1',
      stage: 'proposal',
      probability: 25,
      amount: 500000,
      currency: 'USD',
      closeDate: '2023-12-31',
      type: 'New Business',
      owner: 'John Smith'
    },
    {
      id: '2',
      name: 'XYZ Services Deal',
      accountId: 'Account 2',
      contactId: 'Contact 2',
      stage: 'negotiation',
      probability: 75,
      amount: 250000,
      currency: 'USD',
      closeDate: '2023-11-15',
      type: 'New Business',
      owner: 'Jane Doe'
    },
    {
      id: '3',
      name: 'ABC Tech Project',
      accountId: 'Account 3',
      contactId: 'Contact 3',
      stage: 'qualification',
      probability: 40,
      amount: 150000,
      currency: 'USD',
      closeDate: '2023-10-30',
      type: 'New Business',
      owner: 'Mike Johnson'
    }
  ];

  // Group opportunities by stage for Kanban view
  const kanbanColumns = pipelineStages.map(stage => ({
    id: stage.id,
    title: stage.name,
    items: mockOpportunities.filter(opp => opp.stage === stage.id)
  }));

  const columns = [
    { key: 'name', title: 'Opportunity', sortable: true },
    { key: 'accountId', title: 'Account', sortable: true },
    { key: 'contactId', title: 'Contact', sortable: true },
    { key: 'stage', title: 'Stage', sortable: true },
    { key: 'probability', title: 'Probability', sortable: true },
    { key: 'amount', title: 'Amount', sortable: true },
    { key: 'closeDate', title: 'Close Date', sortable: true },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">Error loading opportunities data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunities Management</h1>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search opportunities..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              label="Stage"
              value={selectedStage || ''}
              onChange={(value) => setSelectedStage(value || null)}
              options={[
                { value: '', label: 'All Stages' },
                ...pipelineStages.map(stage => ({ value: stage.id, label: stage.name }))
              ]}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <Columns className="h-4 w-4 mr-1" />
              Board
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Opportunity
            </Button>
          </div>
        </div>
      </Card>

      {/* Opportunities View */}
      {viewMode === 'table' ? (
        <Card>
          <DataTable
            columns={columns}
            data={opportunities || mockOpportunities}
            loading={isLoading}
            onSort={handleSort}
            currentSort={sortConfig}
            onRowClick={(opportunity) => console.log('Opportunity clicked:', opportunity)}
          />
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <KanbanBoard
            columns={kanbanColumns}
            onMoveItem={handleMoveOpportunity}
            onAddItem={handleAddToColumn}
          />
        </Card>
      )}

      {/* Create Opportunity Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Opportunity"
      >
        <div className="space-y-4">
          <Input
            label="Opportunity Name"
            value={newOpportunity.name}
            onChange={(e) => setNewOpportunity({...newOpportunity, name: e.target.value})}
            required
          />

          <Input
            label="Description"
            value={newOpportunity.description}
            onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
          />

          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="Account ID"
              value={newOpportunity.accountId}
              onChange={(e) => setNewOpportunity({...newOpportunity, accountId: e.target.value})}
            />
            <Input
              label="Contact ID"
              value={newOpportunity.contactId}
              onChange={(e) => setNewOpportunity({...newOpportunity, contactId: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Select
              label="Stage"
              value={newOpportunity.stage}
              onChange={(value) => setNewOpportunity({...newOpportunity, stage: value})}
              options={pipelineStages.map(stage => ({
                value: stage.id,
                label: stage.name
              }))}
            />
            <Select
              label="Type"
              value={newOpportunity.type}
              onChange={(value) => setNewOpportunity({...newOpportunity, type: value})}
              options={[
                { value: 'New Business', label: 'New Business' },
                { value: 'Existing Business', label: 'Existing Business' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              label="Probability (%)"
              type="number"
              value={newOpportunity.probability}
              onChange={(e) => setNewOpportunity({...newOpportunity, probability: parseInt(e.target.value) || 0})}
            />
            <Input
              label="Amount"
              type="number"
              value={newOpportunity.amount}
              onChange={(e) => setNewOpportunity({...newOpportunity, amount: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <Select
              label="Currency"
              value={newOpportunity.currency}
              onChange={(value) => setNewOpportunity({...newOpportunity, currency: value})}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
                { value: 'JPY', label: 'JPY' },
              ]}
            />
            <Input
              label="Close Date"
              type="date"
              value={newOpportunity.closeDate}
              onChange={(e) => setNewOpportunity({...newOpportunity, closeDate: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOpportunity}
            loading={isCreating}
            disabled={isCreating}
          >
            Create Opportunity
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Opportunities;