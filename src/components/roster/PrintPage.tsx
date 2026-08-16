import React, { useRef } from 'react';
import RosterTable from './RosterTable';
import RosterSummary from './RosterSummary';
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
        <span style={hintStyle}>💡 Tip: Use "Save as PDF" in print dialog</span>
      </div>

      <div ref={contentRef} className="print-content" style={contentStyle}>
        {/* Header - Top (Order 1) */}
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

        {/* Summary - Middle (Order 2) */}
        <div className="print-summary" style={summaryStyle}>
          <RosterSummary summary={currentData.summary} isPrintView={true} />
        </div>

        {/* Table - Bottom (Order 3) */}
        <div className="print-table-container" style={tableContainerStyle}>
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

// CSS for print
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
      padding: 10px !important;
      min-height: 100vh !important;
    }
    
    .print-content {
      box-shadow: none !important;
      padding: 10px !important;
      gap: 15px !important;
      max-width: 100% !important;
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
    }
    
    .print-summary {
      order: 1 !important;
    }
    
    .print-table-container {
      order: 2 !important;
    }
    
    @page {
      size: ANSI-C landscape;
      margin: 0.3in;
    }
    
    table {
      font-size: 10px !important;
      page-break-inside: avoid !important;
    }
    
    th {
      font-size: 9px !important;
    }
    
    td {
      font-size: 9px !important;
    }
    
    .staff-name {
      font-size: 9px !important;
      min-width: 70px !important;
    }
    
    .company-number {
      font-size: 7px !important;
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