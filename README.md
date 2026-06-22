This is a Vite React SPA for the Energy Partner Network site.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

The app uses React Router and builds to static assets that can be served by Nginx or Coolify.

## Production Deployment

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

For Coolify, use the included `Dockerfile` so the application is built once and served as a standard web container.
