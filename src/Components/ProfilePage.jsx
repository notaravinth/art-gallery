// ProfilePage.jsx ───────────── React dashboard ─────────────
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';

const ProfilePage = () => {
  const [artworks, setArtworks] = useState([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);
  const user = auth.currentUser;

  /* ─── Fetch current user's artworks ───────────────────── */
  const fetchUserArtworks = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `http://localhost:5000/user-artworks?user_id=${user.uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch artworks');
      setArtworks(await res.json());
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ─── File picked ─────────────────────────────────────── */
  const handleImageChange = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  /* ─── Upload artwork ──────────────────────────────────── */
  const handleUpload = async () => {
    if (!file || !title.trim() || !artist.trim()) {
      alert('Please provide image, title, and artist.');
      return;
    }
    if (!user) {
      alert('Not authenticated.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());
    formData.append('artist', artist.trim());
    formData.append('user_id', user.uid);

    try {
      const res = await fetch('http://localhost:5000/upload-artwork', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Upload failed');
      }
      // clear form & refresh list
      setTitle('');
      setArtist('');
      setFile(null);
      setPreview(null);
      fileInputRef.current.value = '';
      await fetchUserArtworks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ─── Delete artwork ──────────────────────────────────── */
  const handleDelete = async (id) => {
    if (deletingId) return;
    try {
      setDeletingId(id);
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:5000/delete-artwork/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => { fetchUserArtworks(); }, [user]);

  /* ─── Render ──────────────────────────────────────────── */
  return (
    <section className="bg-pink-50 py-12 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-pink-600 mb-10 text-center">
          🎨 Your Dashboard
        </h2>

        {/* Upload form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleUpload(); }}
          className="bg-white p-8 rounded-xl shadow-md mb-12 space-y-6 border"
        >
          <h3 className="text-2xl font-semibold text-pink-500 text-center">
            Upload New Artwork
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Artwork Title"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Artist Name"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-pink-300"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="block w-full mt-2 text-sm"
            onChange={handleImageChange}
            required
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain mx-auto rounded shadow-md mt-4"
            />
          )}

          <button
            type="submit"
            className="bg-pink-500 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-pink-600"
          >
            Upload
          </button>
        </form>

        {/* Gallery */}
        <h3 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          🖼️ Your Uploaded Artworks
        </h3>

        {artworks.length === 0 ? (
          <p className="text-gray-600 text-center">You haven't uploaded any artworks yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {artworks.map(({ id, image, title, artist }) => (
              <div
                key={id}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition relative"
              >
                <img src={image} alt={title} className="w-full h-48 object-cover rounded-md" />
                <h4 className="text-lg font-semibold mt-3">{title}</h4>
                <p className="text-sm text-gray-600">By {artist}</p>

                <button
                  onClick={() => handleDelete(id)}
                  disabled={deletingId === id}
                  className={`absolute top-2 right-2 rounded-full p-1 transition
                    ${deletingId === id
                      ? 'bg-gray-200 text-gray-400 cursor-wait'
                      : 'bg-white text-red-500 hover:bg-red-100'}`}
                >
                  {deletingId === id ? '⌛' : '❌'}
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
