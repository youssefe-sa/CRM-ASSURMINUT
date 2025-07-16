# ASSURMINUT - CRM Assurance Auto

## Overview

This is a modern, reactive, and secure web CRM application designed specifically for insurance brokers specializing in auto insurance. The system manages client information, quotes, documents, appointments, and call logs with a focus on French insurance market requirements. The application has been rebranded to ASSURMINUT with a custom logo and corporate blue/red color scheme.

## Recent Changes (July 16, 2025)

✓ Fixed 500 error in call creation by updating schema validation for prochainRappel field
✓ Rebranded application from "CRM Assurance" to "ASSURMINUT"
✓ Applied new logo and corporate color palette (blue #3B4D73, red #FF5C5C)
✓ Updated all UI components to use new brand colors
✓ Enhanced visual identity across login page, sidebar, and headers
✓ Added proper favicon and SEO metadata with new branding
✓ Configured Supabase PostgreSQL database integration
✓ Created comprehensive database schema with all necessary tables
✓ Set up admin user account (admin/admin123)
✓ Generated SQL creation script and documentation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Overall Architecture
- **Frontend**: React with TypeScript, using Vite for development and bundling
- **Backend**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Session-based with bcrypt for password hashing
- **File Handling**: Multer for document uploads
- **PDF Generation**: jsPDF for quote generation

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── uploads/         # File storage directory
```

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library built on Radix UI
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with ESBuild for fast development

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Express sessions with bcrypt password hashing
- **File Upload**: Multer for handling document uploads
- **PDF Generation**: jsPDF for creating quote PDFs
- **API**: RESTful API with structured error handling

### Database Schema
Core entities include:
- **Users**: Agent/admin authentication and role management
- **Clients**: Complete client information with French insurance specifics
- **Quotes (Devis)**: Quote management with pricing and guarantees
- **Documents**: File storage with client associations
- **Reminders (Rappels)**: Task and appointment management
- **Calls (Appels)**: Call log tracking with status management

## Data Flow

### Authentication Flow
1. User submits login credentials
2. Backend validates against bcrypt-hashed passwords
3. Session established with secure cookies
4. Frontend receives user data and stores in React Query cache
5. Protected routes check authentication status

### Client Management Flow
1. Forms validated with Zod schemas
2. Data submitted to Express API endpoints
3. Drizzle ORM handles database operations
4. React Query manages cache invalidation
5. UI updates reactively with new data

### Document Upload Flow
1. Files uploaded via multipart form data
2. Multer processes and stores files securely
3. Database records file metadata and client associations
4. Frontend displays document lists with download/delete options

### Quote Generation Flow
1. Quote data collected via multi-step forms
2. PDF generated server-side with jsPDF
3. Custom letterhead and client information included
4. Generated PDFs stored and linked to quotes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **bcryptjs**: Password hashing and verification
- **express-session**: Session management
- **multer**: File upload handling
- **jspdf**: PDF generation
- **drizzle-orm**: Type-safe database operations

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form management
- **@hookform/resolvers**: Form validation integration
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **vite**: Fast development server and bundler
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot module replacement
- tsx for running TypeScript backend with auto-restart
- Database migrations handled via Drizzle Kit

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with esbuild for Node.js execution
- Environment variables for database connections and secrets
- File uploads stored in local uploads directory

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Session secrets for secure cookie signing
- Drizzle Kit configuration for database schema management

### Security Considerations
- Session-based authentication with secure cookies
- bcrypt password hashing with salt rounds
- File upload restrictions by type and size
- SQL injection prevention through Drizzle ORM parameterized queries
- XSS protection through React's built-in escaping

This architecture provides a solid foundation for a French insurance broker CRM system with modern web technologies, secure authentication, and efficient data management capabilities.