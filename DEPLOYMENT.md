# Deployment Guide

This project is configured for static export and can be deployed to Coolify.

## Prerequisites

- Node.js (v18 or higher)
- Docker
- Supabase CLI (for local development with Ekobase)

## Local Development

### Starting the Supabase Backend

1. Navigate to the project directory
2. Run `supabase start` to start the local Supabase instance
3. The services will be available at:
   - Studio: http://127.0.0.1:54333
   - API: http://127.0.0.1:54331
   - Database: postgresql://postgres:postgres@127.0.0.1:54332/postgres

For more details about the Supabase integration, see [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md).

### Starting the Development Server

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. The static files will be generated in the `dist` directory.

## Docker Deployment

The project includes a Dockerfile for containerized deployment:

1. Build the Docker image:
   ```bash
   docker build -t energy-partner-network .
   ```

2. Run the container:
   ```bash
   docker run -d -p 3000:80 energy-partner-network
   ```

## Coolify Deployment

To deploy to Coolify:

1. Create a new project in Coolify
2. Link your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install` (default)
4. Coolify will automatically build and deploy your site

## Environment Variables

Since this is a static site, environment variables should be used only for build-time configuration. Runtime environment variables won't work with static export.

## Contact Forms

The contact forms are now functional with Supabase integration for local development. Data is stored in the `contact_submissions` table in the local Supabase database.

For production deployment, you can either:

1. Continue using Supabase (hosted version) by updating the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

2. Or connect them to a backend service like:
   - Formspree
   - Netlify Forms
   - A custom API endpoint
   - EmailJS
   - SendGrid

To switch to another service, update the `ContactForm.tsx` component to send data to your chosen service.

Example with Formspree:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      setSubmitStatus({
        success: true,
        message: 'Thank you for your submission!'
      });
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    setSubmitStatus({
      success: false,
      message: 'There was an error processing your submission.'
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

## Testing

Run tests with:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```