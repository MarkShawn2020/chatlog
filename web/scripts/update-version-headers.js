#!/usr/bin/env node

/**
 * Pre-commit hook script to update version headers in source files
 * Adds/updates @version with current git commit hash
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get latest commit hash (short)
function getLatestCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch (error) {
    // During initial commit, HEAD doesn't exist yet
    return '0000000';
  }
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Get list of staged files
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8'
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    return [];
  }
}

// Check if file should have version header
function shouldUpdateFile(filePath) {
  // Only update TypeScript/JavaScript files in src directory
  const ext = path.extname(filePath);
  // Handle both 'src/' and 'web/src/' paths (for monorepo)
  const isInSrc = filePath.includes('/src/') || filePath.startsWith('src/');
  return (
    (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx') &&
    isInSrc &&
    fs.existsSync(filePath)
  );
}

// Create or update version header
function updateVersionHeader(content, commitHash, date) {
  const versionComment = `/**
 * @version ${commitHash}
 * @lastModified ${date}
 */`;

  // Pattern to match existing version header
  const headerPattern = /^\/\*\*\s*\n(\s*\*\s*@version\s+.+\s*\n)?(\s*\*\s*@lastModified\s+.+\s*\n)?\s*\*\/\s*\n/;

  if (headerPattern.test(content)) {
    // Update existing header
    return content.replace(headerPattern, versionComment + '\n');
  } else {
    // Add new header at the beginning
    return versionComment + '\n' + content;
  }
}

// Update version.ts with git commit info
function updateVersionFile(commitHash, currentDate) {
  const versionFilePath = 'src/utils/version.ts';

  if (!fs.existsSync(versionFilePath)) {
    return false;
  }

  try {
    const content = fs.readFileSync(versionFilePath, 'utf-8');

    // Update GIT_COMMIT_HASH
    let updatedContent = content.replace(
      /export const GIT_COMMIT_HASH = '[^']*';/,
      `export const GIT_COMMIT_HASH = '${commitHash}';`
    );

    // Update GIT_COMMIT_DATE
    updatedContent = updatedContent.replace(
      /export const GIT_COMMIT_DATE = '[^']*';/,
      `export const GIT_COMMIT_DATE = '${currentDate}';`
    );

    if (content !== updatedContent) {
      fs.writeFileSync(versionFilePath, updatedContent, 'utf-8');
      execSync(`git add "${versionFilePath}"`, { encoding: 'utf-8' });
      console.log(`✓ Updated version file: ${versionFilePath}`);
      return true;
    }
  } catch (error) {
    console.error(`✗ Error updating version file:`, error.message);
  }

  return false;
}

// Main execution
function main() {
  const commitHash = getLatestCommitHash();
  const currentDate = getCurrentDate();
  const stagedFiles = getStagedFiles();

  // Always update version.ts file
  updateVersionFile(commitHash, currentDate);

  if (stagedFiles.length === 0) {
    console.log('No staged files to update');
    return;
  }

  let updatedCount = 0;

  stagedFiles.forEach(file => {
    // Remove 'web/' prefix if present (for monorepo structure)
    const normalizedFile = file.startsWith('web/') ? file.substring(4) : file;

    if (!shouldUpdateFile(normalizedFile)) {
      return;
    }

    try {
      const content = fs.readFileSync(normalizedFile, 'utf-8');
      const updatedContent = updateVersionHeader(content, commitHash, currentDate);

      if (content !== updatedContent) {
        fs.writeFileSync(normalizedFile, updatedContent, 'utf-8');
        // Re-stage the modified file (use normalized path for git)
        execSync(`git add "${normalizedFile}"`, { encoding: 'utf-8' });
        updatedCount++;
        console.log(`✓ Updated version header: ${normalizedFile}`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${file}:`, error.message);
    }
  });

  if (updatedCount > 0) {
    console.log(`\n✓ Updated ${updatedCount} file(s) with version ${commitHash}`);
  }
}

main();
