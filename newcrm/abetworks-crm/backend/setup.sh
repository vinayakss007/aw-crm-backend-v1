#!/bin/bash

# ABETWORKS CRM Backend Setup Script

echo "Setting up ABETWORKS CRM Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before proceeding."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm before proceeding."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file with default configuration..."
    cp .env.example .env 2>/dev/null || echo "Please create a .env file with your database configuration"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "Dependencies installed successfully!"
else
    echo "Failed to install dependencies."
    exit 1
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Build TypeScript
echo "Building TypeScript files..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
else
    echo "Build failed."
    exit 1
fi

echo "ABETWORKS CRM Backend setup complete!"
echo "To start the server, run: npm run dev"