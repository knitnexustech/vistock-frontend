# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `bun run build` - Build the production application  
- `bun start` - Start production server
- `bun lint` - Run ESLint with Next.js TypeScript configuration

## Project Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration  
- **Styling**: Tailwind CSS v4 with forms plugin
- **Package Manager**: Bun (primary), npm also supported
- **Icons**: Lucide React for all icons

### State Management & Data Fetching
- **React Query**: TanStack React Query v5 for server state management
  - Pre-configured QueryClient with production-ready settings in `src/lib/api/apiClient.ts`
  - Query keys factory for consistent caching (`queryKeys` object) 
  - Custom hooks: `useGet()` and `useMutate()` in `src/hooks/core/useApi.ts`
- **Client State**: Zustand for local state management with persistence
- **Authentication**: Token-based authentication with role-based access control
  - JWT token storage in localStorage via Zustand persist middleware
  - AuthGuard component for route protection (`src/components/shared/AuthGuard.tsx`)
  - Role-based routing (client/admin dashboards)

### API Architecture  
- **Base Configuration**: Environment-driven API base URL (`NEXT_PUBLIC_API_BASE_URL`)
- **Error Handling**: Custom `ApiError` class with status codes and structured error responses
- **Request Functions**: 
  - `apiRequest()` for general requests in `src/lib/api/api.ts`
  - `authenticatedApiRequest()` for protected endpoints with token support
- **Query Integration**: React Query hooks with retry logic and authentication handling

### File Upload System
- **Storage**: Digital Ocean Spaces (S3-compatible) via AWS SDK
- **Compression**: Compressor.js for image optimization before upload (quality: 0.9, maxWidth: 1500px)
- **Batch Processing**: Files processed in batches of 2 for performance
- **Location**: Implementation in `src/utils/compressAndUploadFiles.ts`

### Component Organization
```
src/components/
├── layout/          # Layout components (ErrorState, LoadingState)
├── shared/          # Reusable components across the app
├── admin/           # Admin-specific components organized by route
└── client/          # Client-specific components organized by route
```

### Environment Variables Required
```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_AWS_ACCESS_KEY=
NEXT_PUBLIC_AWS_SECRET_KEY= 
NEXT_PUBLIC_AWS_REGION=
NEXT_PUBLIC_AWS_ENDPOINT=
NEXT_PUBLIC_AWS_BUCKET=
```

### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled with ES2017 target
- Next.js plugin configured for enhanced TypeScript support

### Query Keys Structure
The `queryKeys` factory provides consistent cache management:
- `queryKeys.user.*` - User-related queries

### Authentication System
- **Login Endpoint**: `/auth/login` - Returns `{ token, user }` 
- **Verification Endpoint**: `/auth/me` - Validates token and returns user data
- **User Roles**: `client` and `admin` with automatic dashboard routing
- **Route Protection**: Use `AuthGuard` component with `requiredRole` prop
- **Auth Store**: `useAuthStore()` hook for accessing user state and auth actions

### Key Patterns
1. **API Calls**: Use `useGet()` and `useMutate()` hooks instead of direct fetch calls
2. **Error Handling**: Components should handle `ApiError` instances from failed requests
3. **File Uploads**: Use `compressAndUploadFiles()` utility for image uploads with batch processing
4. **Query Keys**: Always use the `queryKeys` factory for consistent cache invalidation
5. **Form Validation**: Use Zod for all form validation schemas
6. **Route Protection**: Wrap protected pages with `<AuthGuard requiredRole="client|admin">`
7. **Authentication**: Use `useAuthStore()` for auth state management

# USER Instructions

1. This is Production applicaiton, so user approach that is recommended for production applications
2. user mobile first approach, UI should be responsive for mobile, tablet, web view
3. for Icons user "lucide-react"
4. use component based approach, don't put any of the code of page in one file make components out of it, for admin components create components under "components/admin/(page/route name)/component name", for client components create components under "components/client/(page/route name)/component name" & for shared components create components under "components/shared/component name"
5. for constants & types there are folders under "components/types/" & "components/constants/"
6. for form validations use "zod"
7. for tables use "@tanstack/react-table"