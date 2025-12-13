import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Catalog from '../pages/Catalog';
import CarDetails from '../pages/CarDetails';
import PostDetails from '../pages/PostDetails';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return !user ? children : <Navigate to="/profile" />;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Private */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
        <Route path="/cars/:id" element={<PrivateRoute><CarDetails /></PrivateRoute>} />
        <Route path="/posts/:id" element={<PrivateRoute><PostDetails /></PrivateRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
