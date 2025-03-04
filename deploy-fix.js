const { execSync } = require('child_process');

// Set Node path to only look in the current project
process.env.NODE_PATH = __dirname;

try {
  // Clean the build directory first
  execSync('npx rimraf build', { stdio: 'inherit' });
  
  // Run the build with isolated environment
  execSync('npx react-scripts build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      NODE_PATH: __dirname 
    } 
  });
  
  // Deploy to GitHub Pages
  execSync('npx gh-pages -d build', { stdio: 'inherit' });
  
  console.log('Successfully deployed to GitHub Pages!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}
