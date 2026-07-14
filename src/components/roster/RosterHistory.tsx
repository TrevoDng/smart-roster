import React from 'react';
import { RosterSnapshot } from '../../types';

interface RosterHistoryProps {
  snapshots: RosterSnapshot[];
  selectedVersion: number;
  onVersionDelete: (version: number) => void;
  formatDate: (date: string) => string;
  formatDateTime: (date: string) => string;
}

const RosterHistory: React.FC<RosterHistoryProps> = ({
  snapshots,
  selectedVersion,
  onVersionDelete,
  formatDate,
  formatDateTime,
}) => {
  const containerStyle: React.CSSProperties = {
    marginTop: '25px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const listStyle: React.CSSProperties = {
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const itemStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '10px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  };

  const leftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  };

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
  };

  const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '0 5px',
    transition: 'transform 0.2s',
    opacity: 0.6,
  };

  const typeStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#1e3a5f',
    textTransform: 'uppercase',
  };

  const dateStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '12px',
  };

  const detailStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#555',
    marginBottom: '3px',
    whiteSpace: 'pre-wrap',
  };

  const byStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px',
  };

  return (
    <div style={containerStyle}>
      <h3>Change History ({snapshots.length} versions)</h3>
      <div style={listStyle}>
        {snapshots.map((snapshot) => {
          const isFirstVersion = snapshot.version === 1;
          const isLatest = snapshot.version === snapshots.length;
          
          return (
            <div 
              key={snapshot.id} 
              style={{
                ...itemStyle,
                backgroundColor: snapshot.version === selectedVersion ? '#e3f2fd' : '#f8f9fa',
                border: snapshot.version === selectedVersion ? '2px solid #1e3a5f' : 'none',
              }}
            >
              <div style={headerStyle}>
                <div style={leftStyle}>
                  <span style={typeStyle}>
                    Version {snapshot.version} - {snapshot.changeType.toUpperCase()}
                  </span>
                  {isFirstVersion && (
                    <span style={badgeStyle}>📌 Base</span>
                  )}
                  {isLatest && !isFirstVersion && (
                    <span style={{ ...badgeStyle, backgroundColor: '#28a745' }}>✅ Latest</span>
                  )}
                </div>
                <div style={rightStyle}>
                  <span style={dateStyle}>{formatDateTime(snapshot.changedAt)}</span>
                  {!isFirstVersion && (
                    <button
                      onClick={() => onVersionDelete(snapshot.version)}
                      style={deleteButtonStyle}
                      title="Delete this version"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              {snapshot.changeType !== 'created' && (
                <div style={detailStyle}>
                  {snapshot.changeDetails.notes || 
                    `Changed from ${snapshot.changeDetails.oldValue} to ${snapshot.changeDetails.newValue} on ${formatDate(snapshot.changeDetails.date || '')}`
                  }
                </div>
              )}
              <div style={byStyle}>By: {snapshot.changedBy}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RosterHistory;