const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the correct port
const CORRECT_PORT = 3004;
const SITE_URL = `http://localhost:${CORRECT_PORT}`;

// Function to ensure .env.local exists with the correct port
function ensureEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  
  if (fs.existsSync(envPath)) {
    // If the file exists, read it and update the port if needed
    console.log('Found existing .env.local file, checking port configuration...');
    let content = fs.readFileSync(envPath, 'utf8');
    
    // Look for NEXT_PUBLIC_SITE_URL line and update it
    if (content.includes('NEXT_PUBLIC_SITE_URL=')) {
      // Replace any localhost URL with the correct port
      content = content.replace(
        /NEXT_PUBLIC_SITE_URL=http:\/\/localhost:\d+/g,
        `NEXT_PUBLIC_SITE_URL=${SITE_URL}`
      );
      console.log(`Updated NEXT_PUBLIC_SITE_URL to use port ${CORRECT_PORT}`);
    } else {
      // Add the line if it doesn't exist
      content += `\nNEXT_PUBLIC_SITE_URL=${SITE_URL}\n`;
      console.log(`Added NEXT_PUBLIC_SITE_URL with port ${CORRECT_PORT}`);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(envPath, content);
  } else {
    // Create a new file if it doesn't exist
    fs.writeFileSync(envPath, `NEXT_PUBLIC_SITE_URL=${SITE_URL}\n`);
    console.log(`Created .env.local with port ${CORRECT_PORT} configuration`);
  }
}

// Ensure we have the correct port configuration
ensureEnvFile();

// Run the development server with the correct port
console.log(`Starting Next.js development server on port ${CORRECT_PORT}...`);
try {
  execSync(`npm run dev -- -p ${CORRECT_PORT}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development server:', error);
  process.exit(1);
} 