import React from 'react';
import { useBackButton } from '../../hooks/useBackButton';

interface BackButtonProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  className = '',
  style = {},
  label = '← Back',
}) => {
  const { goBack, canGoBack } = useBackButton();

  const handleClick = () => {
    goBack();
  };

  return (
    <button
      onClick={handleClick}
      className={`back-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#5a6268';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#6c757d';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span style={{ fontSize: '18px' }}>←</span>
      {label}
    </button>
  );
};

export default BackButton;
