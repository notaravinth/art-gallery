import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Gallery from './Components/Gallery';
import Footer from './Components/Footer';
import UploadPage from './Components/UploadPage';
import HomePage from './Components/HomePage'; // new import

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-pink-100 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/gallery"
            element={
              <>
                <Header />
                <Gallery />
                <Footer />
              </>
            }
          />
          <Route
            path="/upload"
            element={
              <>
                <Header />
                <UploadPage />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
