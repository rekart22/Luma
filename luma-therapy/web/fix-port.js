const { execSync } = require('child_process');
const fs = require('fs');

// Ensure .env.local exists with the correct port
if (!fs.existsSync('.env.local')) {
  fs.writeFileSync('.env.local', 'NEXT_PUBLIC_SITE_URL=http://localhost:3004\n');
  console.log('Created .env.local with correct port configuration');
}

// Run the development server with the correct port
console.log('Starting Next.js development server on port 3004...');
try {
  execSync('npm run dev -- -p 3004', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development server:', error);
  process.exit(1);
} 