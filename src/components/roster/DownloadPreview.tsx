import React, { useRef, useState, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import RosterTable from './RosterTable';
import RosterSummary from './RosterSummary';
import TableScaleControls from '../common/TableScaleControls';
import { Roster, RosterSnapshot } from '../../types';

interface DownloadPreviewProps {
  roster: Roster;
  snapshot: RosterSnapshot;
  getShiftColor: (shift: string) => string;
  getShiftDisplay: (shift: string) => string;
  formatDate: (date: string) => string;
  onClose: () => void;
  onDownload: () => void;
  onDownloadPdf: () => void;
}

const DownloadPreview: React.FC<DownloadPreviewProps> = ({
  roster,
  snapshot,
  getShiftColor,
  getShiftDisplay,
  formatDate,
  onClose,
  onDownload,
  onDownloadPdf,
}) => {
  const currentData = (snapshot.data as any).generatedData;
  const contentRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  
  // Scale state - only affects table
  const [tableScale, setTableScale] = useState<number>(100);
  const [isAutoResized, setIsAutoResized] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Auto-resize function - only for table
  const handleAutoResize = useCallback(() => {
    if (!tableRef.current) return;
    
    setTimeout(() => {
      const tableElement = tableRef.current?.querySelector('table');
      if (!tableElement) return;
      
      const containerWidth = window.innerWidth - 120;
      const tableWidth = tableElement.scrollWidth;
      
      if (tableWidth > containerWidth) {
        const optimalScale = Math.floor((containerWidth / tableWidth) * 100);
        const clampedScale = Math.max(30, Math.min(100, optimalScale));
        setTableScale(clampedScale);
        setIsAutoResized(true);
      } else {
        setTableScale(100);
        setIsAutoResized(false);
      }
    }, 100);
  }, []);

  useEffect(() => {
    handleAutoResize();
  }, [handleAutoResize, snapshot]);

  const handleScaleChange = useCallback((newScale: number) => {
    setTableScale(newScale);
    setIsAutoResized(false);
  }, []);

  // PDF Download using html2canvas - Capture FULL content
  const handleDownloadPdfWithCanvas = useCallback(async () => {
    if (!captureRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const captureElement = captureRef.current;
      
      // Force full height rendering for capture
      const originalHeight = captureElement.style.height;
      const originalOverflow = captureElement.style.overflow;
      const originalMaxHeight = captureElement.style.maxHeight;
      
      // Set to auto height to capture all content
      captureElement.style.height = 'auto';
      captureElement.style.overflow = 'visible';
      captureElement.style.maxHeight = 'none';
      
      // Wait for reflow
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get the full dimensions
      const width = captureElement.scrollWidth;
      const height = captureElement.scrollHeight;
      
      console.log(`Capturing: ${width}x${height}`);
      
      // Capture the entire content
      const canvas = await html2canvas(captureElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // Ensure cloned element shows all content
          const clonedElement = clonedDoc.getElementById('pdf-capture-content');
          if (clonedElement) {
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.maxHeight = 'none';
          }
        }
      });
      
      // Restore original styles
      captureElement.style.height = originalHeight;
      captureElement.style.overflow = originalOverflow;
      captureElement.style.maxHeight = originalMaxHeight;
      
      // Create PDF
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        canvas.width,
        canvas.height,
        undefined,
        'FAST'
      );
      
      pdf.save(`${roster.name.replace(/\s+/g, '_')}_roster.pdf`);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try the print option instead.');
    } finally {
      setIsGenerating(false);
    }
  }, [roster]);

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Controls */}
        <div style={controlsStyle}>
          <h3 style={modalTitleStyle}>📄 Download Preview</h3>
          <div style={buttonGroupStyle}>
            <button onClick={onClose} style={closeButtonStyle}>
              ✕ Close
            </button>
            <button 
              onClick={onDownload} 
              style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
            >
              📥 HTML
            </button>
            <button 
              onClick={handleDownloadPdfWithCanvas} 
              style={{ 
                ...buttonStyle, 
                backgroundColor: '#dc3545',
                opacity: isGenerating ? 0.6 : 1,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
              }}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generating...' : '📄 PDF'}
            </button>
          </div>
          
          <TableScaleControls
            scale={tableScale}
            onScaleChange={handleScaleChange}
            onAutoResize={handleAutoResize}
            isAutoResized={isAutoResized}
            label="Table Size:"
          />
        </div>

        {/* Preview Content - Wrapped for PDF capture */}
        <div 
          id="pdf-capture-content"
          ref={captureRef}
          style={{
            ...previewContentStyle,
            height: 'auto',
            overflow: 'visible',
            maxHeight: 'none',
          }}
        >
          {/* Header - NOT affected by scale */}
          <div style={headerStyle}>
            <h2 style={headerTitleStyle}>{roster.name}</h2>
            <p>{formatDate(roster.startDate)} - {formatDate(roster.endDate)}</p>
            <p>Version: {snapshot.version}</p>
          </div>

          {/* Summary - NOT affected by scale */}
          <div style={summaryStyle}>
            <RosterSummary summary={currentData.summary} isPrintView={true} />
          </div>

          {/* Table - ONLY THIS is affected by scale */}
          <div 
            ref={tableRef}
            style={{
              transform: `scale(${tableScale / 100})`,
              transformOrigin: 'top left',
              width: `${100 / (tableScale / 100)}%`,
              transition: 'transform 0.3s ease',
              overflow: 'visible',
            }}
          >
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
      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  maxWidth: '95vw',
  width: '100%',
  minHeight: '95vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const controlsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
  padding: '16px 24px',
  borderBottom: '1px solid #e9ecef',
  backgroundColor: '#f8f9fa',
  flexShrink: 0,
};

const modalTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '18px',
  color: '#1e3a5f',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
};

const closeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
};

const previewContentStyle: React.CSSProperties = {
  padding: '0px',
  backgroundColor: 'white',
  width: '100%',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '15px',
  marginBottom: '20px',
  borderBottom: '2px solid #1e3a5f',
};

const headerTitleStyle: React.CSSProperties = {
  margin: '0 0 8px 0',
  fontSize: '20px',
  color: '#1e3a5f',
};

const summaryStyle: React.CSSProperties = {
  padding: '15px',
  marginBottom: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#f8f9fa',
};

export default DownloadPreview;
