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
import { contactService } from '../api';
import { Contact } from '../types/Contact';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    setLoading(true);
    const contactsData = contactService.getAll();
    setContacts(contactsData);
    setLoading(false);
  };

  const columns = [
    { key: 'name', header: 'Name', className: 'font-medium text-gray-900' },
    { key: 'email', header: 'Email' },
    { key: 'company', header: 'Company' },
    { key: 'position', header: 'Position' },
    { key: 'status', header: 'Status' },
  ];

  const handleAddContact = () => {
    setCurrentContact(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      contactService.delete(contact.id);
      loadContacts();
    }
  };

  const handleSubmit = (data: any) => {
    if (isEditing && currentContact) {
      // Update existing contact
      contactService.update(currentContact.id, data);
    } else {
      // Add new contact
      contactService.create(data);
    }
    setIsModalOpen(false);
    loadContacts();
  };

  const contactActions = (contact: Contact) => (
    <div className="flex space-x-2">
      <button 
        className="text-indigo-600 hover:text-indigo-900"
        onClick={() => handleEditContact(contact)}
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button 
        className="text-red-600 hover:text-red-900"
        onClick={() => handleDeleteContact(contact)}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );

  const contactFormFields: FormField[] = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'company', label: 'Company', type: 'text', required: true },
    { name: 'position', label: 'Position', type: 'text', required: true },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Lead', label: 'Lead' },
      ]
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <button 
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleAddContact}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contacts List</CardTitle>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contacts..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={contacts.map(contact => ({
              ...contact,
              status: (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  contact.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : contact.status === 'Lead' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  {contact.status}
                </span>
              )
            }))} 
            actions={contactActions}
          />
        </CardContent>
      </Card>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? "Edit Contact" : "Add New Contact"}
      >
        <Form
          title={isEditing ? "Edit Contact" : "Add New Contact"}
          fields={contactFormFields}
          initialValues={currentContact || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Contacts;