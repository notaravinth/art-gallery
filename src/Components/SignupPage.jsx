// SignupPage.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/gallery');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-200">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Sign Up
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <span
            className="text-pink-600 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
