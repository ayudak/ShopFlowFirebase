# ShopFlow - Modern POS Web Application

## Project Overview
ShopFlow is a comprehensive Point-of-Sale (POS) web application built with React, TypeScript, and Firebase. It provides businesses with inventory management, checkout systems, sales analytics, and license-based subscription management.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React Context for auth
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library

### Backend (Firebase)
- **Authentication**: Firebase Auth (Email/Password, Google Sign-In, Custom Token, Anonymous)
- **Database**: Firestore for real-time data storage
- **Hosting**: Planned for Firebase Hosting or Replit deployment

## Data Model

### Firestore Collections

#### User Profiles
Path: `users/{userId}`
```typescript
{
  email: string
  role: 'user' | 'admin'
  createdAt: string
}
```

#### User Licenses
Path: `artifacts/{__app_id}/users/{userId}/shopflow_licenses/{documentId}`
```typescript
{
  userId: string
  type: 'Small Business' | 'Enterprise' | 'Trial' | 'None'
  expiryDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

#### Reviews
Path: `artifacts/{__app_id}/public/data/shopflow_reviews/{documentId}`
```typescript
{
  userId: string
  userEmail: string
  rating: number (1-5)
  comment: string
  createdAt: string
}
```

## Features Implemented

### Task 1: Schema & Frontend (COMPLETED)
✅ TypeScript schemas and interfaces for all data models
✅ Design system configured (Inter font, blue color scheme)
✅ Responsive Navigation with mobile hamburger menu
✅ Landing Page with hero, features grid, and testimonials
✅ Pricing Section with INR pricing (₹2,999 Small Business, ₹7,999 Enterprise)
✅ Reviews Section with star rating input and filtered feed
✅ Admin Panel with license management table
✅ User Dashboard with license status and password change
✅ About Us page with company info and developer profiles
✅ Contact Us page with form and contact details
✅ Sign In / Sign Up pages with email/password and Google options
✅ Privacy Policy and Terms of Service modals
✅ All routes configured in App.tsx

## Current Implementation Status

### Completed
- All UI components built with shadcn/ui
- Complete routing setup with Wouter
- Form validation with React Hook Form + Zod
- Responsive design across all breakpoints
- Auth context structure (ready for Firebase integration)
- Loading states and error handling UI
- Professional design following design guidelines

### In Progress
- Firebase SDK integration (Task 2)
- Firestore real-time listeners (Task 2)
- Authentication flows implementation (Task 2)

### Pending
- Firebase configuration and initialization
- License-based access control enforcement
- Real-time review submissions and updates
- Admin license management persistence
- Password change functionality
- Google Sign-In integration

## Development Workflow

1. **Start Application**: `npm run dev`
   - Starts Vite dev server for frontend
   - Serves on port 5000

2. **Type Checking**: TypeScript enabled across the project

3. **Styling**: Tailwind CSS with custom theme in `client/src/index.css`

## Environment Variables Needed

Will be required for Firebase integration (Task 2):
- Firebase configuration injected via global variables:
  - `window.__app_id`
  - `window.__firebase_config`
  - `window.__initial_auth_token`

## Key Files

### Frontend
- `client/src/App.tsx` - Main app with routing
- `client/src/contexts/AuthContext.tsx` - Authentication state management
- `client/src/lib/firebase.ts` - Firebase configuration helpers
- `client/src/pages/*` - All page components
- `client/src/components/*` - Reusable UI components
- `shared/schema.ts` - TypeScript types and Zod schemas

### Configuration
- `tailwind.config.ts` - Tailwind theme configuration
- `client/src/index.css` - CSS variables and custom styles
- `design_guidelines.md` - UI/UX design specifications

## Design System

### Colors
- Primary: Professional Blue (HSL: 217 91% 60%)
- Success: Green for active states
- Warning: Yellow for trial/pending states
- Destructive: Red for errors/inactive states

### Typography
- Font Family: Inter
- Hierarchy: Bold headings, medium subheadings, regular body text

### Spacing
- Consistent use of Tailwind spacing scale (4, 6, 8, 12, 16, 24)
- Section padding: py-16 md:py-24
- Card padding: p-6 md:p-8

## Next Steps (Task 2)

1. Install Firebase SDK
2. Initialize Firebase with configuration
3. Implement authentication flows:
   - Custom token fallback to anonymous
   - Email/password sign in/up
   - Google Sign-In
4. Set up Firestore real-time listeners:
   - Reviews feed with onSnapshot
   - User license status
   - User profile data
5. Implement license-based access control for Reviews section
6. Connect Admin Panel to Firestore for license management

## Company Information

**Company**: Ayudak
**Mission**: To provide the best apps with affordable pricing and crazy features
**Target**: Small business owners

**Developers**:
- Ayush (Frontend): https://ayushcodeui.netlify.app
- Daksh (Backend): https://dakshbackend.netlify.app

**Contact**:
- Email: devbydaksh@gmail.com
- Phone: +91 82188 97129, +91 97201 77772
