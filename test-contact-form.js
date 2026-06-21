const { createClient } = require('@supabase/supabase-js');

// Supabase configuration for local instance
const supabaseUrl = 'http://127.0.0.1:54331';
const supabaseAnonKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testContactFormSubmission() {
  console.log('Testing contact form submission...');
  
  // Test inserting a contact submission (simulating form submission)
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        company: 'SolarTech Inc.',
        partner_type: 'solar',
        message: 'I am interested in becoming a solar partner with your network.',
      }
    ]);
  
  if (error) {
    console.error('Error submitting contact form:', error);
    return;
  }
  
  console.log('Successfully submitted contact form:', data);
  
  // Test querying the data to verify it was inserted
  const { data: queryData, error: queryError } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (queryError) {
    console.error('Error querying data:', queryError);
    return;
  }
  
  console.log('Most recent submission:', queryData[0]);
  console.log('Contact form integration is working correctly!');
}

testContactFormSubmission();