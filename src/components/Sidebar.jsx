import React, { useState } from 'react';
import './Sidebar.css';

const eyes = import.meta.glob('/src/assets/eyes/*.png', { query: '?url', import: 'default' });
const noses = import.meta.glob('/src/assets/nose/*.png', { query: '?url', import: 'default' });
const mouths = import.meta.glob('/src/assets/lips/*.png', { query: '?url', import: 'default' });
const ears = import.meta.glob('/src/assets/ears/*.png', { query: '?url', import: 'default' });
const eyebrows = import.meta.glob('/src/assets/eyebrows/*.png', { query: '?url', import: 'default' });
const hair = import.meta.glob('/src/assets/hair/*.png', { query: '?url', import: 'default' });
const head = import.meta.glob('/src/assets/head/*.png', { query: '?url', import: 'default' });
const mustach = import.meta.glob('/src/assets/mustach/*.png', { query: '?url', import: 'default' });
const more = import.meta.glob('/src/assets/more/*.png', { query: '?url', import: 'default' });

const categories = {
  Eyes: eyes,
  Noses: noses,
  Mouths: mouths,
  Ears: ears,
  Eyebrows: eyebrows,
  Hair: hair,
  Head: head,
  Mustach: mustach,
  More: more,
};

const Sidebar = ({ onDragStart }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    const modules = await Promise.all(
      Object.values(categories[category]).map((importFn) => importFn())
    );
    setImages(modules);
  };

  return (
    <div className="sidebar">
      <h2>Face Parts</h2>
      <ul className="category-list">
        {Object.keys(categories).map((category) => (
          <li
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </li>
        ))}
      </ul>

      <div className="images">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${selectedCategory}-${idx}`}
            draggable
            onDragStart={(e) => {
              const offsetX = 50;
              const offsetY = 50;
              const data = JSON.stringify({
                src,
                x: offsetX,
                y: offsetY,
              });
              e.dataTransfer.setData('application/json', data);
              onDragStart?.(e, src);
            }}
            className="draggable-image"
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
