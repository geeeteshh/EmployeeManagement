# Employee Management System

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) to manage employee records, departments, and directories securely.

## Features

- **User Authentication**: Secure JWT-based login and registration system.
- **Employee Directory**: View a list of all employees and search by name.
- **Employee Management**: Add, edit, and delete employee records (Full Name, Email, Mobile Number, Department, Designation, and Joining Date).
- **Responsive Dashboard**: Features dynamic statistics including total headcount, active departments, and recent hires.
- **Dark/Light Mode**: Toggleable visual themes tailored to user preference.

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

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)

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

### Running the Application

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

3. Open your browser and navigate to `http://localhost:5173` (or the port provided by Vite).

## License
MIT License
