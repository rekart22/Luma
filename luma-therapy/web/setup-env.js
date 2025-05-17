const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Try to load existing .env file if it exists
let supabaseApiKey = 'your-service-role-key-here'; // Default placeholder
try {
  // Check if .env file exists at project root (one level up)
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    if (envConfig.SUPABASE_API_KEY) {
      supabaseApiKey = envConfig.SUPABASE_API_KEY;
      console.log('Found SUPABASE_API_KEY in .env file. Using this value.');
    }
  }
} catch (error) {
  console.log('Error reading .env file:', error.message);
}

// Supabase configuration
const envVars = `# Supabase Configuration - Public Keys (safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://qwtcgfmfxqjbkmbkymdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dGNnZm1meHFqYmttYmt5bWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTg4MTUsImV4cCI6MjA2Mjk5NDgxNX0.Ej5mZSaePhDdInXDtLNV-8DGnkUJ-GvgnB7Dq20Egqc

# Supabase Configuration - Secret Keys (NEVER expose to client)
# This key should ONLY be used in server-side code
SUPABASE_API_KEY=${supabaseApiKey}

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3004
`;

// Write .env.local file
fs.writeFileSync(path.join(__dirname, '.env.local'), envVars);

// Provide appropriate feedback
if (supabaseApiKey === 'your-service-role-key-here') {
  console.log('Environment variables have been set up, but with a placeholder API key.');
  console.log('IMPORTANT: You need to edit .env.local and replace "your-service-role-key-here" with your actual service role key.');
  console.log('Alternatively, create a .env file in the project root with SUPABASE_API_KEY=your-key and run this script again.');
} else {
  console.log('Environment variables have been set up successfully with your Supabase API key!');
}

console.log('REMEMBER: Never commit your .env.local or .env files to version control.');
console.log('You can now run "npm run dev" to start the development server.'); 