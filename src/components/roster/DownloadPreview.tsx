import React, { useState, useRef } from 'react';
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
  const previewRef = useRef<HTMLDivElement>(null);
  const currentData = (snapshot.data as any).generatedData;

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  // Handle download button click
  const handleDownloadClick = () => {
    onDownload();
    // Close after download
    setTimeout(() => onClose(), 1500);
  };

  // Check if table is wide (more than 15 columns)
  const isTableWide = currentData.headers.length > 15;

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>📄 Download Preview</h2>
          <div style={headerControlsStyle}>
            {isTableWide && (
              <button 
                onClick={toggleRotation} 
                style={rotateButtonStyle}
              >
                {isRotated ? '↺ Reset View' : '↻ Rotate 90°'}
              </button>
            )}
            <button onClick={onClose} style={closeButtonStyle}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Preview Info */}
        <div style={infoBarStyle}>
          <span>📋 {roster.name}</span>
          <span>📅 {formatDate(roster.startDate)} - {formatDate(roster.endDate)}</span>
          <span>👥 {roster.employees.length} employees</span>
          <span>📊 {currentData.headers.length} days</span>
          {isTableWide && (
            <span style={warningBadgeStyle}>
              ⚠️ Table is wide ({currentData.headers.length} columns) - Consider rotating
            </span>
          )}
          <span style={{ color: '#999', fontSize: '12px' }}>
            {isRotated ? '🔄 Rotated View' : '⬛ Normal View'}
          </span>
        </div>

        {/* Preview Content */}
        <div 
          ref={previewRef}
          className={`preview-content ${isRotated ? 'rotated' : ''}`}
          style={{
            ...contentStyle,
            transform: isRotated ? 'rotate(90deg)' : 'none',
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
          }}
        >
          <div style={innerContentStyle}>
            {/* Header - Top */}
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

            {/* Table */}
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

            {/* Footer */}
            <div style={previewFooterStyle}>
              Downloaded: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={controlsStyle}>
          <div style={controlsLeftStyle}>
            {isTableWide && (
              <button 
                onClick={toggleRotation} 
                style={{ ...controlButtonStyle, backgroundColor: '#17a2b8' }}
              >
                {isRotated ? '↺ Reset View' : '↻ Rotate 90°'}
              </button>
            )}
            <span style={hintStyle}>
              {isRotated 
                ? '💡 Rotated view - scroll to see all content' 
                : isTableWide 
                  ? '💡 Click "Rotate 90°" to see all columns' 
                  : '✅ Table fits well'}
            </span>
          </div>
          <div style={controlsRightStyle}>
            <button onClick={onClose} style={{ ...controlButtonStyle, backgroundColor: '#6c757d' }}>
              Cancel
            </button>
            <button onClick={handleDownloadClick} style={{ ...controlButtonStyle, backgroundColor: '#28a745' }}>
              ⬇️ Download Roster
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles for Download Preview */}
      <style>
        {`
          @media print {
            .preview-content {
              transform: none !important;
              padding: 10px !important;
            }
            .preview-content.rotated {
              transform: rotate(90deg) !important;
              transform-origin: center center !important;
            }
          }
        `}
      </style>
    </div>
  );
};

// Styles
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
  padding: '20px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  width: '95%',
  maxWidth: '1400px',
  maxHeight: '95vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '15px 20px',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#1e3a5f',
  fontSize: '20px',
};

const headerControlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

const rotateButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const closeButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const infoBarStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#e9ecef',
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
  alignItems: 'center',
  fontSize: '13px',
  color: '#333',
  flexShrink: 0,
  borderBottom: '1px solid #ddd',
};

const warningBadgeStyle: React.CSSProperties = {
  backgroundColor: '#fff3cd',
  color: '#856404',
  padding: '2px 12px',
  borderRadius: '12px',
  fontWeight: 'bold',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  minHeight: '300px',
};

const innerContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  maxWidth: '1200px',
  margin: '0 auto',
};

const previewHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '15px',
  marginBottom: '20px',
  borderBottom: '2px solid #1e3a5f',
};

const previewTitleStyle: React.CSSProperties = {
  margin: '0 0 8px 0',
  color: '#1e3a5f',
  fontSize: '22px',
};

const previewSubStyle: React.CSSProperties = {
  margin: '4px 0',
  color: '#555',
  fontSize: '14px',
};

const previewMetaStyle: React.CSSProperties = {
  margin: '4px 0',
  color: '#999',
  fontSize: '12px',
};

const previewSummaryStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const previewTableStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const previewFooterStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '15px',
  borderTop: '1px solid #ddd',
  fontSize: '12px',
  color: '#999',
};

const controlsStyle: React.CSSProperties = {
  padding: '15px 20px',
  borderTop: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  flexShrink: 0,
  flexWrap: 'wrap',
  gap: '10px',
};

const controlsLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  flexWrap: 'wrap',
};

const controlsRightStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

const controlButtonStyle: React.CSSProperties = {
  padding: '10px 25px',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'transform 0.2s',
};

const hintStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#666',
};

export default DownloadPreview;
