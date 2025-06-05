Project Documentation
🗄️ Database Schema
This project relies on a PostgreSQL database (typically managed via Supabase) with a primary users table to store user profile information.

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


📂 Folder Structure
Here's a high-level overview of the project's folder structure, highlighting the separation of ncerns and typical Next.js App Router conventions.

.
├── app/                      # Next.js App Router root
│   ├── api/                  # Next.js API Routes
│   │   └── proxy/            # API proxy route directory
│   │       └── [...path]/    # Catch-all dynamic route for proxying requests
│   │           └── route.ts  # Main API route handler for proxying
│   ├── (your_pages)/         # Grouping for specific page routes (e.g., users, search)
│   │   └── users/            # Example route for user management pages
│   │       ├── page.tsx      # Main user list page
│   │       └── search/       # Sub-route for user search functionality
│   │           └── page.tsx  # User search page
│   └── layout.tsx            # Root layout for the entire application (includes providers)
│   └── globals.css           # Global CSS styles (e.g., Tailwind directives, custom animations)
├── components/               # Reusable React components that are *not* UI primitives
│   ├── modals/               # Components specific to modals (e.g., UserProfileDetailModal)
│   ├── tables/               # Table-related components (e.g., UserTable, UserTableSkeleton)
│   ├── SideBar.tsx           # Global sidebar component
│   └── Header.tsx            # Global header component
├── contexts/                 # React Context API providers
│   └── SideBarContext.tsx    # Context for managing sidebar state
├── db/                       # Database related configurations or client initializations
│   └── client.ts             # Supabase client instance
├── hooks/                    # Custom React Hooks
│   └── useMediaQuery.ts      # Example hook for responsive logic (or leverage Tailwind CSS directly)
├── public/                   # Static assets (images, fonts, etc.)
├── services/                 # Business logic for interacting with external APIs/services
│   └── api/                  # Specific API call functions
│       ├── updateUserProfileApi.ts # Function for updating user profiles
│       └── deleteUserApi.ts        # Function for deleting users
├── stores/                   # Zustand global state stores
│   ├── sidebarStore.ts       # Zustand store for sidebar state
│   └── searchStore.ts        # Zustand store for search page state persistence
├── types/                    # TypeScript type definitions
│   ├── TableTypes.ts         # Types for table component props and column definitions
│   ├── userTypes.ts          # Types for UserProfile and related schemas
│   └── ...                   # Other shared types
├── ui/                       # Reusable UI primitive components (design system components)
│   ├── Button.tsx            # Generic button component
│   ├── Input.tsx             # Generic input component
│   ├── Modal.tsx             # Generic modal component (with sub-components)
│   ├── SkeletonTable.tsx     # Generic skeleton table component
│   └── Table.tsx             # Generic table component (composed of TableHead, TableBody, etc.)
└── utils/                    # Utility functions
    └── mockTableData.ts      # Mock data generation for development


🔌 API Routes
The project utilizes Next.js API Routes (part of the App Router) primarily as a proxy layer to interact with a third-party API (like Supabase) from the client-side. This setup is crucial for security and flexibility.

Location: app/api/proxy/[...path]/route.ts

Purpose of the Proxy API:

Security: Hides sensitive API keys (e.g., Supabase Service Role Key) from the client-side.

CORS Bypass: Allows your frontend to make requests to external APIs without CORS restrictions.

Abstraction & Control: Provides a central point for server-side logic (e.g., logging client IP addresses, validation, rate-limiting, authentication checks, data transformation).

Dynamic Routing: The [...path] segment makes the proxy dynamic, allowing it to forward requests to various underlying API endpoints (e.g., /api/proxy/users or /api/proxy/products).

How it Works:

Client-Side Request: Your React components (Client Components) make fetch requests to a relative path like /api/proxy/users or /api/proxy/users?full_name=John%20Doe.

Next.js Server Intercepts: The Next.js server intercepts these requests.

Proxy Logic Executes: The code in app/api/proxy/[...path]/route.ts runs on the server.

It extracts dynamic path segments (context.params.path) and query parameters (request.url.searchParams).

It constructs the full URL for the actual third-party API.

It includes any necessary server-side secrets (like SUPABASE_SERVICE_ROLE_KEY) in the headers for the outbound request.

It makes the actual fetch call to the third-party API.

It processes the response and forwards it back to the client.

Key Endpoints and Handlers:

The route.ts file exports functions for each HTTP method it handles, following the App Router conventions:

GET(request, context):

Client Usage: GET /api/proxy/users?full_name=Alice%20Smith

Server Logic: Extracts full_name from request.url.searchParams. Queries the users table in Supabase (e.g., using supabase.from('users').ilike('full_name', '%Alice Smith%')). Returns search results.

POST(request, context):

Client Usage: POST /api/proxy/users (with JSON body for new user creation) OR POST /api/proxy/users?full_name=Alice (if search is handled via POST query params, as per your setup).

Server Logic: Parses request.json() (for body) or request.url.searchParams (for query params). Calls Supabase for insert or search.

PUT(request, context):

Client Usage: PUT /api/proxy/users (with JSON body including identifier for update)

Server Logic: Parses request.json() for updatedUser data. Calls Supabase to update a record (e.g., supabase.from('users').update(...).eq('id', userId)).

DELETE(request, context):

Client Usage: DELETE /api/proxy/users?username=user_to_delete

Server Logic: Extracts username from request.url.searchParams. Calls Supabase to delete a record (e.g., supabase.from('users').delete().eq('username', usernameToDelete)).
