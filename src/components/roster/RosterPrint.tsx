import React from 'react';
import { RosterSnapshot, Roster, ShiftType } from '../../types';

interface RosterPrintProps {
  roster: Roster;
  snapshot: RosterSnapshot;
}

const RosterPrint: React.FC<RosterPrintProps> = ({ roster, snapshot }) => {
  const currentData = (snapshot.data as any).generatedData;

  const getShiftColor = (shift: string): string => {
    const colors: { [key: string]: string } = {
      'Day': '#4CAF50',
      'Night': '#2196F3',
      'Off': '#9E9E9E',
      'Overtime': '#8B4513',
    };
    return colors[shift] || '#607D8B';
  };

  return (
    <div style={printContainerStyle}>
      <div style={printHeaderStyle}>
        <h1>{roster.name}</h1>
        <p>
          {new Date(roster.startDate).toLocaleDateString()} - {new Date(roster.endDate).toLocaleDateString()}
        </p>
        <p>Version {snapshot.version} - Printed on {new Date().toLocaleString()}</p>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Employee</th>
            {currentData.headers.map((header: string, i: number) => (
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
                <span>#{employee.companyNumber}</span>
              </td>
              {currentData.rows[employee.id]?.map((shift: string, i: number) => (
                <td 
                  key={i} 
                  style={{
                    ...tdStyle,
                    backgroundColor: getShiftColor(shift),
                    color: 'white',
                  }}
                >
                  {shift}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={summaryStyle}>
        <h3>Shifts Summary</h3>
        {currentData.summary.map((item: any, idx: number) => (
          <p key={idx}>{item.name}: {item.shifts} shifts</p>
        ))}
      </div>
    </div>
  );
};

const printContainerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: 'white',
};

const printHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '20px',
};

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  fontSize: '12px',
};

const thStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'center',
  backgroundColor: '#1e3a5f',
  color: 'white',
  fontWeight: 'bold',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'center',
  fontWeight: 'bold',
};

const tdNameStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '8px',
  backgroundColor: '#e0e0e0',
  fontWeight: 'bold',
  textAlign: 'left',
};

const summaryStyle: React.CSSProperties = {
  marginTop: '20px',
  padding: '15px',
  borderTop: '2px solid #000',
};

export default RosterPrint;