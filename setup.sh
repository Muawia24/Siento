#!/bin/bash

echo "Setting up AI Mood Tracker..."

# Backend setup
echo "Installing backend dependencies..."
cd backend
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken nodemailer
npm install nodemon --save-dev
cd ..

# Frontend setup
echo "Installing frontend dependencies..."
cd frontend
npm create vite@latest . --template react
npm install
npm install axios react-router-dom recharts
cd ..

echo "Setup complete! Use the following commands to run the project:"
echo "Backend: cd backend && npm start"
echo "Frontend: cd frontend && npm start"
