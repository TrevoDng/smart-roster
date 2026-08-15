import React, { useRef, useState, useCallback, useEffect } from 'react';
import RosterTable from './RosterTable';
import RosterSummary from './RosterSummary';
import TableScaleControls from '../common/TableScaleControls';
import { Roster, RosterSnapshot } from '../../types';

interface PrintPageProps {
  roster: Roster;
  snapshot: RosterSnapshot;
  getShiftColor: (shift: string) => string;
  getShiftDisplay: (shift: string) => string;
  formatDate: (date: string) => string;
  onClose: () => void;
}

const PrintPage: React.FC<PrintPageProps> = ({
  roster,
  snapshot,
  getShiftColor,
  getShiftDisplay,
  formatDate,
  onClose,
}) => {
  const currentData = (snapshot.data as any).generatedData;
  const contentRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Scale state - only affects table
  const [tableScale, setTableScale] = useState<number>(100);
  const [isAutoResized, setIsAutoResized] = useState<boolean>(false);

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

  // Auto-resize on mount and when snapshot changes
  useEffect(() => {
    handleAutoResize();
  }, [handleAutoResize, snapshot]);

  // Handle manual scale change
  const handleScaleChange = useCallback((newScale: number) => {
    setTableScale(newScale);
    setIsAutoResized(false);
  }, []);

  // Manual print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-page-container" style={containerStyle}>
      {/* Controls - only visible on screen, hidden in print */}
      <div className="no-print" style={controlsStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          ✕ Close
        </button>
        <button onClick={handlePrint} style={printButtonStyle}>
          🖨️ Print / Save as PDF
        </button>
        
        <TableScaleControls
          scale={tableScale}
          onScaleChange={handleScaleChange}
          onAutoResize={handleAutoResize}
          isAutoResized={isAutoResized}
          label="Table Size:"
        />
        
        <span style={hintStyle}>💡 Use "Save as PDF" in print dialog</span>
      </div>

      <div ref={contentRef} className="print-content" style={contentStyle}>
        {/* Header - NOT affected by scale */}
        <div className="print-header" style={headerStyle}>
          <h2 style={headerTitleStyle}>{roster.name}</h2>
          <p>{formatDate(roster.startDate)} - {formatDate(roster.endDate)}</p>
          <p>Created: {formatDate(roster.createdAt)}</p>
          <p>Version: {snapshot.version}</p>
          <div style={versionStyle}>
            Printed: {new Date().toLocaleString()}
          </div>
          <hr style={dividerStyle} />
          <div style={infoStyle}>
            Employees: {roster.employees.length}
          </div>
          <div style={infoStyle}>
            Days: {currentData.headers.length}
          </div>
        </div>

        {/* Summary - NOT affected by scale */}
        <div className="print-summary" style={summaryStyle}>
          <RosterSummary summary={currentData.summary} isPrintView={true} />
        </div>

        {/* Table - ONLY THIS is affected by scale */}
        <div 
          ref={tableRef}
          className="print-table-container" 
          style={{
            ...tableContainerStyle,
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
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  padding: '20px',
  position: 'relative',
};

const controlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '20px',
  padding: '12px 20px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '1000px',
};

const closeButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

const printButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(30, 58, 95, 0.3)',
};

const hintStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#666',
};

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  width: '100%',
  maxWidth: '1000px',
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
};

const headerStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px',
  textAlign: 'center',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#f8f9fa',
};

const headerTitleStyle: React.CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: '18px',
  color: '#1e3a5f',
};

const versionStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#999',
  marginTop: '5px',
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #ddd',
  margin: '10px 0',
};

const infoStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#555',
  margin: '4px 0',
};

const summaryStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#f8f9fa',
};

const tableContainerStyle: React.CSSProperties = {
  width: '100%',
  overflow: 'visible',
  padding: '5px',
};

// Print styles
const printStyles = `
  @media print {
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    
    .no-print {
      display: none !important;
    }
    
    .print-page-container {
      background: white !important;
      padding: 0 !important;
      min-height: 100vh !important;
    }
    
    .print-content {
      transform: none !important;
      width: 100% !important;
      max-width: 100% !important;
      box-shadow: none !important;
      padding: 10px !important;
      gap: 10px !important;
      border-radius: 0 !important;
    }
    
    .print-header,
    .print-summary,
    .print-table-container {
      transform: none !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .print-header {
      order: 0 !important;
      padding: 8px !important;
    }
    
    .print-summary {
      order: 1 !important;
      padding: 10px !important;
    }
    
    .print-table-container {
      order: 2 !important;
      overflow: visible !important;
      padding: 0 !important;
    }
    
    @page {
      size: landscape;
      margin: 0.2in !important;
    }
    
    table {
      font-size: 9px !important;
      page-break-inside: auto !important;
    }
    
    th {
      font-size: 8px !important;
      padding: 4px 6px !important;
    }
    
    td {
      font-size: 8px !important;
      padding: 4px 6px !important;
    }
    
    .staff-name {
      font-size: 8px !important;
      min-width: 60px !important;
      padding: 4px 6px !important;
    }
    
    .company-number {
      font-size: 6px !important;
    }
    
    thead {
      display: table-header-group !important;
    }
    
    tr {
      page-break-inside: avoid !important;
    }
  }
`;

// Inject print styles
const styleElement = document.createElement('style');
styleElement.textContent = printStyles;
document.head.appendChild(styleElement);

export default PrintPage;