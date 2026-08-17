// src/components/common/BackButton.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  urlTo?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  replace?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  className = '',
  style = {},
  label = 'Back',
  urlTo = '/',
  variant = 'secondary',
  size = 'md',
  icon = '←',
  replace = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (replace) {
      navigate(urlTo, { replace: true });
    } else {
      navigate(urlTo);
    }
  };

  // Size configurations
  const sizeStyles = {
    sm: {
      padding: '6px 14px',
      fontSize: '13px',
      iconSize: '16px',
    },
    md: {
      padding: '10px 20px',
      fontSize: '15px',
      iconSize: '18px',
    },
    lg: {
      padding: '14px 28px',
      fontSize: '18px',
      iconSize: '22px',
    },
  };

  // Variant configurations
  const variantStyles = {
    primary: {
      backgroundColor: '#1e3a5f',
      color: 'white',
      border: 'none',
      hoverBackground: '#15304f',
      hoverColor: 'white',
      hoverTransform: 'translateY(-2px)',
    },
    secondary: {
      backgroundColor: '#f8f9fa',
      color: '#1e3a5f',
      border: '1px solid #dee2e6',
      hoverBackground: '#e9ecef',
      hoverColor: '#1e3a5f',
      hoverTransform: 'translateY(-2px)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#1e3a5f',
      border: '2px solid #1e3a5f',
      hoverBackground: '#1e3a5f',
      hoverColor: 'white',
      hoverTransform: 'translateY(-2px)',
    },
    text: {
      backgroundColor: 'transparent',
      color: '#1e3a5f',
      border: 'none',
      hoverBackground: 'rgba(30, 58, 95, 0.08)',
      hoverColor: '#172e4d',
      hoverTransform: 'translateX(-4px)',
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <button
      onClick={handleClick}
      className={`back-button back-button-${variant} back-button-${size} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: currentSize.padding,
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
        border: currentVariant.border || 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: currentSize.fontSize,
        fontWeight: '500',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: variant === 'primary' ? '0 2px 8px rgba(30, 58, 95, 0.2)' : 
                   variant === 'secondary' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
        textDecoration: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = currentVariant.hoverBackground || currentVariant.backgroundColor;
        if (currentVariant.hoverColor) {
          e.currentTarget.style.color = currentVariant.hoverColor;
        }
        e.currentTarget.style.transform = currentVariant.hoverTransform || 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 58, 95, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = currentVariant.backgroundColor;
        e.currentTarget.style.color = currentVariant.color;
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = variant === 'primary' ? '0 2px 8px rgba(30, 58, 95, 0.2)' : 
                                           variant === 'secondary' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none';
      }}
    >
      {icon && (
        <span style={{ 
          fontSize: currentSize.iconSize,
          lineHeight: 1,
          transition: 'transform 0.2s ease',
        }}>
          {icon}
        </span>
      )}
      {label}
    </button>
  );
};

export default BackButton;