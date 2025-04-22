import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Gallery from './Components/Gallery';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import ProfilePage from './Components/ProfilePage';
import PrivateRoute from './PrivateRoute';
import { useAuth } from './AuthContext';

const App = () => {
  const { user } = useAuth();

  const publicLayout = (page) => (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-100 to-pink-200">
      {page}
    </div>
  );

  const mainLayout = (PageComponent) => (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-100 to-pink-200">
      <Header />
      <PageComponent />
      <Footer />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={publicLayout(<LoginPage />)} />
        <Route path="/signup" element={publicLayout(<SignupPage />)} />
        <Route path="/home" element={<PrivateRoute>{mainLayout(HomePage)}</PrivateRoute>} />
        <Route path="/gallery" element={<PrivateRoute>{mainLayout(Gallery)}</PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute>{mainLayout(ProfilePage)}</PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
