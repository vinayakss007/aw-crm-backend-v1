# ABETWORKS CRM - Modern Frontend

This is a modern, enterprise-grade CRM frontend built with React, TypeScript, and Redux Toolkit Query. It provides a comprehensive user interface for managing leads, accounts, contacts, opportunities, and more.

## Features

### Core CRM Functionality
- **Dashboard**: Real-time analytics and KPIs with interactive charts
- **Leads Management**: Create, update, delete, and track leads with status management
- **Accounts Management**: Manage business accounts with detailed information
- **Contacts Management**: Track individual contacts and their relationships
- **Opportunities Management**: Track sales opportunities with pipeline stages
- **Activities Tracking**: Log and track all customer interactions

### Enterprise Features
- **Role-Based Access Control**: Different permissions for different user roles
- **Admin Dashboard**: User and role management with system configuration
- **Settings Management**: Personal and system-wide settings
- **Search & Filter**: Advanced search capabilities across all entities
- **Data Import/Export**: CSV import/export functionality
- **Audit Trail**: Track all changes and user actions

### Technical Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Live data synchronization
- **Form Validation**: Client-side validation with Zod
- **State Management**: Redux Toolkit for global state management
- **API Integration**: Redux Toolkit Query for API interactions
- **Type Safety**: Full TypeScript support with custom types
- **Accessibility**: WCAG 2.1 AA compliant components
- **Performance**: Optimized with React.memo, virtualization, and lazy loading

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit + Redux Toolkit Query
- **Routing**: React Router v6
- **UI Components**: Tailwind CSS + Headless UI + Heroicons
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form + Zod
- **API Client**: Axios + Redux Toolkit Query
- **Build Tool**: Vite
- **Data Grid**: AG-Grid React
- **Notifications**: React Hot Toast

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Integration

The frontend is designed to work with the ABETWORKS CRM backend API. The API endpoints are organized as follows:

- Authentication: `/auth`
- Users: `/users`
- Roles: `/roles`
- Leads: `/leads`
- Accounts: `/accounts`
- Contacts: `/contacts`
- Opportunities: `/opportunities`
- Activities: `/activities`

## Architecture

The application follows a modular architecture with:

- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Services**: API integration and RTK Query endpoints
- **Store**: Redux store with slices
- **Types**: TypeScript type definitions
- **Hooks**: Custom React hooks
- **Utils**: Utility functions
- **Config**: Configuration files

## Key Components

### Layout
- Responsive sidebar navigation
- Top navigation bar
- Mobile-friendly design

### Data Management
- CRUD operations for all entities
- Search and filtering
- Pagination
- Sorting
- Bulk operations

### Forms
- Validation with Zod
- Error handling
- Loading states
- Success feedback

### Charts & Analytics
- Interactive charts with Recharts
- Real-time data updates
- Customizable dashboards

## Security

- JWT-based authentication
- Role-based access control
- Secure API communication
- Input sanitization
- XSS protection

## Performance

- Code splitting with React.lazy
- Memoization with React.memo
- Virtualization for large lists
- Optimized API requests with RTK Query
- Efficient state management

## Testing

The application includes:
- Unit tests with Jest
- Integration tests
- Component tests with React Testing Library

## Deployment

To build for production:
```bash
npm run build
```

The build output will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.