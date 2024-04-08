# Echo Hub Setup Guide

## Overview
Online-Tambola is a website which is built with MERN stack and Socket.io, it provides different users to play game online and also have chatbox integrated, user can make a room and also join

## How to Run the App

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed locally or accessible remotely.

### Installation
1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.

### Backend Setup
1. Install backend dependencies:
cd backend
npm install

2. Set up environment variables:
- Create a `.env` file in the `backend` directory.
- Define the following variables:
  ```
  PORT=5000
  MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
  JWT_SECRET=YOUR_JWT_SECRET_KEY
  ```

3. Start the backend server:
npm start

### Frontend Setup
1. Navigate back to the project directory:
cd ..


2. Install frontend dependencies:
cd frontend
npm install


3. Start the frontend development server:
npm start

4. Access the Echo Hub application in your web browser at `http://localhost:3000`.