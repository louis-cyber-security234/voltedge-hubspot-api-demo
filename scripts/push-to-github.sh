#!/usr/bin/env bash
set -e

# Replace this with your actual GitHub repo URL after creating the empty repo.
REMOTE_URL="https://github.com/YOUR_USERNAME/voltedge-revops-demo.git"

git init -b main
git add .
git commit -m "Initial VoltEdge RevOps demo portfolio repo"
git remote add origin "$REMOTE_URL"
git push -u origin main
