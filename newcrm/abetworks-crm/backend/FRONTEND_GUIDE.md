# ABETWORKS CRM Frontend Development Guide

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [UI/UX Design System](#uiux-design-system)
5. [Authentication Flow](#authentication-flow)
6. [Dashboard Layout](#dashboard-layout)
7. [Feature-Specific Interfaces](#feature-specific-interfaces)
8. [Admin Panel](#admin-panel)
9. [Customer Interface](#customer-interface)
10. [Settings](#settings)
11. [API Integration Guide](#api-integration-guide)
12. [Component Architecture](#component-architecture)
13. [State Management](#state-management)
14. [Responsive Design](#responsive-design)
15. [Accessibility](#accessibility)
16. [Testing Strategy](#testing-strategy)

## Overview

The ABETWORKS CRM frontend will be a modern, responsive, single-page application built with React and TypeScript. It will provide intuitive interfaces for different user roles (admin, sales rep, customer) with role-based access controls and a unified dashboard experience.

## Tech Stack

### Core Technologies
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + DaisyUI
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: Day.js
- **HTTP Client**: Axios
- **File Upload**: react-dropzone
- **Virtual Scrolling**: react-window

### UI Components
- **Modal/Dialog**: Headless UI
- **Data Grid**: AG-Grid or React Table
- **Rich Text Editor**: TipTap or react-quill
- **File Viewer**: react-pdf, image viewer libraries

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/           # Buttons, inputs, cards, etc.
│   ├── layout/           # Header, sidebar, footer
│   ├── forms/            # Form elements and validation
│   └── charts/           # Chart components
├── pages/               # Route components
│   ├── auth/            # Login, register, forgot password
│   ├── dashboard/       # Main dashboard layouts
│   ├── admin/           # Admin-specific pages
│   ├── sales/           # Sales-focused pages
│   ├── reports/         # Reporting pages
│   └── settings/        # Settings pages
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── store/               # Redux store configuration
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
├── contexts/            # React Context providers
├── constants/           # Constants and enums
├── assets/              # Images, icons, fonts
└── styles/              # Global styles and themes
```

## UI/UX Design System

### Color Palette
- **Primary**: #3B82F6 (Blue-500) - Primary actions
- **Secondary**: #6B7280 (Gray-500) - Secondary actions
- **Success**: #10B981 (Emerald-500) - Success states
- **Warning**: #F59E0B (Amber-500) - Warnings
- **Error**: #EF4444 (Red-500) - Errors
- **Background**: #F9FAFB (Gray-50) - Page backgrounds
- **Surface**: #FFFFFF - Card surfaces
- **Text**: #1F2937 (Gray-800) - Primary text

### Typography
- **Font Family**: Inter (system font fallback)
- **Headings**: Bold weights (600-700)
- **Body**: Normal weights (400-500)
- **Small**: Light weights (300-400)

### Spacing System
- **Base Unit**: 4px
- **Scale**: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64

### Component Library
- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Standard, elevated, compact variants
- **Inputs**: Text, select, textarea, checkbox, radio
- **Navigation**: Sidebar, topbar, breadcrumbs
- **Data Display**: Tables, lists, badges, avatars

## Authentication Flow

### Login Page
```
┌─────────────────────────────────────┐
│            Welcome Back             │
│                                     │
│   [Logo]                            │
│                                     │
│   Email: [________________]         │
│                                     │
│   Password: [_______________]       │
│   [Show]                            │
│                                     │
│   [Sign In]                         │
│                                     │
│   Forgot Password? Sign Up          │
└─────────────────────────────────────┘
```

**Components:**
- Form with validation
- Remember me checkbox
- Social login options
- Error messaging
- Loading states

### Registration Page
```
┌─────────────────────────────────────┐
│            Create Account           │
│                                     │
│   First Name: [_______________]     │
│                                     │
│   Last Name: [_______________]      │
│                                     │
│   Email: [________________]         │
│                                     │
│   Password: [_______________]       │
│                                     │
│   [Create Account]                  │
│                                     │
│   Already have an account? Sign In  │
└─────────────────────────────────────┘
```

## Dashboard Layout

### Main Dashboard Structure
```
┌─────────────────────────────────────────────────────────┐
│ Logo           [Search]     [Notifications] [User Menu] │
├─────────────────────────────────────────────────────────┤
│ [Menu] │                                              │
│ Home   │                 Main Content Area            │
│ Leads  │                                              │
│ Deals  │                                              │
│ Tasks  │                                              │
│        │                                              │
│ Settings│                                             │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Components
- **Header**: Navigation, search, notifications, user menu
- **Sidebar**: Main navigation menu with collapsible sections
- **Main Content**: Responsive grid with widgets
- **Footer**: Copyright, links, version info

## Feature-Specific Interfaces

### 1. Lead Management Interface

#### Leads List Page
```
┌─────────────────────────────────────────────────────────┐
│ Leads Management                                        │
├─────────────────────────────────────────────────────────┤
│ [Add Lead] [Import] [Export] [Filter] [Search]         │
├─────────────────────────────────────────────────────────┤
│ Status Filter: [All ▼] [All Sources ▼] [All Owners ▼]  │
├─────────────────────────────────────────────────────────┤
│ ┌─Lead────────────┬─Company──────┬─Status──┬─Owner──┐   │
│ │ John Doe        │ ABC Corp     │ New     │ Jane   │   │
│ │ john@abc.com    │              │         │ Smith  │   │
│ │ +1-555-0101     │              │         │        │   │
│ └─────────────────┴──────────────┴─────────┴────────┘   │
│ ┌─Lead────────────┬─Company──────┬─Status──┬─Owner──┐   │
│ │ Jane Smith      │ XYZ Ltd      │ Hot     │ Mike   │   │
│ │ jane@xyz.com    │              │         │ Jones  │   │
│ │ +1-555-0102     │              │         │        │   │
│ └─────────────────┴──────────────┴─────────┴────────┘   │
├─────────────────────────────────────────────────────────┤
│ [Prev] 1 of 10 [Next]                                   │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Bulk selection and actions
- Inline editing
- Drag-and-drop status updates
- Quick view modal
- Custom column configuration
- Mass update/delete operations

#### Lead Detail Page
```
┌─────────────────────────────────────────────────────────┐
│ John Doe • ABC Corp • New Lead                         │
├─────────────────────────────────────────────────────────┤
│ [Edit] [Convert] [Delete] [Add Activity] [Add File]    │
├─────────────────────────────────────────────────────────┤
│ ┌─Contact Info─────┐ ┌─Activity Feed─────┐            │
│ │ Name: John Doe   │ │ [New Activity]    │            │
│ │ Email: j@abc.com │ │ ┌─Call──────────┐ │            │
│ │ Phone: +1-555-01 │ │ │ John called   │ │            │
│ │ Job Title: CEO   │ │ │ 2 hours ago   │ │            │
│ │ Company: ABC     │ │ └───────────────┘ │            │
│ └──────────────────┘ │ ┌─Meeting───────┐ │            │
│                      │ │ Meeting today │ │            │
│ ┌─Lead Details─────┐ │ │ 3 hours ago   │ │            │
│ │ Source: Web      │ │ └───────────────┘ │            │
│ │ Score: 85        │ └───────────────────┘            │
│ │ Notes: Great pot │                                    │
│ └──────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
```

### 2. Deal/Opportunity Management

#### Opportunities Board
```
┌─────────────────────────────────────────────────────────┐
│ Opportunities Board                                     │
├─────────────────────────────────────────────────────────┤
│ [Add Deal] [Import] [Forecast] [Pipeline]             │
├─────────────────────────────────────────────────────────┤
│ ┌─Prospecting─┐ ┌─Qualification─┐ ┌─Proposal──┐        │
│ │ Deal 1      │ │ Deal 2        │ │ Deal 3    │        │
│ │ $50K        │ │ $75K          │ │ $100K     │        │
│ │ Contact: J.S│ │ Contact: M.B  │ │ Contact: A.T│        │
│ │ Owner: J.Smi│ │ Owner: M.Jone │ │ Owner: A.Thr│      │
│ └─────────────┘ └───────────────┘ └───────────┘        │
│                                                       │
│ ┌─Negotiation─┐ ┌─Closed Won────┐ ┌─Closed Lost┐       │
│ │ Deal 4      │ │ Deal 5        │ │ Deal 6    │       │
│ │ $200K       │ │ $150K         │ │ $75K      │       │
│ │ Contact: R.M│ │ Contact: S.Lee│ │ Contact: K.W│       │
│ │ Owner: R.Mil│ │ Owner: S.Lee  │ │ Owner: K.Wil│     │
│ └─────────────┘ └───────────────┘ └───────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 3. Contact Management

#### Contact Card View
```
┌─────────────────────────────────────────────────────────┐
│ Contacts                                                │
├─────────────────────────────────────────────────────────┤
│ [Add Contact] [Import] [Export] [Filter] [Search]      │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │     John Doe    │ │    Jane Smith   │ │  Bob Wilson │ │
│ │   CEO, ABC Corp │ │   CTO, XYZ Ltd  │ │   VP Sales  │ │
│ │   john@abc.com  │ │   jane@xyz.com  │ │ bob@def.com │ │
│ │   +1-555-0101   │ │   +1-555-0102   │ │ +1-555-0103 │ │
│ │                 │ │                 │ │             │ │
│ │   [View] [Edit] │ │   [View] [Edit] │ │ [View] [Edit]│ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 4. Task/Activity Management

#### Calendar View
```
┌─────────────────────────────────────────────────────────┐
│ Activities Calendar                                     │
├─────────────────────────────────────────────────────────┤
│ [Today] [◀ Prev] [Jan 2024] [Next ▶] [Today]          │
├─────────────────────────────────────────────────────────┤
│ Su Mo Tu We Th Fr Sa                                  │
│    [ ] [ ] [ ] [ ] [ ] [ ]                           │
│ [ ] [ ] [ ] [ ] [ ] [ ] [ ]                           │
│ [ ] [ ] [ ] [ ] [ ] [ ] [ ]                           │
│ [ ] [ ] [ ] [ ] [ ] [ ] [ ]                           │
│ [ ] [ ] [ ] [ ] [ ] [ ] [ ]                           │
│    [ ] [ ] [ ] [ ] [ ]                                │
├─────────────────────────────────────────────────────────┤
│ Today's Events:                                         │
│ • 10:00 AM - Call with John (ABC Corp)                │
│ • 2:00 PM - Meeting with Jane (XYZ Ltd)               │
│ • 4:00 PM - Follow-up email to Bob                     │
└─────────────────────────────────────────────────────────┘
```

## Admin Panel

### Admin Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ Admin Dashboard                                         │
├─────────────────────────────────────────────────────────┤
│ ┌─Total Users──┐ ┌─Active Leads──┐ ┌─Deals Value──┐    │
│ │     1,248    │ │     342       │ │   $2.4M      │    │
│ │              │ │               │ │              │    │
│ │   [+5.2%]    │ │   [+12.4%]    │ │  [+8.7%]     │    │
│ └──────────────┘ └───────────────┘ └──────────────┘    │
├─────────────────────────────────────────────────────────┤
│ ┌─User Management─────┐ ┌─System Settings──────┐       │
│ │ • Manage Users      │ │ • Custom Fields      │       │
│ │ • Assign Roles      │ │ • Import/Export      │       │
│ │ • Bulk Actions      │ │ • Integrations       │       │
│ │ • User Reports      │ │ • Backup/Restore     │       │
│ └─────────────────────┘ └──────────────────────┘       │
├─────────────────────────────────────────────────────────┤
│ Recent Activity:                                        │
│ • John Smith updated lead "ABC Corp" (2 min ago)       │
│ • Jane Doe created deal "XYZ Project" (15 min ago)     │
│ • Mike Johnson converted lead "DEF Inc" (1 hour ago)   │
└─────────────────────────────────────────────────────────┘
```

### User Management Interface
```
┌─────────────────────────────────────────────────────────┐
│ User Management                                         │
├─────────────────────────────────────────────────────────┤
│ [Add User] [Import] [Export] [Reset Password]         │
├─────────────────────────────────────────────────────────┤
│ Role Filter: [All ▼] Status: [All ▼]                  │
├─────────────────────────────────────────────────────────┤
│ ┌─User─────────────┬─Role──────┬─Status──┬─Last Active─┐ │
│ │ John Smith       │ Admin     │ Active  │ 2 min ago   │ │
│ │ john@company.com │           │         │             │ │
│ │ Sales Manager    │           │         │             │ │
│ ├──────────────────┼───────────┼─────────┼─────────────┤ │
│ │ Jane Doe         │ Sales Rep │ Active  │ 1 hour ago  │ │
│ │ jane@company.com │           │         │             │ │
│ │ Account Exec     │           │         │             │ │
│ └──────────────────┴───────────┴─────────┴─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Customer Interface

### Customer Portal
```
┌─────────────────────────────────────────────────────────┐
│ Customer Portal                                          │
├─────────────────────────────────────────────────────────┤
│ My Account • My Tickets • Billing • Support            │
├─────────────────────────────────────────────────────────┤
│ ┌─My Information────┐ ┌─Recent Activity─────┐         │
│ │ Name: John Doe    │ │ • Order #12345      │         │
│ │ Email: j@me.com   │ │   Shipped yesterday │         │
│ │ Phone: +1-555-0101│ │ • Invoice #I-7890   │         │
│ │ Address: 123 Main │ │   Due in 3 days     │         │
│ │                   │ │ • Ticket #TK-543    │         │
│ │ [Edit Profile]    │ │   Resolved today    │         │
│ └───────────────────┘ └─────────────────────┘         │
├─────────────────────────────────────────────────────────┤
│ My Orders:                                              │
│ ┌─Order #12345──┬─Status─────┬─Total──┬─Date─────────┐ │
│ │ Product A     │ Shipped    │ $299   │ Jan 15, 2024 │ │
│ │ Product B     │            │        │              │ │
│ └───────────────┴────────────┴────────┴──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Settings

### User Profile Settings
```
┌─────────────────────────────────────────────────────────┐
│ Profile Settings                                        │
├─────────────────────────────────────────────────────────┤
│ ┌─Personal Info─────┐ ┌─Preferences───────┐           │
│ │ Name: John Smith  │ │ • Notifications   │           │
│ │ Email: j@me.com   │ │ • Language        │           │
│ │ Phone: +1-555-0101│ │ • Time Zone       │           │
│ │ Avatar: [Change]  │ │ • Theme           │           │
│ │                   │ │ • Privacy         │           │
│ │ [Save Changes]    │ │                   │           │
│ └───────────────────┘ └───────────────────┘           │
├─────────────────────────────────────────────────────────┤
│ Security Settings:                                      │
│ • Change Password                                       │
│ • Two-Factor Authentication                             │
│ • Connected Apps                                        │
│ • Login History                                         │
└─────────────────────────────────────────────────────────┘
```

### System Settings (Admin)
```
┌─────────────────────────────────────────────────────────┐
│ System Settings                                         │
├─────────────────────────────────────────────────────────┤
│ ┌─General───────────┐ ┌─Email Settings─────┐          │
│ │ Company Name      │ │ SMTP Configuration │          │
│ │ Logo Upload       │ │ From Address       │          │
│ │ Default Currency  │ │ Templates          │          │
│ │ Time Zone         │ │ Test Connection    │          │
│ │                   │ │                    │          │
│ │ [Save]            │ │ [Save]             │          │
│ └───────────────────┘ └────────────────────┘          │
├─────────────────────────────────────────────────────────┤
│ Custom Fields:                                          │
│ ┌─Entity: Leads───────────────────────────────────────┐ │
│ │ + Add Custom Field                                  │ │
│ │ • Referral Source (Select)                          │ │
│ │ • Budget Range (Number)                             │ │
│ │ • Decision Maker (Text)                             │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## API Integration Guide

### Authentication Service
```typescript
// services/authService.ts
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post('/api/v1/auth/login', credentials);
  return response.data;
};

// Usage in component
const handleLogin = async (data: LoginCredentials) => {
  try {
    setLoading(true);
    const result = await login(data);
    
    // Store tokens
    localStorage.setItem('token', result.token);
    localStorage.setItem('refreshToken', result.refreshToken);
    
    // Update user context
    setUser(result.user);
    
    navigate('/dashboard');
  } catch (error) {
    setError('Invalid credentials');
  } finally {
    setLoading(false);
  }
};
```

### Data Fetching with RTK Query
```typescript
// services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Lead', 'Opportunity', 'Activity', 'Account'],
  endpoints: (builder) => ({
    // Users
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    
    // Leads
    getLeads: builder.query<Lead[], { page: number; limit: number }>({
      query: ({ page, limit }) => `/leads?page=${page}&limit=${limit}`,
      providesTags: ['Lead'],
    }),
    
    createLead: builder.mutation<Lead, Partial<Lead>>({
      query: (lead) => ({
        url: '/leads',
        method: 'POST',
        body: lead,
      }),
      invalidatesTags: ['Lead'],
    }),
    
    // Opportunities
    getOpportunities: builder.query<Opportunity[], void>({
      query: () => '/opportunities',
      providesTags: ['Opportunity'],
    }),
    
    // Activities
    getActivities: builder.query<Activity[], void>({
      query: () => '/activities',
      providesTags: ['Activity'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetLeadsQuery,
  useCreateLeadMutation,
  useGetOpportunitiesQuery,
  useGetActivitiesQuery,
} = apiSlice;
```

### Component Implementation Example
```tsx
// components/LeadsList.tsx
import React from 'react';
import { useGetLeadsQuery } from '../services/apiSlice';
import { LeadCard } from './LeadCard';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorBoundary } from './common/ErrorBoundary';

const LeadsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const { data: leads, isLoading, isError, error } = useGetLeadsQuery({ page, limit });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Leads</h2>
        <button className="btn btn-primary">Add Lead</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads?.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="join">
          <button 
            className="join-item btn" 
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            «
          </button>
          <button className="join-item btn">Page {page}</button>
          <button 
            className="join-item btn" 
            onClick={() => setPage(prev => prev + 1)}
          >
            »
          </button>
        </nav>
      </div>
    </div>
  );
};

export default LeadsList;
```

## Component Architecture

### Atomic Design Pattern
```
components/
├── atoms/          # Basic UI elements
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Checkbox.tsx
│   └── Typography.tsx
├── molecules/      # Compound components
│   ├── FormField.tsx
│   ├── InputGroup.tsx
│   └── CardHeader.tsx
├── organisms/      # Complex components
│   ├── LoginForm.tsx
│   ├── LeadCard.tsx
│   └── DataTable.tsx
└── templates/      # Page layouts
    ├── DashboardLayout.tsx
    └── AuthLayout.tsx
```

### State Management with Redux Toolkit
```typescript
// store/leadsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    source: string | null;
    owner: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: LeadState = {
  leads: [],
  currentLead: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    source: null,
    owner: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
      state.loading = false;
    },
    setCurrentLead: (state, action: PayloadAction<Lead | null>) => {
      state.currentLead = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateFilter: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = action.payload;
      state.filters = {
        ...state.filters,
        [key]: value,
      };
    },
    updatePagination: (state, action: PayloadAction<Partial<LeadState['pagination']>>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
  },
});

export const {
  setLeads,
  setCurrentLead,
  setLoading,
  setError,
  updateFilter,
  updatePagination,
} = leadsSlice.actions;

export default leadsSlice.reducer;
```

## Responsive Design

### Breakpoint Strategy
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Responsive Components
```tsx
// components/ResponsiveDataTable.tsx
import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ResponsiveDataTableProps {
  columns: Column[];
  data: any[];
}

const ResponsiveDataTable: React.FC<ResponsiveDataTableProps> = ({ columns, data }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="card bg-base-100 shadow-md">
            <div className="card-body">
              {columns.map((col) => (
                <div key={col.id} className="flex justify-between py-1">
                  <span className="text-gray-500">{col.title}</span>
                  <span>{item[col.id]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <table className="table w-full">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.id}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map(col => (
              <td key={col.id}>{item[col.id]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Accessibility

### WCAG Compliance
- **Semantic HTML**: Proper heading hierarchy, landmark elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: ARIA labels, landmarks, live regions
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Proper focus indicators and management

### Accessibility Features
```tsx
// components/AccessibleButton.tsx
import React, { forwardRef } from 'react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  ariaLabel?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, variant = 'primary', size = 'md', icon, loading, ariaLabel, ...props }, ref) => {
    const baseClasses = 'flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };
    
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
        aria-label={ariaLabel}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);
```

## Testing Strategy

### Unit Testing
```tsx
// __tests__/components/LeadsList.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../../store/store';
import LeadsList from '../../components/LeadsList';

describe('LeadsList', () => {
  const store = setupStore();

  it('renders loading state initially', () => {
    render(
      <Provider store={store}>
        <LeadsList />
      </Provider>
    );
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders leads when data is loaded', async () => {
    // Mock API response
    jest.spyOn(require('../../services/apiSlice'), 'useGetLeadsQuery')
      .mockReturnValue({
        data: [
          { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        ],
        isLoading: false,
        isError: false,
        error: null
      });

    render(
      <Provider store={store}>
        <LeadsList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing
```tsx
// __tests__/pages/Dashboard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { Provider } from 'react-redux';
import { setupStore } from '../../store/store';

describe('Dashboard', () => {
  const store = setupStore();

  it('shows welcome message for authenticated user', () => {
    // Mock user context
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it('allows navigation to different sections', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    const leadsLink = screen.getByText(/leads/i);
    fireEvent.click(leadsLink);

    expect(leadsLink).toBeInTheDocument();
  });
});
```

### E2E Testing (Cypress)
```javascript
// cypress/e2e/auth.cy.js
describe('Authentication Flow', () => {
  it('allows user to login and access dashboard', () => {
    cy.visit('/login');
    
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('be.visible');
  });

  it('validates form inputs', () => {
    cy.visit('/login');
    
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

## Deployment Configuration

### Environment Variables
```env
# .env.production
REACT_APP_API_URL=https://api.abetworks-crm.com
REACT_APP_SENTRY_DSN=your_sentry_dsn_here
REACT_APP_MIXPANEL_TOKEN=your_mixpanel_token
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_NODE_ENV=production
```

### Build Scripts
```json
{
  "scripts": {
    "build": "react-scripts build",
    "analyze": "npm run build && npx serve -s build",
    "preview": "npm run build && npx serve -s build",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,json,css,md}'"
  }
}
```

## Performance Optimization

### Code Splitting
```tsx
// App.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const Contacts = lazy(() => import('./pages/Contacts'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </Suspense>
  );
}

export default App;
```

### Image Optimization
```tsx
// components/OptimizedImage.tsx
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && placeholder && (
        <div className="bg-gray-200 animate-pulse" style={{ width, height }} />
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${
          error ? 'hidden' : ''
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      
      {error && (
        <div className="flex items-center justify-center bg-gray-100" style={{ width, height }}>
          <span className="text-gray-500">Image not available</span>
        </div>
      )}
    </div>
  );
};
```

This comprehensive frontend development guide provides detailed specifications for every aspect of the ABETWORKS CRM frontend:

1. **Complete tech stack** with modern React ecosystem
2. **Detailed UI/UX design system** with color palettes and typography
3. **Authentication flows** with login/register pages
4. **Dashboard layouts** with responsive design
5. **Feature-specific interfaces** for all CRM modules
6. **Admin panel** with comprehensive management tools
7. **Customer interface** for portal access
8. **Settings pages** for user and system configuration
9. **API integration patterns** with RTK Query
10. **Component architecture** following atomic design
11. **State management** with Redux Toolkit
12. **Responsive design** with mobile-first approach
13. **Accessibility features** for WCAG compliance
14. **Testing strategy** with unit, integration, and E2E tests
15. **Performance optimizations** with code splitting and image optimization

Every button, tab, and feature is detailed with:
- Visual representations of each interface
- Component breakdowns
- API integration patterns
- Responsive design considerations
- Accessibility implementations
- Performance optimization techniques

The guide ensures that developers have all the information needed to build a production-ready, scalable, and maintainable frontend that integrates seamlessly with the backend API.