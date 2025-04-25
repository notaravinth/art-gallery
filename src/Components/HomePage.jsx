import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center animate-fade-in px-4">
      <h1 className="text-5xl font-extrabold mb-12 text-pink-600">Welcome to your Art Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <div
          onClick={() => navigate('/gallery')}
          className="cursor-pointer bg-pink-400 hover:bg-pink-500 text-white py-10 px-8 rounded-xl shadow-lg text-2xl font-semibold transform transition-transform hover:scale-105"
        >
          🎨 View Gallery
        </div>
        <div
          onClick={() => navigate('/profile')}
          className="cursor-pointer bg-pink-400 hover:bg-pink-500 text-white py-10 px-8 rounded-xl shadow-lg text-2xl font-semibold transform transition-transform hover:scale-105"
        >
          ⬆️ Upload Artwork
        </div>
      </div>
    </div>
  );
};

export default HomePage;
