import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-pink-300 py-4 container mx-auto flex justify-between items-center px-4 rounded-b-xl shadow">
      <div className="text-lg font-bold text-white">Art Gallery</div>
      <ul className="flex items-center space-x-4 text-white font-medium">
        <li><Link to="/" className="hover:underline">View Gallery</Link></li>
        <li><Link to="/upload" className="hover:underline">Upload Artwork</Link></li>
        <li><a href="#profile" className="hover:underline">Profile</a></li>
      </ul>
    </header>
  );
};

export default Header;
