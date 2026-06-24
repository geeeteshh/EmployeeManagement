# Employee Management System

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) to manage employee records, departments, and directories securely.

## Features

- **User Authentication**: Secure JWT-based login and registration system.
- **Employee Directory**: View a list of all employees and search by name.
- **Employee Management**: Add, edit, and delete employee records (Full Name, Email, Mobile Number, Department, Designation, and Joining Date).
- **Responsive Dashboard**: Features dynamic statistics including total headcount, active departments, and recent hires.
- **Dark/Light Mode**: Toggleable visual themes tailored to user preference.
- **Docker Support**: Containerized architecture for easy local development.
- **Deployment-Ready**: Preconfigured for seamless deployment to Vercel (both frontend and serverless backend).

## Tech Stack

### Frontend
- React (Vite)
- CSS3 (Custom styling with CSS variables)
- Context API / Local State Management

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) for authentication
- bcryptjs for password hashing

## API Documentation
The API exposes the following primary endpoints under `/api`:
- **Auth**: `/auth/login`, `/auth/register`
- **Employees**: `/employees` (GET, POST), `/employees/:id` (PUT, DELETE)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)
- Docker & Docker Compose (optional, for containerized run)

### Environment Variables
For the **Backend**, create a `.env` in `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

For the **Frontend**, create a `.env` in `frontend/` (if using a custom API URL):
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/geeeteshh/EmployeeManagement.git
   cd EmployeeManagement
   ```

2. Setup the backend:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory with your MongoDB URI and a JWT secret:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Setup the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Running with Docker (Recommended)
Inside the main directory in terminal with this command
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:80` and the backend at `http://localhost:5000`.

### Running Locally (Without Docker)

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open the browser and navigate to `http://localhost:5173` (or the port provided by Vite).
