import React from 'react';
import { Roster } from '../../types';

interface RosterTableProps {
  roster: Roster;
  headers: string[];
  rows: Record<string, string[]>;
  getShiftColor: (shift: string) => string;
  getShiftDisplay: (shift: string) => string;
  isPrintView?: boolean;
}

const RosterTable: React.FC<RosterTableProps> = ({
  roster,
  headers,
  rows,
  getShiftColor,
  getShiftDisplay,
  isPrintView = false,
}) => {
  const containerStyle: React.CSSProperties = {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: isPrintView ? '0' : '12px',
    boxShadow: isPrintView ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
    padding: isPrintView ? '5px' : '10px',
  };

  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    width: '100%',
    minWidth: '600px',
    fontSize: isPrintView ? '9px' : 'inherit',
  };

  const thStyle: React.CSSProperties = {
    border: isPrintView ? '1px solid #000' : '1px solid #ddd',
    padding: isPrintView ? '4px 6px' : '10px',
    textAlign: 'center',
    backgroundColor: '#1e3a5f',
    color: 'white',
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    fontSize: isPrintView ? '8px' : 'inherit',
  };

  const tdStyle: React.CSSProperties = {
    border: isPrintView ? '1px solid #000' : '1px solid #ddd',
    padding: isPrintView ? '3px 5px' : '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: isPrintView ? '8px' : '13px',
  };

  const tdNameStyle: React.CSSProperties = {
    border: isPrintView ? '1px solid #000' : '1px solid #ddd',
    padding: isPrintView ? '3px 5px' : '10px',
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    textAlign: 'left',
    minWidth: isPrintView ? '60px' : '120px',
    fontSize: isPrintView ? '8px' : 'inherit',
  };

  const detailTextStyle: React.CSSProperties = {
    fontSize: isPrintView ? '7px' : '12px',
    color: '#666',
  };

  const circleStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '40px',
    minHeight: '40px',
    padding: '5px 10px',
    border: '2px solid white',
    borderRadius: '50%',
    fontWeight: 'bold',
    fontSize: '12px',
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Employee</th>
            {headers.map((header: string, i: number) => (
              <th key={i} style={thStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roster.employees.map((employee) => (
            <tr key={employee.id}>
              <td style={tdNameStyle}>
                <strong>{employee.name}</strong>
                <br />
                <span style={detailTextStyle}>#{employee.companyNumber}</span>
              </td>
              {rows[employee.id]?.map((shift: string, i: number) => (
                <td 
                  key={i} 
                  style={{
                    ...tdStyle,
                    
                    color: 'white',
                  }}
                >
                  <div className={`circle ${shift.toLowerCase()}`}  style={{ ...circleStyle, backgroundColor: getShiftColor(shift) }}>
                    {getShiftDisplay(shift)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RosterTable;