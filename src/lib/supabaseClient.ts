import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anon key from environment variables
// For local development, these will be the local Supabase instance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);