import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import ActivityTimeline from '../components/common/ActivityTimeline';
import { Phone, Mail, Calendar, Edit, Trash2, Eye, MessageSquare, FileText, MoreVertical } from 'lucide-react';

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock lead data
  const lead = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    company: 'ABC Corporation',
    jobTitle: 'CEO',
    status: 'New',
    leadSource: 'Web',
    leadScore: 85,
    notes: 'Great potential client with high budget. Follow up required.',
    owner: 'Jane Smith',
    createdDate: '2023-01-15',
    lastContact: '2023-01-20'
  };

  // Mock activities for this lead
  const activities = [
    {
      id: '1',
      type: 'call',
      title: 'Initial Call',
      description: 'Discussed requirements and budget',
      timestamp: '2 hours ago',
      user: 'Jane Smith'
    },
    {
      id: '2',
      type: 'email',
      title: 'Follow-up Email',
      description: 'Sent proposal document',
      timestamp: '1 day ago',
      user: 'Jane Smith'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Meeting Scheduled',
      description: 'Meeting scheduled for next week',
      timestamp: '2 days ago',
      user: 'John Doe'
    }
  ];

  // Tab configuration
  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-6">
          <Card title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.firstName} {lead.lastName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.jobTitle}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.company}</p>
              </div>
            </div>
          </Card>

          <Card title="Lead Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead Source</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.leadSource}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead Score</h3>
                <div className="mt-1 flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${lead.leadScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">{lead.leadScore}/100</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{lead.owner}</p>
              </div>
            </div>
          </Card>

          <Card title="Notes">
            <p className="text-sm text-gray-900 dark:text-white">{lead.notes}</p>
          </Card>
        </div>
      )
    },
    {
      id: 'activities',
      label: 'Activity Timeline',
      content: (
        <div className="space-y-6">
          <ActivityTimeline activities={activities} />
        </div>
      )
    },
    {
      id: 'related',
      label: 'Related Records',
      content: (
        <div className="space-y-6">
          <Card title="Related Contacts">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">Jane Cooper</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">jane.cooper@example.com</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Marketing Director</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">John Smith</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">john.smith@example.com</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">CTO</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Related Opportunities">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Opportunity</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Stage</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Close Date</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">ABC Corp Implementation</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Proposal</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">$50,000</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">2023-12-31</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-4">
              {lead.firstName} {lead.lastName} • {lead.company} • {lead.status} Lead
            </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Created: {lead.createdDate} • Last Contact: {lead.lastContact}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Convert
            </Button>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex space-x-6">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Convert
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="ghost" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Add File
          </Button>
        </div>
      </Card>

      <Tabs tabs={tabs} defaultActiveTab="details" />
    </div>
  );
};

export default LeadDetail;