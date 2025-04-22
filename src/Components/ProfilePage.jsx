import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';

const ProfilePage = () => {
  const [artworks, setArtworks] = useState([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const user = auth.currentUser;
  const fileInputRef = useRef(null);

  const fetchUserArtworks = async () => {
    if (!user) return;

    const userId = user.uid; // Get the Firebase user ID
    console.log('Fetching artworks for user ID:', userId);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5000/user-artworks?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch artworks');
      }

      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching user artworks:', error);
    }
  };

  const handleImageChange = (event) => {
    const selected = event.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file || !title || !artist) {
      alert('Please provide an image, title, and artist name.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('user_id', user.uid); // Use Firebase user ID

    try {
      const response = await fetch('http://localhost:5000/upload-artwork', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload success:', result);
      alert('Artwork uploaded successfully!');
      fetchUserArtworks(); // Refresh the artworks list after upload
    } catch (error) {
      console.error('Upload error:', error.message);
      alert(`Upload failed: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await user.getIdToken();
      await fetch(`http://localhost:5000/delete-artwork/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUserArtworks();
    } catch (error) {
      console.error('Error deleting artwork:', error);
    }
  };

  useEffect(() => {
    if (user) fetchUserArtworks();
  }, [user]);

  return (
    <section className="bg-pink-50 py-12 px-4 min-h-screen animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-pink-600 mb-10 text-center">🎨 Your Dashboard</h2>

        {/* Upload Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleUpload();
          }}
          className="bg-white p-8 rounded-xl shadow-md mb-12 space-y-6 border border-pink-100"
        >
          <h3 className="text-2xl font-semibold text-pink-500 mb-4 text-center">Upload New Artwork</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Artwork Title"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Artist Name"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="block w-full mt-2 text-sm"
            onChange={handleImageChange}
            required
          />

          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain mx-auto rounded shadow-md" />
            </div>
          )}

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 shadow"
          >
            Upload
          </button>
        </form>

        {/* User Artworks */}
        <h3 className="text-3xl font-bold text-pink-600 mb-6 text-center">🖼️ Your Uploaded Artworks</h3>
        {artworks.length === 0 ? (
          <p className="text-gray-600 text-center">You haven't uploaded any artworks yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition relative group"
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h4 className="text-lg font-semibold mt-3">{artwork.title}</h4>
                <p className="text-sm text-gray-600">By {artwork.artist}</p>
                <button
                  onClick={() => handleDelete(artwork.id)}
                  className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 hover:bg-red-100 transition"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
