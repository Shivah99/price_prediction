const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to temporarily rename the parent package.json
function tempRenameParentPackageJson() {
  const parentPath = path.resolve(__dirname, '..', '..');
  const packageJsonPath = path.join(parentPath, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    fs.renameSync(packageJsonPath, packageJsonPath + '.bak');
    return true;
  }
  return false;
}

// Function to restore the parent package.json
function restoreParentPackageJson() {
  const parentPath = path.resolve(__dirname, '..', '..');
  const packageJsonBackupPath = path.join(parentPath, 'package.json.bak');
  
  if (fs.existsSync(packageJsonBackupPath)) {
    fs.renameSync(packageJsonBackupPath, path.join(parentPath, 'package.json'));
  }
}

// Main execution
try {
  console.log('Building for GitHub Pages...');
  
  // Temporarily rename the parent package.json
  const renamed = tempRenameParentPackageJson();
  if (renamed) {
    console.log('Temporarily renamed parent package.json');
  }
  
  // Clean and build
  console.log('Cleaning build directory...');
  execSync('npx rimraf build', { stdio: 'inherit' });
  
  console.log('Building React app...');
  execSync('npx react-scripts build', { stdio: 'inherit' });
  
  // Deploy to GitHub Pages
  console.log('Deploying to GitHub Pages...');
  execSync('npx gh-pages -d build', { stdio: 'inherit' });
  
  console.log('Successfully deployed to GitHub Pages!');
} catch (error) {
  console.error('Deployment failed:', error);
} finally {
  // Always restore the parent package.json
  restoreParentPackageJson();
  console.log('Restored parent package.json if it was renamed');
}
