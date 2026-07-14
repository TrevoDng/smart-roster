import React from 'react';

interface RosterSummaryProps {
  summary: Array<{ name: string; shifts: number }>;
  isPrintView?: boolean;
}

const RosterSummary: React.FC<RosterSummaryProps> = ({ summary, isPrintView = false }) => {
  const containerStyle: React.CSSProperties = {
    marginTop: isPrintView ? '0' : '25px',
    padding: isPrintView ? '10px' : '20px',
    backgroundColor: 'white',
    borderRadius: isPrintView ? '0' : '12px',
    boxShadow: isPrintView ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
  };

  const titleStyle: React.CSSProperties = {
    marginTop: 0,
    fontSize: isPrintView ? '12px' : 'inherit',
  };

  const itemStyle: React.CSSProperties = {
    margin: isPrintView ? '4px 0' : '8px 0',
    fontWeight: 'bold',
    fontSize: isPrintView ? '10px' : 'inherit',
  };

  const totalShifts = summary.reduce((acc, item) => acc + item.shifts, 0);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Shifts Summary</h3>
      {summary.map((item, idx) => (
        <p key={idx} style={itemStyle}>
          {item.name}: {item.shifts} shifts
        </p>
      ))}
      {isPrintView && (
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '2px solid #1e3a5f',
          fontWeight: 'bold',
          fontSize: '11px',
          textAlign: 'center',
          color: '#1e3a5f'
        }}>
          Total: {totalShifts} shifts
        </div>
      )}
    </div>
  );
};

export default RosterSummary;