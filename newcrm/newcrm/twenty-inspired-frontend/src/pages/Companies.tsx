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
import { companyService } from '../api';
import { Company } from '../types/Company';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    setLoading(true);
    const companiesData = companyService.getAll();
    setCompanies(companiesData);
    setLoading(false);
  };

  const columns = [
    { key: 'name', header: 'Company', className: 'font-medium text-gray-900' },
    { key: 'industry', header: 'Industry' },
    { key: 'size', header: 'Size' },
    { key: 'revenue', header: 'Revenue' },
    { key: 'contacts', header: 'Contacts' },
  ];

  const handleAddCompany = () => {
    setCurrentCompany(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setCurrentCompany(company);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (company: Company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      companyService.delete(company.id);
      loadCompanies();
    }
  };

  const handleSubmit = (data: any) => {
    if (isEditing && currentCompany) {
      // Update existing company
      companyService.update(currentCompany.id, data);
    } else {
      // Add new company
      companyService.create(data);
    }
    setIsModalOpen(false);
    loadCompanies();
  };

  const companyActions = (company: Company) => (
    <div className="flex space-x-2">
      <button 
        className="text-indigo-600 hover:text-indigo-900"
        onClick={() => handleEditCompany(company)}
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button 
        className="text-red-600 hover:text-red-900"
        onClick={() => handleDeleteCompany(company)}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );

  const companyFormFields: FormField[] = [
    { name: 'name', label: 'Company Name', type: 'text', required: true },
    { 
      name: 'industry', 
      label: 'Industry', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Technology', label: 'Technology' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Consulting', label: 'Consulting' },
      ]
    },
    { 
      name: 'size', 
      label: 'Company Size', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Small', label: 'Small (1-50)' },
        { value: 'Medium', label: 'Medium (51-200)' },
        { value: 'Large', label: 'Large (201+)' },
      ]
    },
    { name: 'revenue', label: 'Annual Revenue', type: 'text', required: true },
    { name: 'contacts', label: 'Number of Contacts', type: 'number', required: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading companies...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <button 
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleAddCompany}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Company
        </button>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Companies List</CardTitle>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={companies} 
            actions={companyActions}
          />
        </CardContent>
      </Card>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? "Edit Company" : "Add New Company"}
      >
        <Form
          title={isEditing ? "Edit Company" : "Add New Company"}
          fields={companyFormFields}
          initialValues={currentCompany || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Companies;