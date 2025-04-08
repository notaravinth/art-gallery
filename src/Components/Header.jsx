import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    const authInstance = getAuth();
    signOut(authInstance).then(() => {
      navigate('/login');
    });
  };

  return (
    <header className="bg-pink-500 py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <div className="text-2xl font-bold text-white">🎨 Art Gallery</div>
      <nav>
        <ul className="flex space-x-6 text-white font-medium">
          {user ? (
            <>
              <li><Link to="/home" className="hover:underline">Home</Link></li>
              <li><Link to="/gallery" className="hover:underline">Gallery</Link></li>
              <li><Link to="/upload" className="hover:underline">Upload</Link></li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:underline focus:outline-none"
                >
                  Logout
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
