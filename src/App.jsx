import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import './App.css';

function App() {
  const [droppedImage, setDroppedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const handleDragStart = (e, src) => {
    e.dataTransfer.setData('text/plain', src);
  };

  const getRandomMatchPercentage = () => {
    const percentage = Math.floor(Math.random() * 51); // 0 to 50
    return `${percentage}% face image matched`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setUploadedImage(imgUrl);

      // Simulated random match prediction
      const randomMatch = getRandomMatchPercentage();
      setMatchResult(randomMatch);
    }
  };

  return (
    <div className="app-container">
      <Sidebar onDragStart={handleDragStart} />
      <CanvasArea droppedImage={droppedImage} />
      <div className="top-bar">
        <label className="upload-label">
          Upload Real Image for Matching:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {uploadedImage && (
          <div className="upload-preview">
            <p>Uploaded Image:</p>
            <img src={uploadedImage} alt="Uploaded" height="100" />
            <p className="match-result">{matchResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
