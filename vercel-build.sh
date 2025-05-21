#!/bin/bash

# Build main project
npm run build

# Build landing page
cd lp
npm install
npm run build 