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
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload success:', result);
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error.message);
      alert(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="h-screen bg-pink-200 flex justify-center items-center">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl mb-4">Upload Your Artwork</h2>
        <form>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded mx-auto block"
          >
            Select Image
          </button>

          {selectedImage && (
            <img src={selectedImage} alt="Selected" className="mt-4 mx-auto max-h-64" />
          )}

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Artwork Title"
            className="mt-4 block w-full md:w-1/2 mx-auto p-2 rounded"
          />

          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist Name"
            className="mt-2 block w-full md:w-1/2 mx-auto p-2 rounded"
          />

          <button
            type="button"
            onClick={handleUpload}
            className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded mx-auto block mt-4"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
