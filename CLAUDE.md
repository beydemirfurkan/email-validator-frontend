# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` - Runs Next.js development server with Turbopack
- **Build**: `npm run build` - Builds the application for production with Turbopack  
- **Production**: `npm start` - Starts the production server
- **Lint**: `eslint` - Runs ESLint for code quality checks

## Project Architecture

This is a **Next.js 15 frontend application** for Valid2Go, an email validation service, built with the App Router and modern React patterns.

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with custom CSS variables
- **UI Components**: Radix UI primitives with custom design system
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Authentication**: JWT tokens stored in cookies via js-cookie
- **Icons**: Lucide React icons

### Application Structure

**Authentication Flow**:
- Route-based authentication with middleware 
- `AuthGuard` component protects dashboard routes
- JWT tokens managed via cookies with `js-cookie`

**Routing Architecture**:
- `app/(auth)/` - Public authentication pages (login, register, forgot-password)
- `app/(dashboard)/` - Protected dashboard pages with shared layout
- `app/api/` - API routes that proxy to backend service
- Root pages for landing, terms, privacy

**Key Components**:
- `lib/api.ts` - Centralized API client with TypeScript interfaces
- `middleware.ts` - CORS handling for API routes
- `app/providers.tsx` - React Query and theme providers setup
- `components/auth/auth-guard.tsx` - Authentication protection wrapper
- `components/ui/` - Reusable UI components built on Radix primitives

**API Integration**:
- Backend API URL configured via `NEXT_PUBLIC_API_URL` environment variable
- Comprehensive TypeScript interfaces for all API responses
- API client handles authentication, error handling, and request formatting
- File upload support for CSV validation with FormData

**State Management**:
- Authentication state managed via API client and cookies
- Server state handled by TanStack React Query
- UI state managed locally or via Zustand when needed

### Development Patterns

**Styling Approach**:
- Tailwind CSS with custom design system
- CSS variables for theming (`--font-inter`)
- Radix UI for accessible component primitives
- Consistent spacing and color scheme across components

**TypeScript Usage**:
- Strict TypeScript configuration with path mapping (`@/*`)
- Comprehensive API response interfaces in `lib/api.ts`
- Type-safe form handling with React Hook Form + Zod

**Component Structure**:
- Route components in `app/` directories
- Reusable UI components in `components/ui/`
- Layout components in `components/layout/`
- Authentication components in `components/auth/`

### Backend Integration Notes

The application connects to a comprehensive email validation API with endpoints for:
- User authentication and profile management
- Email validation (single and bulk)
- API key management
- Contact list management  
- Analytics and dashboard data
- File upload/processing for CSV validation
- Subscription and usage tracking

Refer to `docs/API.md` for complete backend API documentation and `docs/DESIGN.md` for UI/UX specifications.