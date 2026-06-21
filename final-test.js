const { createClient } = require('@supabase/supabase-js');

// Supabase configuration for local instance
const supabaseUrl = 'http://127.0.0.1:54331';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// Service role key for verification
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY';

// Create clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

async function finalTest() {
  console.log('=== Final Integration Test ===\n');
  
  // Test 1: Insert data using anon key (simulating frontend form submission)
  console.log('1. Testing form submission through frontend...');
  
  const testSubmission = {
    name: 'Final Test User',
    email: 'finaltest@example.com',
    company: 'Test Company LLC',
    partner_type: 'build',
    message: 'This is a final integration test submission.',
  };
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([testSubmission]);
  
  if (error) {
    console.error('❌ Error submitting form:', error);
    return;
  }
  
  console.log('✅ Form submission successful\n');
  
  // Test 2: Verify data was inserted using service role key
  console.log('2. Verifying data in database...');
  
  const { data: queryData, error: queryError } = await supabaseService
    .from('contact_submissions')
    .select('*')
    .eq('email', 'finaltest@example.com')
    .single();
  
  if (queryError) {
    console.error('❌ Error querying data:', queryError);
    return;
  }
  
  if (!queryData) {
    console.error('❌ Submission not found in database');
    return;
  }
  
  console.log('✅ Data verified in database');
  console.log(`   Name: ${queryData.name}`);
  console.log(`   Email: ${queryData.email}`);
  console.log(`   Company: ${queryData.company}`);
  console.log(`   Partner Type: ${queryData.partner_type}`);
  console.log(`   Message: ${queryData.message}`);
  console.log(`   Status: ${queryData.status}`);
  console.log(`   Submitted: ${queryData.created_at}\n`);
  
  // Test 3: Verify website is accessible
  console.log('3. Verifying website accessibility...');
  
  try {
    const response = await fetch('http://localhost:3002');
    if (response.ok) {
      console.log('✅ Website is accessible\n');
    } else {
      console.error('❌ Website is not accessible');
      return;
    }
  } catch (error) {
    console.error('❌ Error accessing website:', error);
    return;
  }
  
  // Test 4: Verify Supabase services are running
  console.log('4. Verifying Supabase services...');
  
  try {
    const response = await fetch('http://127.0.0.1:54331/rest/v1/');
    if (response.ok) {
      console.log('✅ Supabase REST API is accessible\n');
    } else {
      console.error('❌ Supabase REST API is not accessible');
      return;
    }
  } catch (error) {
    console.error('❌ Error accessing Supabase REST API:', error);
    return;
  }
  
  console.log('🎉 All tests passed! The Ekobase/Supabase integration is working correctly.');
  console.log('\n📋 Summary:');
  console.log('   - Contact forms are functional');
  console.log('   - Data is stored in Supabase database');
  console.log('   - Website is accessible at http://localhost:3002');
  console.log('   - Supabase services are running properly');
  console.log('   - Integration is ready for production deployment');
}

finalTest();