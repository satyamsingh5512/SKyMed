# Project Structure

## Root Directory
```
├── src/                    # Source code
├── dist/                   # Build output
├── node_modules/           # Dependencies
├── .kiro/                  # Kiro configuration and steering
├── .vscode/                # VS Code settings
├── public/                 # Static assets (via index.html)
└── config files            # Build and tool configurations
```

## Source Code Organization (`src/`)

### Core Application
- `main.tsx` - Application entry point with React DOM rendering
- `App.tsx` - Root component with routing and context providers
- `index.css` - Global styles and Tailwind imports
- `vite-env.d.ts` - Vite type definitions

### Components (`src/components/`)
Reusable UI components organized by functionality:
- **Layout**: `Header.tsx`, `Sidebar.tsx`, `UserHeader.tsx`
- **Dashboard**: `StatCard.tsx`, `SystemStatus.tsx`, `AlertPanel.tsx`, `RecentDeliveries.tsx`
- **Maps**: `MapView.tsx`, `GoogleMapView.tsx`, `OpenStreetMapView.tsx`, `LiveMap.tsx`

### Pages (`src/pages/`)
Route-level components for different application views:
- **User Interface**: `UserDashboard.tsx`, `SendParcel.tsx`, `TrackParcel.tsx`, `Profile.tsx`
- **Operations**: `Dashboard.tsx`, `FleetManagement.tsx`, `EmergencyRequests.tsx`
- **Management**: `Analytics.tsx`, `Inventory.tsx`, `RouteOptimization.tsx`, `Settings.tsx`
- **Maps**: `Maps.tsx`

### Contexts (`src/contexts/`)
React Context providers for global state:
- `ThemeContext.tsx` - Dark/light theme management with localStorage persistence
- `UserContext.tsx` - User data and parcel management
- `SystemContext.tsx` - System-wide state and configuration

## Naming Conventions
- **Components**: PascalCase (e.g., `UserHeader.tsx`)
- **Files**: PascalCase for React components, camelCase for utilities
- **Folders**: camelCase (e.g., `components`, `contexts`)
- **CSS Classes**: Tailwind utility classes with `dark:` prefixes for dark mode

## Architecture Patterns
- **Context Pattern**: Global state management via React Context
- **Component Composition**: Reusable components with clear separation of concerns
- **Route-based Code Splitting**: Pages organized by application routes
- **Provider Pattern**: Context providers wrap the entire application in `App.tsx`

## File Conventions
- All React components use `.tsx` extension
- Context providers include both context and custom hook exports
- Components export as default, with named exports for types/interfaces when needed