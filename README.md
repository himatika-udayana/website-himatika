# HIMATIKA platform

This repository contains multiple independent projects:

- `backend/`: legacy Django REST API
- `himatika-frontend/`: legacy Vite + React app
- root project: new Next.js app for migration

Build and validation are scoped per project. The root Next.js app is intentionally isolated from the legacy folders with explicit TypeScript excludes and project-local commands.

## Next.js app commands

```bash
cd /home/sanandanova_20/Project/website\ himatika
npx tsc --noEmit
npx next build
```

Do not run the root build as if it were a monorepo-wide build across the legacy frontend and backend directories.
