# Project Documentation



## Techonlogies Used In This Project

### Next Js V15.3

### React V19

### Supabase V2.49

### React Query V5.79

### Zustand V5.0.5

### TypeScript V5

### TailwindCss V4




## 🗄️ Database Schema

This project relies on a PostgreSQL database (typically managed via Supabase) with a primary users table to store user profile information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, -- Timestamp of user creation
    email TEXT UNIQUE NOT NULL,                  -- User's email address (unique and required)
    password_hash TEXT NOT NULL,                 -- Hashed password (required)
    username TEXT UNIQUE,                        -- Unique username (optional)
    full_name TEXT,                              -- User's full name (optional)
    job_title TEXT,                              -- User's job title (optional)
    company TEXT,                                -- Company user works for (optional)
    department TEXT,                             -- Department within the company (optional)
    bio TEXT,                                    -- Short biography (optional)
    last_sign_in_at TIMESTAMP WITH TIME ZONE     -- Timestamp of last sign-in (optional)
);

-- Indexes for faster lookups on frequently queried columns
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
```



## 📂 Folder Structure


## Directory Descriptions

### `/app`
- Root directory for Next.js App Router
- Contains:
  - API routes (`/api`)
  - Page routes (`/(your_pages)`)
  - Application layout and global styles

### `/components`
- Reusable React components (non-UI primitives)
- Includes:
  - Modals
  - Tables
  - Sidebar and Header components

### `/contexts`
- React Context providers
- Currently contains SideBar context management

### `/db`
- Database configuration
- Contains Supabase client initialization

### `/hooks`
- Custom React hooks
- Example: `useMediaQuery` for responsive logic

### `/public`
- Static assets (images, fonts, etc.)

### `/services`
- Business logic for external API interactions
- Contains API service functions for user operations

### `/stores`
- Zustand state management stores
- Includes:
  - Sidebar state
  - Search page state persistence

### `/types`
- TypeScript type definitions
- Includes:
  - Table component types
  - User profile types
  - Other shared types

### `/ui`
- Reusable UI primitive components (design system)
- Includes:
  - Buttons
  - Inputs
  - Modals
  - Tables and skeleton loaders

### `/utils`
- Utility functions
- Currently contains mock data generation






# 🔌 API Routes

The project utilizes Next.js API Routes (part of the App Router) as a proxy layer.

**Location:** `app/api/proxy/[...path]/route.ts`

## Key Endpoints and Handlers

### `GET(request, context)`
**Endpoint:** `/api/proxy/users?full_name=...`  
**Function:** Fetches user data, supports filtering by `full_name`

### `POST(request, context)`
**Endpoint:** `/api/proxy/users` (for user creation) or `/api/proxy/users?full_name=...` (for search)  
**Function:** Handles creating new user records or performing search queries

### `PUT(request, context)`
**Endpoint:** `/api/proxy/users` (for user updates)  
**Function:** Updates existing user records

### `DELETE(request, context)`
**Endpoint:** `/api/proxy/users?username=...`  
**Function:** Deletes user records based on username
