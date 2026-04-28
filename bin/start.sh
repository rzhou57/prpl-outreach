#!/bin/bash
set -e

cd server

# Start both Node and Python concurrently
npx concurrently -n server,blockly \
  "npm start" \
  "python -m kinder_blockly --port 5000"
