const { createClient } = require('@supabase/supabase-js');

// Supabase configuration for local instance
const supabaseUrl = 'http://127.0.0.1:54331';
// Use the service role key for full access
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY';

// Create the Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listSubmissions() {
  console.log('=== Contact Form Submissions ===\n');
  
  // Query all submissions
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching submissions:', error);
    return;
  }
  
  if (data.length === 0) {
    console.log('No submissions found.');
    return;
  }
  
  console.log(`Found ${data.length} submission(s):\n`);
  
  data.forEach((submission, index) => {
    console.log(`${index + 1}. ${submission.name} (${submission.email})`);
    console.log(`   Company: ${submission.company || 'N/A'}`);
    console.log(`   Partner Type: ${submission.partner_type}`);
    console.log(`   Status: ${submission.status}`);
    console.log(`   Submitted: ${new Date(submission.created_at).toLocaleString()}`);
    console.log(`   Message: ${submission.message}`);
    console.log('---');
  });
}

async function updateSubmissionStatus(submissionId, newStatus) {
  console.log(`Updating submission ${submissionId} status to ${newStatus}...`);
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ status: newStatus })
    .eq('id', submissionId);
  
  if (error) {
    console.error('Error updating submission:', error);
    return;
  }
  
  console.log('Submission status updated successfully!');
}

async function deleteSubmission(submissionId) {
  console.log(`Deleting submission ${submissionId}...`);
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', submissionId);
  
  if (error) {
    console.error('Error deleting submission:', error);
    return;
  }
  
  console.log('Submission deleted successfully!');
}

// Simple command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'list') {
    await listSubmissions();
  } else if (args[0] === 'update' && args.length === 3) {
    await updateSubmissionStatus(args[1], args[2]);
  } else if (args[0] === 'delete' && args.length === 2) {
    await deleteSubmission(args[1]);
  } else {
    console.log('Usage:');
    console.log('  node admin-contact-manager.js list          - List all submissions');
    console.log('  node admin-contact-manager.js update <id> <status> - Update submission status');
    console.log('  node admin-contact-manager.js delete <id>   - Delete a submission');
  }
}

main();