#!/bin/bash
set -e

# Start kinder-blockly on its internal port, in the background
python -m kinder_blockly --port 5000 &

# Start Node (binds to $PORT for Heroku)
cd server && npm start
