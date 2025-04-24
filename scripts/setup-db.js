const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run a command and log the output
function runCommand(command) {
  //console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    //console.error(`Error executing command: ${command}`);
    //console.error(error.message);
    return false;
  }
}

// Main function to set up the database
async function setupDatabase() {
  //console.log('Setting up the database...');

  // Check if PostgreSQL is installed
  try {
    execSync('psql --version', { stdio: 'ignore' });
  } catch (error) {
    //console.error('PostgreSQL is not installed or not in PATH. Please install PostgreSQL first.');
    process.exit(1);
  }

  // Create the database if it doesn't exist
  //console.log('Creating database if it does not exist...');
  runCommand('psql -U postgres -c "CREATE DATABASE health_fitness_db;"');

  // Run Prisma migrations
  //console.log('Running Prisma migrations...');
  runCommand('npx prisma migrate dev --name init');

  // Generate Prisma client
  //console.log('Generating Prisma client...');
  runCommand('npx prisma generate');

  //console.log('Database setup completed successfully!');
}

// Run the setup
setupDatabase(); 