import React, { useEffect } from 'react';
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

  // Auto-print when component mounts
  useEffect(() => {
    // Wait for the page to render completely
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle print after the print dialog closes
  const handleAfterPrint = () => {
    // Close the print view after printing
    onClose();
  };

  // Listen for afterprint event
  useEffect(() => {
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return (
    <div className="print-page-container" style={containerStyle}>
      {/* Close button - only visible on screen, hidden in print */}
      <button 
        onClick={onClose} 
        style={closeButtonStyle}
        className="no-print"
      >
        ✕ Close Print View
      </button>

      <div className="print-content" style={contentStyle}>
        {/* Summary - Top (Order 1) */}
        <div className="print-summary" style={summaryStyle}>
          <RosterSummary summary={currentData.summary} isPrintView={true} />
        </div>

        {/* Table - Middle (Order 2) */}
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

        {/* Header - Bottom (Order 3) */}
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

const closeButtonStyle: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  zIndex: 1000,
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