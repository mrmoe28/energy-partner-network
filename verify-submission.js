const { createClient } = require('@supabase/supabase-js');

// Supabase configuration for local instance
const supabaseUrl = 'http://127.0.0.1:54331';
// Use the service role key for full access
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY';

// Create the Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySubmission() {
  console.log('Verifying contact form submission...');
  
  // Query the data to verify it was inserted
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error querying data:', error);
    return;
  }
  
  console.log('Recent submissions:');
  data.forEach((submission, index) => {
    console.log(`${index + 1}. ${submission.name} (${submission.email}) - ${submission.partner_type}`);
    console.log(`   Company: ${submission.company}`);
    console.log(`   Message: ${submission.message}`);
    console.log(`   Submitted: ${submission.created_at}`);
    console.log('---');
  });
  
  console.log(`Total submissions found: ${data.length}`);
}

verifySubmission();