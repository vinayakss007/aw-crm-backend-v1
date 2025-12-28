# ABETWORKS CRM Frontend

This is the frontend application for the ABETWORKS CRM system, built with React, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX Design**: Clean, responsive interface following the latest design principles
- **Role-Based Access Control**: Different interfaces and permissions based on user roles
- **Real-time Data**: Live updates without page refresh
- **Dashboard Widgets**: Customizable dashboard with role-specific widgets
- **Kanban Board**: Visual pipeline management for opportunities
- **Activity Timeline**: Chronological activity history
- **Advanced Search & Filter**: Multi-criteria filtering with saved filters
- **Bulk Operations**: Batch operations for multiple records
- **Dark/Light Mode**: Theme switching with localStorage persistence
- **Mobile Responsive**: Fully responsive design for all screen sizes

## Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + DaisyUI
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: Day.js
- **HTTP Client**: Axios

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

## Installation

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Create a `.env` file based on `.env.example`
5. Start the development server: `npm start`

## Environment Variables

Create a `.env` file in the root of the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SENTRY_DSN=your_sentry_dsn_here
REACT_APP_MIXPANEL_TOKEN=your_mixpanel_token
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_NODE_ENV=development
```

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the production bundle
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## API Integration

The frontend uses RTK Query for API integration with the backend. All API endpoints are defined in `services/apiSlice.ts` and follow the backend API documentation.

## Theming

The application supports both light and dark themes. The theme can be toggled using the button in the header and is persisted in localStorage.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.