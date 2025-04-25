import React, { useState, useEffect } from 'react';

const hasValidImage = (src) =>
  src && typeof src === 'string' && src.trim() && !['null', 'undefined'].includes(src.trim());

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/artworks');
        const data = await res.json();
        setArtworks(data);
      } catch (err) {
        console.error('Error fetching artworks:', err);
      }
    })();
  }, []);

  // show only artworks with a real image
  const artworksWithImages = artworks.filter((a) => hasValidImage(a.image));

  return (
    <section id="gallery" className="bg-pink-200 py-12 container mx-auto text-center px-4">
      <h2 className="text-3xl font-bold mb-6 text-pink-700">Art Gallery</h2>

      {artworksWithImages.length === 0 ? (
        <p className="text-gray-600">No artworks uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artworksWithImages.map(({ id, image, title, artist }) => (
            <div
              key={id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-4 transition-transform
                         hover:scale-105 hover:shadow-xl duration-300"
            >
              <img src={image} alt={title} className="w-full h-64 object-cover rounded" />
              <h3 className="text-xl font-semibold mt-4">{title}</h3>
              <p className="text-gray-600">By {artist}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Gallery;
