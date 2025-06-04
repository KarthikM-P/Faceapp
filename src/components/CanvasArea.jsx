import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import './CanvasArea.css';

const CanvasArea = () => {
  const stageRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const transformerRef = useRef();

  useEffect(() => {
    const stage = stageRef.current?.container();

    const handleDrop = (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const { src } = JSON.parse(data);
      const img = new window.Image();
      img.src = src;

      img.onload = () => {
        const rect = stage.getBoundingClientRect();
        setImages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            image: img,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
        ]);
      };
    };

    const handleDragOver = (e) => e.preventDefault();
    stage.addEventListener('drop', handleDrop);
    stage.addEventListener('dragover', handleDragOver);
    return () => {
      stage.removeEventListener('drop', handleDrop);
      stage.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  useEffect(() => {
    if (transformerRef.current && selectedId) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  return (
    <div className="canvas-container">
      <div className="canvas-box">
        <Stage width={800} height={600} ref={stageRef} className="styled-stage">
          <Layer>
            {images.map((imgObj) => (
              <KonvaImage
                key={imgObj.id}
                id={imgObj.id}
                image={imgObj.image}
                x={imgObj.x}
                y={imgObj.y}
                draggable
                onClick={() => setSelectedId(imgObj.id)}
                onTap={() => setSelectedId(imgObj.id)}
              />
            ))}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 20) return oldBox;
                return newBox;
              }}
              rotateEnabled={false}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            />
          </Layer>
        </Stage>
        <button
          className="download-btn"
          onClick={() => {
            const uri = stageRef.current.toDataURL();
            const link = document.createElement('a');
            link.download = 'face.png';
            link.href = uri;
            link.click();
          }}
        >
          Download Image
        </button>
      </div>
    </div>
  );
};

export default CanvasArea;
