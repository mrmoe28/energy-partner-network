const { createClient } = require('@supabase/supabase-js');

// Supabase configuration for local instance
const supabaseUrl = 'http://127.0.0.1:54331';
const supabaseAnonKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  // Test inserting a contact submission
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Company',
        partner_type: 'dealer',
        message: 'This is a test message',
      }
    ]);
  
  if (error) {
    console.error('Error inserting data:', error);
    return;
  }
  
  console.log('Successfully inserted test data:', data);
  
  // Test querying the data
  const { data: queryData, error: queryError } = await supabase
    .from('contact_submissions')
    .select('*')
    .limit(5);
  
  if (queryError) {
    console.error('Error querying data:', queryError);
    return;
  }
  
  console.log('Successfully queried data:', queryData);
}

testSupabase();