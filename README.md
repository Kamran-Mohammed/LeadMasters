# LeadMasters

LeadMasters is a platform for users to take coding quizzes online. Users can sign up, log in, attempt quizzes with timers, and see results immediately after submission.

## Features

- User authentication (signup, login, logout)
- Quiz system with timer and navigation
- Question status indicator (answered/unanswered)
- Auto-submit after timer ends
- Responsive frontend using React
- Backend API using Node.js, Express, MongoDB

## Tech Stack

- Frontend: React.js, CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT, HttpOnly Cookies
- API Testing: Postman / curl

## Setup Instructions

### 1. Clone the repository

- git clone https://github.com/Kamran-Mohammed/LeadMasters.git
- cd leadmasters

### 2. Backend Setup

- cd backend
- npm install
- npm run start

API will run on http://localhost:5003

> Note: For ease of evaluation, a `.env` file is included with this repository.
> This contains the MongoDB connection URI and JWT secret specifically for this project.
> You can run the project immediately without setting up your own database.

### 3. Frontend Setup

- cd frontend
- npm install
- npm start

Frontend will run on http://localhost:3000

### 4. API Endpoints

- POST /api/auth/signup – Create a new user
- POST /api/auth/login – Login a user
- GET /api/auth/logout – Logout a user
- GET /api/auth/isLoggedIn – Check if user is logged in
- GET /api/questions – Fetch quiz questions

### 5. Testing API

You can use Postman or curl to test the API endpoints.

### 6. Postman Collection

- A Postman collection file is included in the `backend` folder (LeadMasters.postman_collection.json).
- Open Postman → Click Import → Select the file → All endpoints will be available for testing.
- This allows you to quickly test signup, login, logout, and quiz-related API calls without manually typing URLs or request bodies.
