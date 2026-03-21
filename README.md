# BusinessPro Dashboard

A full-featured business analytics dashboard built with React, TypeScript, and AWS Amplify. Real-time KPIs, revenue tracking, customer analytics, traffic breakdowns, and cloud-synced user settings — all with dark mode.

## Live Demo

[https://main.d2mh65j13852hw.amplifyapp.com](https://main.d2mh65j13852hw.amplifyapp.com)

## What it does

- **Dashboard** — KPI cards, revenue charts, traffic breakdown, recent activity, top products
- **Analytics** — Traffic sources, user behavior heatmaps, conversion funnels, cohort analysis
- **Revenue** — Monthly trends, YoY comparison, custom goal setting with modal
- **Customers & Products** — Acquisition metrics, LTV, churn, product performance
- **Settings** — Theme (dark/light), language, timezone, currency, notification thresholds, integrations — all sync to AWS
- **Auth** — Cognito-based login, registration with email verification, password reset, protected routes

## Tech Stack

| What | How |
|------|-----|
| Frontend | React 18, TypeScript 5, Vite 7 |
| Styling | Tailwind CSS 3 (dark mode via class) |
| Data | TanStack Query 5 (caching, refetching, optimistic updates) |
| Routing | React Router v6 (lazy-loaded pages) |
| Charts | D3.js + 8 custom SVG components |
| Auth | AWS Cognito (JWT) |
| API | API Gateway + Lambda (REST) |
| Database | DynamoDB |
| Infra | AWS Amplify Gen 2 |
| Testing | Vitest + React Testing Library |

## Getting Started

```bash
git clone <repo-url>
cd business-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app works out of the box with mock data — no AWS setup needed for local development.

### Optional: AWS backend

```bash
npm install -g @aws-amplify/cli
amplify configure
npm run amplify:sandbox
```

## Scripts

```bash
npm run dev              # start dev server
npm run build            # production build
npm run preview          # preview prod build

npm run lint             # eslint check
npm run lint:fix         # eslint auto-fix
npm run format           # prettier format all files
npm run format:check     # check formatting

npm run test             # vitest watch mode
npm run test:run         # single run
npm run test:coverage    # with coverage report

npm run amplify:sandbox  # deploy dev backend
npm run amplify:deploy   # deploy prod backend
```

## Project Structure

```
src/
├── components/
│   ├── charts/       8 chart types (Line, MultiSeries, Pie, Bar, Area, Heatmap, Sankey, Showcase)
│   ├── layout/       Header, Sidebar, DashboardLayout, RootLayout
│   ├── settings/     ProfileTab, DashboardTab, NotificationsTab, IntegrationsTab
│   ├── auth/         ProtectedRoute
│   └── ui/           LoadingSpinner, ErrorBoundary, NotificationPopup
├── hooks/            useAuth, useSettings, useDashboard, useAnalytics, useNavigation, useNotification, useTheme
├── pages/            13 lazy-loaded pages
├── services/         apiClient (JWT), mock API, unified API layer
├── constants/        app-wide constants (timing, breakpoints)
├── types/            TypeScript interfaces
├── utils/            amplifyConfig, queryClient, darkMode, responsiveChart
└── data/             mock data for development
```

## Testing

96 tests across 11 files. Covers auth flows, settings management, layout components, and UI utilities.

```bash
npm run test:run         # run all tests
npm run test:coverage    # generate coverage report
```

What's tested:
- **Auth hook** — login, register, logout, error handling, token retrieval
- **Login & Register pages** — form rendering, validation, submission, error display
- **Protected routes** — redirect behavior, loading states
- **Settings hook** — defaults, updates, reset, integrations, API key generation
- **Layout** — sidebar nav items, user display, header search, notifications
- **UI components** — toast notifications, popup rendering
- **Utilities** — settings export (JSON/CSV), config security

## Architecture notes

- Settings use optimistic updates with 1.2s minimum save indicator and error rollback
- Number inputs in settings are debounced (800ms) to prevent API spam
- All toast notifications use fixed positioning to avoid layout shift
- Settings tabs sync with URL params (`?tab=notifications`) for bookmarkability
- When Amplify isn't configured, the app falls back to mock data seamlessly
- Dark mode persists via localStorage and applies the `dark` class to `<html>`

## Environment Variables

```env
VITE_USE_MOCK_DATA=false          # force mock data mode
VITE_AWS_REGION=us-east-1         # optional region override
```

## License

Private and proprietary.
