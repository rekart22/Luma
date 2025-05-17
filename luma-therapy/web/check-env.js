const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Define the correct port
const CORRECT_PORT = 3004;
const SITE_URL = `http://localhost:${CORRECT_PORT}`;
const SUPABASE_URL = 'https://qwtcgfmfxqjbkmbkymdr.supabase.co';

console.log('🔍 Checking environment configuration...');

// Check for .env and .env.local files
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '..', '.env');

// Variables to track what we find
let hasEnvLocal = false;
let hasEnv = false;
let sitUrlCorrect = false;
let supabaseUrlExists = false;
let supabaseKeyExists = false;
let anonKeyExists = false;

// Check .env.local
if (fs.existsSync(envLocalPath)) {
  hasEnvLocal = true;
  console.log('✅ Found .env.local file');
  
  try {
    const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
    const envLocalVars = dotenv.parse(envLocalContent);
    
    // Check if NEXT_PUBLIC_SITE_URL is correct
    if (envLocalVars.NEXT_PUBLIC_SITE_URL === SITE_URL) {
      sitUrlCorrect = true;
      console.log(`✅ NEXT_PUBLIC_SITE_URL is correctly set to ${SITE_URL}`);
    } else {
      console.log(`❌ NEXT_PUBLIC_SITE_URL is set to ${envLocalVars.NEXT_PUBLIC_SITE_URL}, should be ${SITE_URL}`);
    }
    
    // Check Supabase URL
    if (envLocalVars.NEXT_PUBLIC_SUPABASE_URL === SUPABASE_URL) {
      supabaseUrlExists = true;
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set correctly');
    } else if (envLocalVars.NEXT_PUBLIC_SUPABASE_URL) {
      supabaseUrlExists = true;
      console.log(`⚠️ NEXT_PUBLIC_SUPABASE_URL is set to ${envLocalVars.NEXT_PUBLIC_SUPABASE_URL}`);
    } else {
      console.log('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
    }
    
    // Check Supabase Anon Key
    if (envLocalVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      anonKeyExists = true;
      console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
    } else {
      console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    }
    
    // Check Supabase Secret Key
    if (envLocalVars.SUPABASE_API_KEY) {
      supabaseKeyExists = true;
      console.log('✅ SUPABASE_API_KEY is set');
    } else {
      console.log('❌ SUPABASE_API_KEY is missing');
    }
  } catch (error) {
    console.error('Error reading .env.local file:', error.message);
  }
} else {
  console.log('❌ No .env.local file found');
}

// Check parent .env file
if (fs.existsSync(envPath)) {
  hasEnv = true;
  console.log('✅ Found .env file in parent directory');
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = dotenv.parse(envContent);
    
    // Check for Supabase Secret Key
    if (envVars.SUPABASE_API_KEY && !supabaseKeyExists) {
      supabaseKeyExists = true;
      console.log('✅ SUPABASE_API_KEY found in parent .env file');
    }
  } catch (error) {
    console.error('Error reading parent .env file:', error.message);
  }
} else {
  console.log('❌ No .env file found in parent directory');
}

// Provide summary and recommendations
console.log('\n📋 Environment Summary:');
console.log(`- .env.local file: ${hasEnvLocal ? 'Found' : 'Missing'}`);
console.log(`- Parent .env file: ${hasEnv ? 'Found' : 'Missing'}`);
console.log(`- NEXT_PUBLIC_SITE_URL: ${sitUrlCorrect ? 'Correct' : 'Incorrect/Missing'}`);
console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrlExists ? 'Present' : 'Missing'}`);
console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKeyExists ? 'Present' : 'Missing'}`);
console.log(`- SUPABASE_API_KEY: ${supabaseKeyExists ? 'Present' : 'Missing'}`);

console.log('\n🛠️ Recommended Actions:');
if (!hasEnvLocal || !sitUrlCorrect || !supabaseUrlExists || !anonKeyExists) {
  console.log('1. Run "node setup-env.js" to create/update your .env.local file');
  console.log('2. Then run "node fix-port.js" to ensure the correct port is used');
}

if (!supabaseKeyExists) {
  console.log('3. Create a .env file in the parent directory with your SUPABASE_API_KEY');
}

console.log('\n💡 After making these changes, restart your development server.'); 