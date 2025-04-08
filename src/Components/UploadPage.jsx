import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
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

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload success:', result);
      navigate('/gallery');
    } catch (error) {
      console.error('Upload error:', error.message);
      alert(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex justify-center items-center animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-pink-600 mb-6">Upload Your Artwork</h2>
        <form className="space-y-4">
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded shadow transition">
            Select Image
          </button>

          {selectedImage && <img src={selectedImage} alt="Selected" className="mx-auto mt-4 max-h-64 rounded shadow" />}

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Artwork Title"
            className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist Name"
            className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            type="button"
            onClick={handleUpload}
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-bold transition shadow"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
