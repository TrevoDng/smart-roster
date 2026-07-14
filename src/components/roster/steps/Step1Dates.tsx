import React, { useState } from 'react';

interface Step1DatesProps {
  startDate: string;
  endDate: string;
  onUpdate: (data: { startDate: string; endDate: string }) => void;
  onNext: () => void;
}

const Step1Dates: React.FC<Step1DatesProps> = ({
  startDate,
  endDate,
  onUpdate,
  onNext,
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!localStartDate || !localEndDate) {
      setError('Please enter both start and end dates');
      return;
    }

    const start = new Date(localStartDate);
    const end = new Date(localEndDate);

    if (start > end) {
      setError('Start date must be before end date');
      return;
    }

    // Calculate difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      setError('Roster must span at least 1 day');
      return;
    }

    onUpdate({ startDate: localStartDate, endDate: localEndDate });
    onNext();
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Step 1: Set Roster Dates</h2>
      <p style={descriptionStyle}>
        Enter the start and end dates for the roster period.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Start Date *</label>
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>End Date *</label>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <button type="submit" style={buttonStyle}>
          Next Step →
        </button>
      </form>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const titleStyle: React.CSSProperties = {
  color: '#1e3a5f',
  marginBottom: '10px',
};

const descriptionStyle: React.CSSProperties = {
  color: '#666',
  marginBottom: '25px',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '10px',
  borderRadius: '6px',
  marginBottom: '15px',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 30px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Step1Dates;