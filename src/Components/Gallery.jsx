import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/artworks')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched artworks:', data);
        setArtworks(data);
      })
      .catch((error) => console.error('Error fetching artworks:', error));
  }, []);

  return (
    <section id="gallery" className="bg-pink-200 py-12 container mx-auto text-center">
      <h2 className="text-2xl mb-4">Art Gallery</h2>
      {artworks.length === 0 ? (
        <p>No artworks uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-white shadow-md p-4">
              <img src={artwork.image} alt={artwork.title} className="w-full max-h-64 object-cover" />
              <h3 className="text-lg mt-2">{artwork.title}</h3>
              <p>By {artwork.artist}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Gallery;
