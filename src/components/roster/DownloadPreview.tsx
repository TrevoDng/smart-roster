
import React, { useState, useRef, useEffect } from 'react';
import { Roster, RosterSnapshot } from '../../types';
import RosterTable from './RosterTable';
import RosterSummary from './RosterSummary';

interface DownloadPreviewProps {
  roster: Roster;
  snapshot: RosterSnapshot;
  getShiftColor: (shift: string) => string;
  getShiftDisplay: (shift: string) => string;
  formatDate: (date: string) => string;
  onClose: () => void;
  onDownload: () => void;
}

const DownloadPreview: React.FC<DownloadPreviewProps> = ({
  roster,
  snapshot,
  getShiftColor,
  getShiftDisplay,
  formatDate,
  onClose,
  onDownload,
}) => {
  const [isRotated, setIsRotated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const currentData = (snapshot.data as any).generatedData;

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  const handleDownloadClick = () => {
    onDownload();
    setTimeout(() => onClose(), 1500);
  };

  const isTableWide = currentData.headers.length > 15;

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>📄 Download Preview</h2>
          <div style={headerControlsStyle}>
            {isTableWide && !isMobile && (
              <button onClick={toggleRotation} style={rotateButtonStyle}>
                {isRotated ? '↺ Reset' : '↻ Rotate'}
              </button>
            )}
            <button onClick={onClose} style={closeButtonStyle}>
              ✕
            </button>
          </div>
        </div>

        {/* Preview Info - Responsive */}
        <div style={infoBarStyle}>
          <div style={infoGridStyle}>
            <span style={infoItemStyle}>📋 {roster.name}</span>
            <span style={infoItemStyle}>📅 {formatDate(roster.startDate)}</span>
            <span style={infoItemStyle}>👥 {roster.employees.length}</span>
            <span style={infoItemStyle}>📊 {currentData.headers.length} days</span>
          </div>
          {isTableWide && (
            <div style={warningBadgeStyle}>
              ⚠️ {currentData.headers.length} columns
              {isMobile && ' - Scroll horizontally'}
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div 
          ref={previewRef}
          style={{
            ...contentStyle,
            transform: isRotated ? 'rotate(90deg)' : 'none',
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
          }}
        >
          <div style={innerContentStyle}>
            {/* Header */}
            <div style={previewHeaderStyle}>
              <h3 style={previewTitleStyle}>{roster.name}</h3>
              <p style={previewSubStyle}>
                {formatDate(roster.startDate)} - {formatDate(roster.endDate)}
              </p>
              <p style={previewMetaStyle}>
                Version: {snapshot.version} | Employees: {roster.employees.length} | Days: {currentData.headers.length}
              </p>
            </div>

            {/* Summary */}
            <div style={previewSummaryStyle}>
              <RosterSummary summary={currentData.summary} isPrintView={true} />
            </div>

            {/* Table with horizontal scroll for mobile */}
            <div style={previewTableWrapperStyle}>
              <div style={previewTableStyle}>
                <RosterTable
                  roster={roster}
                  headers={currentData.headers}
                  rows={currentData.rows}
                  getShiftColor={getShiftColor}
                  getShiftDisplay={getShiftDisplay}
                  isPrintView={true}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={previewFooterStyle}>
              Downloaded: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* Controls - Responsive */}
        <div style={controlsStyle}>
          <div style={controlsLeftStyle}>
            {isTableWide && !isMobile && (
              <button 
                onClick={toggleRotation} 
                style={{ ...controlButtonStyle, backgroundColor: '#17a2b8' }}
              >
                {isRotated ? '↺ Reset' : '↻ Rotate'}
              </button>
            )}
            <span style={hintStyle}>
              {isMobile 
                ? '👆 Scroll table horizontally' 
                : isRotated 
                  ? '🔄 Rotated view' 
                  : isTableWide 
                    ? '💡 Click Rotate for full view' 
                    : '✅ Ready to download'}
            </span>
          </div>
          <div style={controlsRightStyle}>
            <button onClick={onClose} style={{ ...controlButtonStyle, backgroundColor: '#6c757d' }}>
              Cancel
            </button>
            <button onClick={handleDownloadClick} style={{ ...controlButtonStyle, backgroundColor: '#28a745' }}>
              ⬇️ Download
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @media print {
            .preview-content {
              transform: none !important;
            }
          }
          @media (max-width: 768px) {
            .preview-content {
              padding: 10px !important;
            }
            .preview-content.rotated {
              transform: rotate(90deg) !important;
            }
          }
        `}
      </style>
    </div>
  );
};

// ============================================
// RESPONSIVE STYLES
// ============================================

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '1400px',
  maxHeight: '98vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  flexShrink: 0,
  flexWrap: 'wrap',
  gap: '8px',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#1e3a5f',
  fontSize: 'clamp(16px, 3vw, 20px)',
};

const headerControlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const rotateButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: 'clamp(12px, 1.5vw, 14px)',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
};

const closeButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: 'clamp(12px, 1.5vw, 14px)',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
};

const infoBarStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#e9ecef',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 'clamp(11px, 1.2vw, 13px)',
  color: '#333',
  flexShrink: 0,
  borderBottom: '1px solid #ddd',
  gap: '8px',
};

const infoGridStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
};

const infoItemStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
};

const warningBadgeStyle: React.CSSProperties = {
  backgroundColor: '#fff3cd',
  color: '#856404',
  padding: '2px 10px',
  borderRadius: '12px',
  fontWeight: 'bold',
  fontSize: 'clamp(10px, 1vw, 12px)',
  whiteSpace: 'nowrap',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: 'clamp(10px, 2vw, 20px)',
  backgroundColor: '#f5f5f5',
  minHeight: '200px',
  WebkitOverflowScrolling: 'touch',
};

const innerContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: 'clamp(15px, 3vw, 30px)',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
};

const previewHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 'clamp(10px, 2vw, 15px)',
  marginBottom: 'clamp(10px, 2vw, 20px)',
  borderBottom: '2px solid #1e3a5f',
};

const previewTitleStyle: React.CSSProperties = {
  margin: '0 0 6px 0',
  color: '#1e3a5f',
  fontSize: 'clamp(18px, 3vw, 22px)',
  wordBreak: 'break-word',
};

const previewSubStyle: React.CSSProperties = {
  margin: '4px 0',
  color: '#555',
  fontSize: 'clamp(12px, 1.5vw, 14px)',
};

const previewMetaStyle: React.CSSProperties = {
  margin: '4px 0',
  color: '#999',
  fontSize: 'clamp(10px, 1.2vw, 12px)',
};

const previewSummaryStyle: React.CSSProperties = {
  marginBottom: 'clamp(10px, 2vw, 20px)',
};

const previewTableWrapperStyle: React.CSSProperties = {
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  marginBottom: 'clamp(10px, 2vw, 20px)',
  borderRadius: '4px',
};

const previewTableStyle: React.CSSProperties = {
  minWidth: '100%',
  width: '100%',
};

const previewFooterStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 'clamp(10px, 2vw, 15px)',
  borderTop: '1px solid #ddd',
  fontSize: 'clamp(10px, 1.2vw, 12px)',
  color: '#999',
};

const controlsStyle: React.CSSProperties = {
  padding: 'clamp(10px, 2vw, 15px)',
  borderTop: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  flexShrink: 0,
  flexWrap: 'wrap',
  gap: '8px',
};

const controlsLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(8px, 1.5vw, 15px)',
  flexWrap: 'wrap',
};

const controlsRightStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const controlButtonStyle: React.CSSProperties = {
  padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2.5vw, 25px)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: 'clamp(12px, 1.5vw, 14px)',
  fontWeight: 'bold',
  transition: 'transform 0.2s',
  whiteSpace: 'nowrap',
  minWidth: 'clamp(70px, 10vw, 100px)',
};

const hintStyle: React.CSSProperties = {
  fontSize: 'clamp(11px, 1.2vw, 13px)',
  color: '#666',
  textAlign: 'left',
};

export default DownloadPreview;
