import React, { useState, useRef } from 'react';

const UploadArtwork = () => {
  const [file, setFile] = useState(null);       // store the File, not the preview
  const [preview, setPreview] = useState(null); // preview URL
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;

    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const handleUpload = async () => {
    if (!file) return;                          // safety guard
    // …upload logic here…
  };

  return (
    <section id="upload" className="bg-gray-100 py-12 container mx-auto text-center">
      <h2 className="text-2xl mb-4">Upload Your Artwork</h2>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mx-auto block"
      >
        Select Image
      </button>

      {preview && <img src={preview} alt="Selected" className="mt-4 max-h-80 mx-auto" />}

      <button
        type="button"
        disabled={!file}                         // 🔑 only clickable with a file
        onClick={handleUpload}
        className={`mt-4 mx-auto block font-bold py-2 px-4 rounded
          ${file ? 'bg-pink-500 hover:bg-pink-600 text-white'
                 : 'bg-gray-300 cursor-not-allowed text-gray-400'}`}
      >
        Upload
      </button>
    </section>
  );
};

export default UploadArtwork;
