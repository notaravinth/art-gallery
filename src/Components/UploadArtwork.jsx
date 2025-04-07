import React, { useState, useRef } from 'react';

const UploadArtwork = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleUpload = async () => {
    // Implement logic to upload the image to the server
    console.log('Upload logic goes here');
  };

  return (
    <section id="upload" className="bg-gray-100 py-12 container mx-auto text-center">
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
          className="bg-pink-200 hover:bg-pink-300 text-white font-bold py-2 px-4 rounded mx-auto block"
        >
          Select Image
        </button>
        {selectedImage && (
          <img src={selectedImage} alt="Selected Image" className="mt-4" />
        )}
        <button
          type="button"
          onClick={handleUpload}
          className="bg-pink-200 hover:bg-pink-300 text-white font-bold py-2 px-4 rounded mx-auto block mt-4"
        >
          Upload
        </button>
      </form>
    </section>
  );
};

export default UploadArtwork;
