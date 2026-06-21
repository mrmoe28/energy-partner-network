# Ekobase/Supabase Integration Documentation

This document provides information about the Supabase integration for the Energy Partner Network website.

## Overview

The Energy Partner Network website uses Supabase (Ekobase) as its backend for storing contact form submissions. This allows for a serverless architecture while still providing database functionality.

## Local Development Setup

### Prerequisites

- Docker
- Supabase CLI
- Node.js

### Starting the Local Supabase Instance

1. Navigate to the project directory
2. Run `supabase start` to start the local Supabase instance
3. The services will be available at:
   - Studio: http://127.0.0.1:54333
   - API: http://127.0.0.1:54331
   - Database: postgresql://postgres:postgres@127.0.0.1:54332/postgres

### Database Schema

The contact form submissions are stored in the `contact_submissions` table with the following structure:

```sql
create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  company text,
  partner_type text not null,
  message text not null,
  status text default 'new' not null
);
```

### Environment Variables

The following environment variables are used for Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54331
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

## Frontend Integration

### Supabase Client

The Supabase client is configured in `src/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Contact Form Component

The `ContactForm` component in `src/components/ContactForm.tsx` handles form submissions to Supabase:

```typescript
const { data, error } = await supabase
  .from('contact_submissions')
  .insert([
    {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      partner_type: formData.partnerType,
      message: formData.message,
    }
  ]);
```

## Admin Management

### Listing Submissions

To list all contact form submissions:

```bash
node admin-contact-manager.js list
```

### Updating Submission Status

To update the status of a submission:

```bash
node admin-contact-manager.js update <submission_id> <new_status>
```

### Deleting Submissions

To delete a submission:

```bash
node admin-contact-manager.js delete <submission_id>
```

## Security

Row Level Security (RLS) policies have been implemented:

- Public users can insert contact submissions
- Authenticated users can read and update submissions
- Service role key is required for administrative operations

## Testing

To test the integration:

1. Submit a form through the website UI
2. Verify the submission appears in Supabase Studio
3. Use the admin scripts to manage submissions

## Troubleshooting

### Port Conflicts

If you encounter port conflicts when starting Supabase, modify the ports in `supabase/config.toml`:

```toml
[api]
port = 54331

[db]
port = 54332

[studio]
port = 54333

[inbucket]
port = 54334
```

### Connection Issues

Ensure all Supabase containers are running:

```bash
docker ps | grep supabase
```

### Environment Variables

Verify that the environment variables in `.env.local` match your local Supabase instance configuration.