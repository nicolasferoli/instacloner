#!/bin/bash

# Build main project
npm run build

# Build landing page
cd lp
npm install
npm run build

# Ensure dist directory exists in root
cd ..
mkdir -p dist/lp

# Copy lp build to dist/lp
cp -r lp/dist/* dist/lp/

echo "Build completed. Main site in dist/ and Landing Page in dist/lp/" 