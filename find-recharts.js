const fs = require('fs');
const path = require('path');

// Function to search for recharts in a file
function searchFileForRecharts(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('recharts');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

// Function to walk through directory recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : 
      callback(path.join(dir, f));
  });
}

// Find all files containing 'recharts'
const filesWithRecharts = [];
walkDir('./src', (filePath) => {
  if (searchFileForRecharts(filePath)) {
    filesWithRecharts.push(filePath);
    console.log(`Found 'recharts' in: ${filePath}`);
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Display the relevant part of the file
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('recharts')) {
        console.log(`  Line ${i+1}: ${lines[i].trim()}`);
      }
    }
  }
});

console.log('\nSummary:');
console.log(`Found ${filesWithRecharts.length} files containing 'recharts'`);