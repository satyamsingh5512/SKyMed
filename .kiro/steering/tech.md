# Technology Stack

## Build System & Framework
- **Build Tool**: Vite 5.4.2 (fast development server and build tool)
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Routing**: React Router DOM 7.6.3

## Styling & UI
- **CSS Framework**: Tailwind CSS 3.4.1 with PostCSS
- **Dark Mode**: Class-based dark mode strategy (`dark:` prefix)
- **Icons**: Lucide React 0.263.1
- **Responsive**: Mobile-first design approach

## Maps & Geolocation
- **Google Maps**: @googlemaps/react-wrapper 1.2.0
- **OpenStreetMap**: Leaflet 1.9.4 with React Leaflet 5.0.0
- **Map Types**: Support for both Google Maps and OpenStreetMap implementations

## State Management
- **Context API**: React Context for theme and user state management
- **Local Storage**: Theme preferences and user data persistence

## Development Tools
- **Linting**: ESLint 9.9.1 with TypeScript ESLint
- **Type Checking**: Strict TypeScript configuration

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Setup
- Copy `.env.example` to `.env` for local configuration
- Configure Google Maps API key if using Google Maps features
- See `GOOGLE_MAPS_SETUP.md` and `FREE_MAPPING_SETUP.md` for mapping setup

## Performance Optimizations
- Vite excludes `lucide-react` from dependency optimization
- Tree-shaking enabled for production builds