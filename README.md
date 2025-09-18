# CarPoolMate 🚗

A modern carpooling application built with Node.js, Express, MongoDB, and React.

## 🚀 Features

- **User Authentication** - Secure login/register with JWT
- **Ride Management** - Create, search, and join rides
- **Review System** - Rate and review rides
- **Protected Routes** - Secure access to user-specific features
- **Responsive Design** - Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
Carpoooling_app/
├── backend/                 # Backend server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── api/           # API services
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### 1. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend/` folder with your MongoDB Atlas credentials:

```bash
cd backend
echo "MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/carpoolingDb?retryWrites=true&w=majority" > .env
echo "JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production" >> .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env
```

### 3. Start Development Servers

```bash
# From the main project folder
npm run dev
```

This will start both backend (port 5000) and frontend (port 5173) servers simultaneously.

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Rides
- `GET /api/rides` - Get all rides
- `POST /api/rides` - Create new ride (protected)
- `GET /api/rides/search` - Search rides
- `POST /api/rides/join` - Join a ride (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/ride/:rideId` - Get reviews for a ride
- `GET /api/reviews/user` - Get user reviews (protected)

## 🧪 Testing the App

1. **Start both servers** (backend on port 5000, frontend on port 5173)
2. **Open browser** and navigate to `http://localhost:5173`
3. **Register a new account** or login with existing credentials
4. **Create a ride** from the Create Ride page
5. **Search for rides** from the Search Ride page
6. **Join rides** and leave reviews

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for secure password storage
- **Protected Routes** - Middleware for secure endpoints
- **Input Validation** - Server-side validation
- **CORS Configuration** - Secure cross-origin requests

## 📞 Support

For support and questions:
- Email: carpoolmate@gmail.com
- Phone: +91 9898849209

---

**Happy Carpooling! 🚗💚**
