const fs = require('fs');
const path = require('path');

// Function to replace recharts imports in a file
function fixRechartsImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Check if the file contains recharts
    if (content.includes('recharts')) {
      console.log(`Fixing file: ${filePath}`);
      
      // Remove entire import lines containing recharts
      content = content.split('\n')
        .filter(line => !line.includes('import') || !line.includes('recharts'))
        .join('\n');
      
      // Remove destructured imports from recharts
      content = content.replace(/import\s*{[^}]*recharts[^}]*}\s*from\s*['"][^'"]*['"]/g, '');
      
      // Save the modified file
      fs.writeFileSync(filePath, content, 'utf8');
      
      console.log(`  File updated successfully`);
      return content !== originalContent; // Return true if changes were made
    }
    
    return false; // No changes needed
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
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

// Find and fix all files containing 'recharts'
const fixedFiles = [];
walkDir('./src', (filePath) => {
  // Only process JS and JSX files
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    if (fixRechartsImports(filePath)) {
      fixedFiles.push(filePath);
    }
  }
});

console.log('\nSummary:');
console.log(`Fixed ${fixedFiles.length} files containing 'recharts'`);