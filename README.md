# Decode and Dominate 2.O Trial

A full-stack contest application with admin controls, participant rounds, proctoring enforcement, and deployment-ready backend/frontend integration.

## Deployment

- Live URL: https://finalllliieieiiei.onrender.com
- Platform: Render
- Build command: `npm run build`
- Start command: `npm run start`

## Project Overview

This repository contains:

- `client/`: React + TypeScript front-end built with Vite
- `server/`: Express + TypeScript backend server and API routes
- `shared/`: shared schema and validation definitions
- `script/`: custom build tooling for bundling server and client code
- `drizzle.config.ts`: database schema configuration
- `render.yaml`: deployment manifest for Render

## Frontend

The client is built in `client/` and includes:

- `App.tsx`: main application shell and routing
- `index.css`: global styles
- `main.tsx`: Vite entry point
- `components/`: UI components and app pages
- `hooks/`: custom hooks including anti-cheat, mobile detection, toast integration, and proctoring
- `lib/`: shared client utilities and query client setup
- `pages/`: application pages such as `Home`, `About`, `Login`, `Admin`, and contest rounds (`Round1`, `Round2`, `Round3`)

### Key UI Features

- Role-based auth flow for participants and admins
- Fullscreen entry and round unlock logic for each round
- Live admin security logs for proctoring and anti-cheat events
- Admin control panel with real-time violation tracking
- Question setter and round management tools for admin users
- Round-wise evaluation logic and progression gating
- Modal and notification support
- Responsive UI components built with custom design system primitives

## Feature Highlights

- **Admin control:** Admin users can manage contest progress from a dedicated dashboard, monitor security alerts, and review live event logs.
- **Live security logs:** Every prohibited action is captured and displayed in real time for admins, including window/tab change detection and focus loss.
- **Question setter:** Admins can prepare, enable, and manage round questions through the admin interface.
- **Round-wise evaluation:** Contest rounds are gated by unlock logic, with separate entry conditions, scoring rules, and progression checks for `Round1`, `Round2`, and `Round3`.

## Backend

The server is built in `server/` and includes:

- `index.ts`: Express app startup
- `routes.ts`: API routes and endpoints
- `static.ts`: static file serving for production build
- `storage.ts`: in-memory / lightweight storage utilities
- `vite.ts`: production Vite server integration

## Shared

- `shared/schema.ts`: shared schema definitions, validation, and data models used by both client and server

## Database & ORM

- Uses `drizzle-orm` and `drizzle-zod` for schema definitions and migrations
- `drizzle.config.ts` contains database configuration
- `npm run db:push` is available to push schema migrations

## Scripts

- `npm run dev:client` - start the frontend Vite development server on port 5000
- `npm run dev` - start the backend server in development mode
- `npm run build` - build the client and server for production
- `npm run start` - start the compiled production server
- `npm run check` - run TypeScript type checks
- `npm run db:push` - push database schema changes with Drizzle

## Dependencies

This project uses a modern full-stack stack including:

- React 19
- Vite
- Express
- TypeScript
- Tailwind CSS
- Drizzle ORM
- React Query
- Radix UI primitives
- Passport local auth
- PostgreSQL client support

## Notes

- The repository is cleaned of platform-specific deployment artifacts and branding.
- `README.md` is the main project overview and launch guide.
- Build and test locally with `npm install`, `npm run check`, and `npm run build`.

## Getting Started Locally

```bash
npm install
npm run check
npm run build
npm run start
```

Then visit `http://localhost:5000` for the running application.
