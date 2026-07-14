import React from 'react';
import { Roster } from '../../types';

interface RosterHeaderProps {
  roster: Roster;
  selectedVersion: number;
  totalVersions: number;
  hasPendingChanges: boolean;
  pendingCount: number;
  isLatestVersion: boolean;
  onEditClick: (type: 'overtime' | 'extra_off' | 'shift_change') => void;
  onDeleteRoster: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onVersionChange: (version: number) => void;
  snapshots: any[];
  formatDate: (date: string) => string;
  formatDateTime: (date: string) => string;
}

const RosterHeader: React.FC<RosterHeaderProps> = ({
  roster,
  selectedVersion,
  totalVersions,
  hasPendingChanges,
  pendingCount,
  isLatestVersion,
  onEditClick,
  onDeleteRoster,
  onDownload,
  onPrint,
  onVersionChange,
  snapshots,
  formatDate,
  formatDateTime,
}) => {
  return (
    <div style={headerStyle}>
      <div>
        <h1>{roster.name}</h1>
        <p style={subHeaderStyle}>
          {formatDate(roster.startDate)} - {formatDate(roster.endDate)}
          <br />
          Created by: {roster.createdBy} | {formatDate(roster.createdAt)}
          {roster.updatedAt && ` | Updated: ${formatDate(roster.updatedAt)}`}
          <br />
          <span style={versionStyle}>Version: {selectedVersion} of {totalVersions}</span>
          {hasPendingChanges && (
            <span style={{ ...versionStyle, color: '#ffc107', marginLeft: '10px' }}>
              ⚡ {pendingCount} pending changes
            </span>
          )}
        </p>
      </div>
      <div style={buttonGroupStyle}>
        <div style={versionSelectorStyle} className="version-selector">
          <label style={versionLabelStyle}>View Version:</label>
          <select
            value={selectedVersion}
            onChange={(e) => onVersionChange(Number(e.target.value))}
            style={versionSelectStyle}
          >
            {snapshots.map((s) => (
              <option key={s.version} value={s.version}>
                v{s.version} - {formatDateTime(s.changedAt)}
                {s.changeType !== 'created' && ` (${s.changeType})`}
              </option>
            ))}
          </select>
        </div>
        {isLatestVersion && (
          <div style={editButtonGroupStyle}>
            <button 
              onClick={() => onEditClick('overtime')} 
              style={{ ...editButtonStyle, backgroundColor: '#8B4513' }}
            >
              Overtime
            </button>
            <button 
              onClick={() => onEditClick('extra_off')} 
              style={{ ...editButtonStyle, backgroundColor: '#dc3545' }}
            >
              Extra Off
            </button>
            <button 
              onClick={() => onEditClick('shift_change')} 
              style={{ ...editButtonStyle, backgroundColor: '#ffc107', color: '#333' }}
            >
              Shift Change
            </button>
            {hasPendingChanges && (
              <button 
                onClick={() => {}} // This will be handled by parent
                style={{ ...editButtonStyle, backgroundColor: '#28a745' }}
              >
                📋 Submit All ({pendingCount})
              </button>
            )}
            <button 
              onClick={onDeleteRoster} 
              style={{ ...editButtonStyle, backgroundColor: '#dc3545' }}
            >
              🗑️ Delete Roster
            </button>
            <button 
              onClick={onPrint} 
              style={{ ...editButtonStyle, backgroundColor: '#6c757d' }}
            >
              🖨️ Print
            </button>
            <button 
              onClick={onDownload} 
              style={{ ...editButtonStyle, backgroundColor: '#28a745' }}
              >
                  ⬇️ Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '30px',
  flexWrap: 'wrap',
  gap: '15px',
};

const subHeaderStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '14px',
  marginTop: '5px',
  lineHeight: '1.6',
};

const versionStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#1e3a5f',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'flex-end',
};

const versionSelectorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const versionLabelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#333',
  fontSize: '14px',
};

const versionSelectStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '14px',
  backgroundColor: 'white',
  cursor: 'pointer',
  minWidth: '200px',
};

const editButtonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
};

const editButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'transform 0.2s',
};

export default RosterHeader;