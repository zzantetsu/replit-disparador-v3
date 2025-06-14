# REST Express Authentication Application

## Overview
This is a full-stack web application built with React, Express.js, and PostgreSQL/Drizzle ORM. The application provides a complete authentication system with user registration, login, password reset, and account activation features. It's designed with a modern, glassmorphism UI inspired by N8N and uses Supabase for additional authentication capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Tanstack React Query for server state and React Context for authentication
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **UI Components**: Radix UI components with shadcn/ui styling
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens + bcryptjs for password hashing
- **Session Management**: Express sessions with PostgreSQL store
- **API Structure**: RESTful endpoints under `/api` namespace

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle with schema-first approach
- **Session Store**: PostgreSQL-based session storage
- **Development**: In-memory storage fallback for development

## Key Components

### Authentication System
- **Registration**: Email/password with validation rules (8+ chars, special chars, numbers)
- **Login**: Email/password with "Remember Me" functionality
- **Password Reset**: Email-based password reset flow
- **Account Activation**: Email verification system
- **JWT Integration**: Secure token-based authentication

### User Management
- **User Schema**: ID, email, firstName, lastName, password, emailVerified timestamps
- **Validation**: Zod schemas for type-safe validation
- **Password Security**: bcryptjs hashing with salt rounds

### UI/UX Design
- **Theme**: Dark theme with purple/orange accent colors
- **Glassmorphism**: Modern glass-effect components
- **Responsive**: Mobile-first responsive design
- **Typography**: Unbounded (headings) and Montserrat (body) fonts
- **Animations**: Subtle animations and hover effects

## Data Flow

### Authentication Flow
1. User submits registration/login form
2. Frontend validates data using Zod schemas
3. API endpoints handle authentication logic
4. JWT tokens issued for successful authentication
5. Protected routes verify token validity
6. Context providers manage authentication state

### Route Protection
- **Public Routes**: Login, register, forgot password, reset password
- **Protected Routes**: Dashboard and authenticated areas
- **Route Guards**: Automatic redirects based on authentication status

## External Dependencies

### Core Dependencies
- **@supabase/supabase-js**: Authentication service integration
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **drizzle-orm**: Database ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token management

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Production bundling

### Database Providers
- **@neondatabase/serverless**: Serverless PostgreSQL
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Port**: 5000 (configured in .replit)
- **Hot Reload**: Vite HMR enabled
- **Development Command**: `npm run dev`

### Production Build
- **Build Process**: Vite frontend build + ESBuild server bundle
- **Static Assets**: Served from `dist/public`
- **Server Bundle**: Single file output in `dist/index.js`

### Replit Configuration
- **Auto-scaling**: Configured for autoscale deployment
- **Port Mapping**: Internal 5000 → External 80
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (required)
- **JWT_SECRET**: JWT signing secret
- **VITE_SUPABASE_URL**: Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase anonymous key

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 14, 2025. Initial setup