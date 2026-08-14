// src/components/common/TableScaleControls.tsx
import React from 'react';

interface TableScaleControlsProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onAutoResize: () => void;
  isAutoResized: boolean;
  label?: string;
  showControls?: boolean;
}

const TableScaleControls: React.FC<TableScaleControlsProps> = ({
  scale,
  onScaleChange,
  onAutoResize,
  isAutoResized,
  label = 'Table Size',
  showControls = true,
}) => {
  if (!showControls) return null;

  const handleDecrease = () => {
    const newScale = Math.max(30, scale - 5);
    onScaleChange(newScale);
  };

  const handleIncrease = () => {
    const newScale = Math.min(150, scale + 5);
    onScaleChange(newScale);
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{label}</span>
      
      <div style={controlsGroupStyle}>
        <button
          onClick={handleDecrease}
          style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
          title="Decrease size"
        >
          −
        </button>
        
        <input
          type="range"
          min="30"
          max="150"
          value={scale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          style={sliderStyle}
        />
        
        <button
          onClick={handleIncrease}
          style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
          title="Increase size"
        >
          +
        </button>
        
        <span style={scaleValueStyle}>{scale}%</span>
      </div>
      
      <button
        onClick={onAutoResize}
        style={{
          ...autoButtonStyle,
          backgroundColor: isAutoResized ? '#28a745' : '#6c757d',
        }}
        disabled={isAutoResized}
        title={isAutoResized ? 'Auto size applied' : 'Auto-fit table to screen'}
      >
        {isAutoResized ? '✓ Auto' : 'Auto Fit'}
      </button>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
  padding: '8px 16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
};

const controlsGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const buttonStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const sliderStyle: React.CSSProperties = {
  width: '120px',
  height: '6px',
  cursor: 'pointer',
};

const scaleValueStyle: React.CSSProperties = {
  minWidth: '44px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#1e3a5f',
  textAlign: 'center',
};

const autoButtonStyle: React.CSSProperties = {
  padding: '6px 16px',
  borderRadius: '6px',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  transition: 'all 0.2s',
};

export default TableScaleControls;
