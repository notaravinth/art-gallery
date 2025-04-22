import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/user-artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artist: user.email }),
      })
        .then((res) => res.json())
        .then((data) => setArtworks(data))
        .catch((error) => console.error('Error fetching user artworks:', error));
    }
  }, [user]);

  if (!user) {
    return <div className="text-center mt-10 text-pink-600 font-semibold">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-pink-100 py-12 px-4 text-center">
      <h2 className="text-4xl font-bold text-pink-700 mb-6">Welcome, {user.email}</h2>
      <p className="text-lg text-gray-700 mb-10">Here's your personal art dashboard ✨</p>

      {artworks.length === 0 ? (
        <p className="text-gray-600">You haven’t uploaded any artworks yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl duration-300"
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-4">{artwork.title}</h3>
              <p className="text-gray-500">By {artwork.artist}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
