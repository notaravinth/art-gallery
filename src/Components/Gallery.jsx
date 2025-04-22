import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await fetch('http://localhost:5000/artworks');
        const data = await res.json();
        setArtworks(data);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <section id="gallery" className="bg-pink-200 py-12 container mx-auto text-center px-4">
      <h2 className="text-3xl font-bold mb-6 text-pink-700">Art Gallery</h2>
      {artworks.length === 0 ? (
        <p className="text-gray-600">No artworks uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-4 transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
            >
              {artwork.image ? (
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-600">
                  No Image Available
                </div>
              )}
              <h3 className="text-xl font-semibold mt-4">{artwork.title}</h3>
              <p className="text-gray-600">By {artwork.artist}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Gallery;
