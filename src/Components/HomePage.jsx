import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-pink-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-12 text-pink-600">Welcome to the Art Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
        <div
          onClick={() => navigate('/gallery')}
          className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-white py-12 px-8 rounded-lg shadow-md text-2xl font-semibold transition duration-300"
        >
          🎨 View Gallery
        </div>
        <div
          onClick={() => navigate('/upload')}
          className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-white py-12 px-8 rounded-lg shadow-md text-2xl font-semibold transition duration-300"
        >
          ⬆️ Upload Artwork
        </div>
      </div>
    </div>
  );
};

export default HomePage;
