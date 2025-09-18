import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateRide from './pages/CreateRide';
import SearchRide from './pages/SearchRide';
import ReviewForm from './pages/ReviewForm';
import Profile from './pages/Profile';
import RideDetails from './pages/RideDetails';
import BookDetails from './pages/BookDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-ride" element={
          <ProtectedRoute>
            <CreateRide />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/search-ride" element={<SearchRide />} />
        <Route path="/review" element={
          <ProtectedRoute>
            <ReviewForm />
          </ProtectedRoute>
        }/>
        <Route path="/ride-details/:id" element={<RideDetails />} />
        <Route path="/book-details/:id" element={
          <ProtectedRoute>
            <BookDetails />
          </ProtectedRoute>
        } />
      </Routes>
      
    </>
  );
}

export default App;
