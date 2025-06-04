import React, { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';

const URLImage = ({ image, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img, setImg] = useState(null);

  useEffect(() => {
    const loadImage = () => {
      const imageObj = new window.Image();
      imageObj.src = image.src;
      imageObj.onload = () => {
        setImg(imageObj);
      };
    };
    loadImage();
  }, [image.src]);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={img}
        x={image.x}
        y={image.y}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale to 1 after applying
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default URLImage;
