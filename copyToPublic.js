const fs = require('fs');
const path = require('path');

// Source file path (output from convertExcel.js)
const sourcePath = path.join(__dirname, 'src', 'conversion', 'real_estate_dataset.json');

// Destination in public folder
const destinationPath = path.join(__dirname, 'public', 'real_estate_dataset.json');

try {
  // Check if source file exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    console.log('Please run convertExcel.js first.');
    process.exit(1);
  }

  // Copy file to public directory
  fs.copyFileSync(sourcePath, destinationPath);
  console.log(`✅ Successfully copied data file to public folder: ${destinationPath}`);
} catch (error) {
  console.error('❌ Error copying file:', error);
}
