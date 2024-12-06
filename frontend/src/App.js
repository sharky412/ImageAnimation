import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);
  const [animationType, setAnimationType] = useState('morph');
  const [animationResult, setAnimationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const newImages = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...newImages].slice(0, 2));
    setError(null);
  };

  const generateAnimation = async () => {
    if (images.length !== 2) {
      setError('Please upload exactly two images');
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    formData.append('animationType', animationType);

    try {
      const response = await axios.post('http://localhost:3001/animate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setAnimationResult(response.data.animationUrl);
    } catch (error) {
      console.error('Animation generation failed', error);
      setError('Failed to generate animation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Photo Animation Generator
      </h1>
      
      <div className="mb-4">
        <div className="flex justify-center items-center space-x-4">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageUpload}
            disabled={images.length >= 2}
            className="file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2"
          />
        </div>

        <div className="flex justify-center mt-4 space-x-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={URL.createObjectURL(image)} 
                alt={`Upload ${index + 1}`} 
                className="w-32 h-32 object-cover rounded-lg shadow-md" 
              />
              <button 
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Animation Type:</label>
        <select 
          value={animationType} 
          onChange={(e) => setAnimationType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="morph">Morph</option>
          <option value="transition">Transition</option>
          <option value="dissolve">Dissolve</option>
        </select>
      </div>

      <button 
        onClick={generateAnimation} 
        disabled={loading || images.length !== 2}
        className={`w-full p-3 rounded ${
          loading || images.length !== 2 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {loading ? 'Generating Animation...' : 'Generate Animation'}
      </button>

      {animationResult && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Generated Animation
          </h2>
          <div className="flex justify-center">
            <img 
              src={animationResult} 
              alt="Generated Animation" 
              className="max-w-full rounded-lg shadow-lg" 
            />
          </div>
          <div className="text-center mt-4">
            <a 
              href={animationResult} 
              download 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download Animation
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;