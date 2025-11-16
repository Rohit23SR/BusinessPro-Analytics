# BusinessPro Dashboard

A modern, full-featured business analytics dashboard built with React, TypeScript, and AWS Amplify Gen 2. Track revenue, customers, conversions, and traffic with real-time data visualization and cloud-synced settings.

## Features

### Dashboard & Analytics
- **Interactive Dashboard** - Overview of key business metrics with KPI cards
- **Revenue Analytics** - Track revenue trends, set goals, and monitor progress
- **Traffic Analysis** - Visualize traffic sources with pie charts
- **Customer Insights** - Monitor customer acquisition and retention
- **Conversion Tracking** - Analyze conversion rates and funnels
- **Data Refresh** - One-click data refresh with loading states

### User Management
- **AWS Cognito Authentication** - Secure login, registration, and password recovery
- **User Profile Display** - Dynamic user info in sidebar (email-based)
- **Protected Routes** - Route guards for authenticated areas

### Settings & Personalization
- **Profile Settings** - Theme, language, timezone, currency preferences
- **Dashboard Customization** - Layout options, widget toggles, auto-refresh
- **Notification Preferences** - Email alerts, push notifications, alert thresholds
- **Integration Management** - Connect/disconnect third-party services
- **Data Export** - Export settings to JSON or CSV
- **Real-time Sync** - Settings automatically save to AWS backend with optimistic updates

### Backend Integration (AWS Amplify Gen 2)
- **REST API** - API Gateway with Lambda functions (not GraphQL)
- **DynamoDB Storage** - NoSQL database for user settings
- **Cognito Authentication** - JWT token-based API authorization
- **Auto-save** - Changes persist to cloud with visual feedback
- **Error Handling** - Graceful error recovery with user notifications

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Charts**: Custom SVG-based LineChart and PieChart components
- **Icons**: Lucide React
- **Backend**: AWS Amplify Gen 2
  - AWS Lambda (Node.js)
  - Amazon API Gateway (REST)
  - Amazon DynamoDB
  - Amazon Cognito

## Project Structure

```
src/
├── components/
│   ├── charts/           # LineChart, PieChart
│   ├── layout/           # Header, Sidebar, DashboardLayout
│   ├── settings/         # ProfileTab, DashboardTab, NotificationsTab, IntegrationsTab
│   └── ui/               # LoadingSpinner, ErrorBoundary, NotificationPopup
├── hooks/
│   ├── useAuth.tsx       # Authentication context and methods
│   ├── useSettings.ts    # Settings state with backend sync
│   ├── useDashboard.ts   # Dashboard data queries
│   └── useNavigation.ts  # URL filters and routing
├── pages/
│   ├── DashboardPage.tsx # Main dashboard
│   ├── RevenuePage.tsx   # Revenue analytics with goal setting
│   ├── SettingsPage.tsx  # User settings management
│   └── LoginPage.tsx     # Authentication
├── services/
│   └── apiClient.ts      # Authenticated API requests
├── router/               # Route definitions
├── types/                # TypeScript interfaces
├── utils/                # Helper functions
└── constants/            # App constants
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS Account (for backend features)
- AWS CLI configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd business-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173)

### AWS Amplify Setup (Optional)

To enable backend features:

1. Install Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Configure AWS credentials:
```bash
amplify configure
```

3. Deploy sandbox environment:
```bash
npm run amplify:sandbox
```

4. Update `src/utils/amplifyConfig.ts` with your API endpoint

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Open Vitest UI
- `npm run amplify:sandbox` - Deploy Amplify sandbox

## Testing

The project uses **Vitest** with **React Testing Library** for unit testing.

### Running Tests

```bash
# Watch mode (re-runs on file changes)
npm run test

# Single run
npm run test:run

# With coverage report
npm run test:coverage

# Visual UI
npm run test:ui
```

### Test Structure

```
src/
├── utils/
│   └── settingsUtils.test.ts    # Utility function tests
├── hooks/
│   └── useNotification.test.ts  # Hook behavior tests
├── components/
│   └── ui/
│       └── NotificationPopup.test.tsx  # Component tests
└── test/
    └── setup.ts                  # Test setup and mocks
```

### Test Coverage

Tests cover:
- **Utility functions** - JSON/CSV export functionality
- **Custom hooks** - State management, auto-hide behavior, cleanup
- **UI components** - Rendering, user interactions, accessibility
- **Edge cases** - Error handling, timeouts, empty states

### Writing Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';

// Component test example
describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

// Hook test example
describe('useMyHook', () => {
  it('should manage state', () => {
    const { result } = renderHook(() => useMyHook());
    act(() => {
      result.current.updateValue('new');
    });
    expect(result.current.value).toBe('new');
  });
});
```

## Key Features Explained

### Settings Synchronization
Settings are automatically saved to AWS when changed:
- Optimistic updates for instant feedback
- Minimum 1.2s display time for saving indicator
- Error recovery with 4-second error display
- Debounced input fields (800ms) for threshold values

### Authentication Flow
- Email-based registration with confirmation code
- Password reset via email
- JWT tokens stored in session
- Auto-redirect to login for protected routes

### Goal Setting
Revenue page includes a goal-setting modal:
- Currency-formatted input
- Real-time progress calculation
- Visual notification on save

### Responsive Design
- Desktop sidebar navigation
- Mobile-friendly hamburger menu
- Adaptive layouts for all screen sizes

## Environment Variables

Create a `.env` file for local development:

```env
VITE_API_ENDPOINT=your-api-gateway-url
```

## API Endpoints

When backend is configured:
- `GET /settings/preferences` - Fetch user preferences
- `PUT /settings/preferences` - Update preferences
- `GET /settings/dashboard-config` - Fetch dashboard settings
- `PUT /settings/dashboard-config` - Update dashboard settings
- `GET /settings/notifications` - Fetch notification settings
- `PUT /settings/notifications` - Update notification settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and feature requests, please contact the development team.
