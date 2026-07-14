import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getRosterById, 
  getSnapshotsByRosterId,
  getLatestSnapshotByRosterId,
  getSnapshotByVersion,
  saveSnapshot,
  updateRoster,
  generateId,
  deleteSnapshot,
  deleteRoster
} from '../../utils/storage';
import { Roster, RosterSnapshot } from '../../types';
import { createChangeSnapshot } from '../../utils/rosterHelpers';
import Navigation from '../common/Navigation';
import RosterHeader from './RosterHeader';
import RosterTable from './RosterTable';
import RosterSummary from './RosterSummary';
import RosterHistory from './RosterHistory';
import PrintPage from './PrintPage';

// Define a pending change type
interface PendingChange {
  id: string;
  employeeId: string;
  date: string;
  changeType: 'overtime' | 'extra_off' | 'shift_change';
  oldValue: string;
  newValue: string;
  notes: string;
  employeeName: string;
}

const RosterDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [roster, setRoster] = useState<Roster | null>(null);
  const [snapshots, setSnapshots] = useState<RosterSnapshot[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<RosterSnapshot | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // State for the edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState<'overtime' | 'extra_off' | 'shift_change' | null>(null);
  const [editData, setEditData] = useState({
    employeeId: '',
    date: '',
    newValue: '',
    notes: '',
  });
  
  // State for pending changes
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  
  // State for version delete
  const [versionToDelete, setVersionToDelete] = useState<number | null>(null);

  // Helper to safely access generatedData
  const getGeneratedData = useCallback((snapshot: RosterSnapshot) => {
    return (snapshot.data as any).generatedData;
  }, []);

  // Helper to check if a date matches a header
  const dateMatchesHeader = useCallback((date: Date, header: string): boolean => {
    const dateKey = `${date.getDate()}/${date.getMonth() + 1}`;
    return header.includes(dateKey);
  }, []);

  // Load roster data
  const loadRosterData = useCallback((rosterId: string) => {
    const foundRoster = getRosterById(rosterId);
    if (!foundRoster) {
      navigate('/dashboard');
      return;
    }
    
    setRoster(foundRoster);
    
    const rosterSnapshots = getSnapshotsByRosterId(rosterId);
    setSnapshots(rosterSnapshots);
    
    const latest = getLatestSnapshotByRosterId(rosterId);
    if (latest) {
      setCurrentSnapshot(latest);
      setSelectedVersion(latest.version);
    }
    
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (id) {
      loadRosterData(id);
    }
  }, [id, loadRosterData]);

  const handleVersionChange = useCallback((version: number) => {
    if (!id) return;
    const snapshot = getSnapshotByVersion(id, version);
    if (snapshot) {
      setCurrentSnapshot(snapshot);
      setSelectedVersion(version);
      setPendingChanges([]);
    }
  }, [id]);

  const getShiftColor = useCallback((shift: string): string => {
    const colors: { [key: string]: string } = {
      'Day': '#4CAF50',
      'Night': '#2196F3',
      'Off': '#9E9E9E',
      'Overtime': '#8B4513',
      'Morning': '#FF9800',
      'Evening': '#9C27B0',
      'Holiday': '#E91E63',
      'Sick': '#FF5722',
      'Training': '#00BCD4',
      'Break': '#FFC107',
      'Meeting': '#3F51B5',
      'Travel': '#009688',
      'Remote': '#795548',
    };
    return colors[shift] || '#607D8B';
  }, []);

  const getShiftDisplay = useCallback((shift: string): string => {
    return shift || 'Off';
  }, []);

    const handleEditClick = useCallback((type: 'overtime' | 'extra_off' | 'shift_change') => {
    setEditType(type);
    setEditData({
      employeeId: roster?.employees[0]?.id || '',
      date: '',
      newValue: '',
      notes: '',
    });
    setShowEditModal(true);
  }, [roster]);

  const handleAddPendingChange = useCallback(() => {
    if (!roster || !editType || !editData.date || !currentSnapshot) {
      alert('Missing required information');
      return;
    }

    const employee = roster.employees.find(e => e.id === editData.employeeId);
    if (!employee) {
      alert('Employee not found');
      return;
    }

    const generatedData = getGeneratedData(currentSnapshot);
    const selectedDate = new Date(editData.date);
    const dateIndex = generatedData.headers.findIndex((h: string) => 
      dateMatchesHeader(selectedDate, h)
    );
    
    if (dateIndex === -1) {
      alert(`Date not found in roster. Please select a date within the roster period.\n\nAvailable dates: ${generatedData.headers.join(', ')}`);
      return;
    }

    const employeeRow = generatedData.rows[employee.id];
    if (!employeeRow) {
      alert('Employee not found in roster');
      return;
    }

    const oldValue = employeeRow[dateIndex];
    let newValue: string = oldValue;

    switch (editType) {
      case 'overtime':
        if (oldValue === 'Off') {
          newValue = 'Overtime';
        } else {
          alert('Overtime can only be applied to Off days');
          return;
        }
        break;
      case 'extra_off':
        if (oldValue !== 'Off') {
          newValue = 'Off';
        } else {
          alert('This day is already Off');
          return;
        }
        break;
      case 'shift_change':
        const shiftMap: Record<string, string> = {
          'Day': 'Day',
          'Night': 'Night',
          'Off': 'Off',
        };
        if (editData.newValue in shiftMap) {
          newValue = shiftMap[editData.newValue];
        } else {
          alert('Invalid shift value');
          return;
        }
        break;
    }

    const existingChange = pendingChanges.find(
      p => p.employeeId === employee.id && p.date === editData.date && p.changeType === editType
    );

    if (existingChange) {
      setPendingChanges(pendingChanges.map(p => 
        p.id === existingChange.id 
          ? { ...p, newValue, notes: editData.notes || p.notes }
          : p
      ));
    } else {
      const newPendingChange: PendingChange = {
        id: generateId(),
        employeeId: employee.id,
        date: editData.date,
        changeType: editType,
        oldValue: oldValue,
        newValue: newValue,
        notes: editData.notes || '',
        employeeName: employee.name,
      };
      setPendingChanges([...pendingChanges, newPendingChange]);
    }

    setShowEditModal(false);
    setEditType(null);
    alert(`✓ ${editType.toUpperCase()} change added for ${employee.name} on ${new Date(editData.date).toLocaleDateString()}`);
  }, [roster, editType, editData, currentSnapshot, pendingChanges, getGeneratedData, dateMatchesHeader]);

  const handleSubmitAllChanges = useCallback(async () => {
    if (!roster || !user || !currentSnapshot || pendingChanges.length === 0) {
      alert('No pending changes to submit');
      return;
    }

    setIsSubmitting(true);

    try {
      let currentRosterData = JSON.parse(JSON.stringify(currentSnapshot.data));
      
      for (const change of pendingChanges) {
        const employee = roster.employees.find(e => e.id === change.employeeId);
        if (!employee) continue;

        const selectedDate = new Date(change.date);
        const dateIndex = currentRosterData.generatedData.headers.findIndex((h: string) => 
          dateMatchesHeader(selectedDate, h)
        );
        
        if (dateIndex === -1) continue;

        const employeeRow = currentRosterData.generatedData.rows[change.employeeId];
        if (!employeeRow) continue;

        employeeRow[dateIndex] = change.newValue;
      }

      for (const employee of roster.employees) {
        const employeeRow = currentRosterData.generatedData.rows[employee.id];
        if (employeeRow) {
          const shiftCount = employeeRow.filter((s: string) => s !== 'Off').length;
          const summaryIndex = currentRosterData.generatedData.summary.findIndex(
            (s: any) => s.name === employee.name
          );
          if (summaryIndex !== -1) {
            currentRosterData.generatedData.summary[summaryIndex].shifts = shiftCount;
          }
        }
      }

      currentRosterData.updatedAt = new Date().toISOString();
      currentRosterData.updatedBy = user.id;
      currentRosterData.currentVersion = currentSnapshot.version + 1;

      const newSnapshot: RosterSnapshot = {
        id: generateId(),
        rosterId: roster.id,
        version: currentSnapshot.version + 1,
        data: currentRosterData,
        changeType: pendingChanges.length > 1 ? 'shift_change' : pendingChanges[0].changeType,
        changeDetails: {
          notes: `${pendingChanges.length} changes applied:\n${pendingChanges.map(p => 
            `  - ${p.changeType}: ${p.employeeName} on ${new Date(p.date).toLocaleDateString()} (${p.oldValue} → ${p.newValue})`
          ).join('\n')}`,
        },
        changedBy: user.id,
        changedAt: new Date().toISOString(),
      };

      saveSnapshot(newSnapshot);

      const updatedRoster = { ...roster };
      updatedRoster.currentVersion = newSnapshot.version;
      updatedRoster.updatedAt = new Date().toISOString();
      updatedRoster.updatedBy = user.id;
      updateRoster(updatedRoster);

      setRoster(updatedRoster);
      setSnapshots([...snapshots, newSnapshot]);
      setCurrentSnapshot(newSnapshot);
      setSelectedVersion(newSnapshot.version);
      
      setPendingChanges([]);
      setShowPendingModal(false);
      
      alert(`✅ All ${pendingChanges.length} changes submitted successfully! Version ${newSnapshot.version} created.`);
    } catch (error) {
      console.error('Error submitting changes:', error);
      alert('Failed to submit changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [roster, user, currentSnapshot, pendingChanges, snapshots, dateMatchesHeader]);

  const handleRemovePendingChange = useCallback((changeId: string) => {
    setPendingChanges(pendingChanges.filter(p => p.id !== changeId));
  }, [pendingChanges]);

  const handleClearAllPendingChanges = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all pending changes?')) {
      setPendingChanges([]);
      setShowPendingModal(false);
    }
  }, []);

  const handleDeleteVersion = useCallback((version: number) => {
    if (!roster) return;
    
    if (version === 1) {
      alert('❌ Cannot delete the initial version (Version 1). This is the base roster.');
      return;
    }
    
    setVersionToDelete(version);
  }, [roster]);

  const confirmDeleteVersion = useCallback(() => {
    if (!roster || !versionToDelete) return;
    
    try {
      const snapshotToDelete = getSnapshotByVersion(roster.id, versionToDelete);
      if (!snapshotToDelete) {
        alert('Version not found');
        setVersionToDelete(null);
        return;
      }
      
      deleteSnapshot(snapshotToDelete.id);
      
      const remainingSnapshots = getSnapshotsByRosterId(roster.id);
      const latestVersion = remainingSnapshots.length > 0 
        ? remainingSnapshots[remainingSnapshots.length - 1].version 
        : 1;
      
      if (roster.currentVersion > latestVersion) {
        const updatedRoster = { ...roster };
        updatedRoster.currentVersion = latestVersion;
        updatedRoster.updatedAt = new Date().toISOString();
        updatedRoster.updatedBy = user?.id || 'system';
        updateRoster(updatedRoster);
        setRoster(updatedRoster);
      }
      
      const updatedSnapshots = getSnapshotsByRosterId(roster.id);
      setSnapshots(updatedSnapshots);
      
      const latest = getLatestSnapshotByRosterId(roster.id);
      if (latest) {
        setCurrentSnapshot(latest);
        setSelectedVersion(latest.version);
      }
      
      setVersionToDelete(null);
      alert(`✅ Version ${versionToDelete} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting version:', error);
      alert('Failed to delete version. Please try again.');
    }
  }, [roster, versionToDelete, user]);

  const cancelDeleteVersion = useCallback(() => {
    setVersionToDelete(null);
  }, []);

    const handleDeleteRoster = useCallback(() => {
    if (!roster) return;
    
    if (window.confirm(`Are you sure you want to delete "${roster.name}"? This action cannot be undone and will delete all versions and history.`)) {
      try {
        deleteRoster(roster.id);
        navigate('/dashboard');
        alert('Roster deleted successfully!');
      } catch (error) {
        console.error('Error deleting roster:', error);
        alert('Failed to delete roster. Please try again.');
      }
    }
  }, [roster, navigate]);

  // ============================================
  // FORMAT FUNCTIONS - MUST BE DECLARED BEFORE handlePrint
  // ============================================
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const formatDateTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // ============================================
  // PRINT FUNCTION - Uses formatDate and formatDateTime
  // ============================================
const handlePrint = useCallback(() => {
  if (!roster || !currentSnapshot) return;
  setShowPrintView(true);
}, [roster, currentSnapshot]);

// Function to close print view
const handleClosePrintView = useCallback(() => {
  setShowPrintView(false);
}, []);

  // ============================================
  // MEMOIZED VALUES
  // ============================================
  const currentData = useMemo(() => {
    if (!currentSnapshot) return null;
    return getGeneratedData(currentSnapshot);
  }, [currentSnapshot, getGeneratedData]);

  const isLatestVersion = useMemo(() => {
    return selectedVersion === snapshots.length && snapshots.length > 0;
  }, [selectedVersion, snapshots.length]);

  const hasPendingChanges = useMemo(() => {
    return pendingChanges.length > 0;
  }, [pendingChanges.length]);

  // Download roster as HTML file
const handleDownload = useCallback(() => {
  if (!roster || !currentSnapshot) return;
  
  const currentData = getGeneratedData(currentSnapshot);
  
  // Build the HTML content
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${roster.name} - Roster</title>
  <style>
    /* Reset and base styles */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      background: white; 
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .print-container {
      max-width: 1200px;
      width: 100%;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    /* Header */
    .header {
      text-align: center;
      padding: 20px;
      margin-bottom: 30px;
      border-bottom: 2px solid #1e3a5f;
    }
    
    .header h1 {
      color: #1e3a5f;
      font-size: 28px;
      margin-bottom: 8px;
    }
    
    .header p {
      color: #555;
      font-size: 14px;
      margin: 4px 0;
    }
    
    .header .meta {
      margin-top: 10px;
      font-size: 12px;
      color: #999;
    }
    
    /* Summary */
    .summary {
      padding: 20px;
      margin-bottom: 30px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    
    .summary h3 {
      color: #1e3a5f;
      margin-bottom: 12px;
      font-size: 18px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-weight: bold;
      font-size: 14px;
      border-bottom: 1px dashed #eee;
    }
    
    .summary-item:last-child {
      border-bottom: none;
    }
    
    .summary-total {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid #1e3a5f;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      color: #1e3a5f;
    }
    
    /* Table */
    .table-container {
      overflow-x: auto;
      margin-bottom: 20px;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 13px;
    }
    
    th, td {
      border: 1px solid #000;
      padding: 8px 10px;
      text-align: center;
    }
    
    th {
      background-color: #1e3a5f;
      color: white;
      font-weight: bold;
      font-size: 12px;
    }
    
    td {
      font-size: 12px;
      font-weight: bold;
    }
    
    .staff-name {
      background-color: #e0e0e0;
      font-weight: bold;
      text-align: left;
      min-width: 120px;
    }
    
    .company-number {
      font-size: 10px;
      color: #666;
    }
    
    /* Shift colors */
    .shift-day { background-color: #4CAF50; color: white; }
    .shift-night { background-color: #2196F3; color: white; }
    .shift-off { background-color: #9E9E9E; color: white; }
    .shift-overtime { background-color: #8B4513; color: white; }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 15px;
      margin-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #999;
    }
    
    /* Print styles */
    @media print {
      body {
        padding: 10px !important;
        background: white !important;
      }
      
      .print-container {
        box-shadow: none !important;
        padding: 10px !important;
        max-width: 100% !important;
      }
      
      .header h1 {
        font-size: 24px !important;
      }
      
      table {
        font-size: 11px !important;
        page-break-inside: avoid !important;
      }
      
      th {
        font-size: 10px !important;
      }
      
      td {
        font-size: 10px !important;
      }

      .circle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-weight: bold;
                font-size: 12px;
            }
      
      .staff-name {
        font-size: 10px !important;
        min-width: 80px !important;
      }
      
      thead {
        display: table-header-group !important;
      }
      
      tr {
        page-break-inside: avoid !important;
      }
      
      @page {
        size: ANSI-C landscape;
        margin: 0.3in;
      }
    }
  </style>
</head>
<body>
  <div class="print-container">
    <!-- Header -->
    <div class="header">
      <h1>${roster.name}</h1>
      <p>${formatDate(roster.startDate)} - ${formatDate(roster.endDate)}</p>
      <p>Created: ${formatDate(roster.createdAt)}</p>
      <div class="meta">
        Version: ${currentSnapshot.version} | Employees: ${roster.employees.length} | Days: ${currentData.headers.length}
      </div>
    </div>

    <!-- Summary -->
    <div class="summary">
      <h3>📊 Shifts Summary</h3>
      ${currentData.summary.map((item: any) => `
        <div class="summary-item">
          <span>${item.name}</span>
          <span>${item.shifts} shifts</span>
        </div>
      `).join('')}
      <div class="summary-total">
        Total: ${currentData.summary.reduce((acc: number, item: any) => acc + item.shifts, 0)} shifts
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            ${currentData.headers.map((h: string) => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${roster.employees.map((employee) => `
            <tr>
              <td class="staff-name">
                <strong>${employee.name}</strong>
                <br />
                <span class="company-number">#${employee.companyNumber}</span>
              </td>
              ${currentData.rows[employee.id]?.map((shift: string) => `
                <td class="shifft-${shift.toLowerCase()}">
                <div class="shifft-${shift.toLowerCase()} circle" style="display: inlineFlex;
                alignItems: center;
                justifyContent: center;
                width: 40px;
                height: 40px;
                borderRadius: 50%;
                fontWeight: bold;
                fontSize: 12px;">${shift}</div></td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer">
      Downloaded on ${new Date().toLocaleString()} | ${roster.name}
    </div>
  </div>
</body>
</html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${roster.name.replace(/\s+/g, '_')}_roster.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  alert('✅ Roster downloaded successfully!');
}, [roster, currentSnapshot, getGeneratedData, formatDate]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={loadingStyle}>
          <p>Loading roster...</p>
        </div>
      </>
    );
  }

  if (!roster || !currentSnapshot || !currentData) {
    return (
      <>
        <Navigation />
        <div style={loadingStyle}>
          <p>Roster not found</p>
        </div>
      </>
    );
  }

    return (
  <>
    {/* If print view is active, show only the print page */}
    {showPrintView ? (
      <PrintPage
        roster={roster}
        snapshot={currentSnapshot}
        getShiftColor={getShiftColor}
        getShiftDisplay={getShiftDisplay}
        formatDate={formatDate}
        onClose={handleClosePrintView}
      />
    ) : (
      <>
        <Navigation />
        
        {/* Regular view */}
        <div className="no-print" style={containerStyle}>
          <RosterHeader
            roster={roster}
            selectedVersion={selectedVersion}
            totalVersions={snapshots.length}
            hasPendingChanges={hasPendingChanges}
            pendingCount={pendingChanges.length}
            isLatestVersion={isLatestVersion}
            onEditClick={handleEditClick}
            onDeleteRoster={handleDeleteRoster}
            onDownload={handleDownload}
            onPrint={handlePrint}
            onVersionChange={handleVersionChange}
            snapshots={snapshots}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
          />

          <RosterTable
            roster={roster}
            headers={currentData.headers}
            rows={currentData.rows}
            getShiftColor={getShiftColor}
            getShiftDisplay={getShiftDisplay}
            isPrintView={false}
          />

          <RosterSummary summary={currentData.summary} isPrintView={false} />

          <RosterHistory
            snapshots={snapshots}
            selectedVersion={selectedVersion}
            onVersionDelete={handleDeleteVersion}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
          />
        </div>

        {/* ... rest of modals ... */}
        {/* Edit Modal - Add to pending changes */}
      {showEditModal && (
        <div style={modalOverlayStyle} onClick={() => setShowEditModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>
              {editType === 'overtime' && 'Add Overtime'}
              {editType === 'extra_off' && 'Add Extra Off'}
              {editType === 'shift_change' && 'Add Shift Change'}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              This change will be added to your pending list. You can add multiple changes before submitting all at once.
            </p>
            
            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Employee</label>
              <select
                value={editData.employeeId}
                onChange={(e) => setEditData({ ...editData, employeeId: e.target.value })}
                style={modalSelectStyle}
              >
                {roster.employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Date</label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                style={modalInputStyle}
                min={roster.startDate}
                max={roster.endDate}
              />
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                Available dates: {currentData.headers.join(', ')}
              </small>
            </div>

            {editType === 'shift_change' && (
              <div style={modalFieldStyle}>
                <label style={modalLabelStyle}>New Shift</label>
                <select
                  value={editData.newValue}
                  onChange={(e) => setEditData({ ...editData, newValue: e.target.value })}
                  style={modalSelectStyle}
                >
                  <option value="">Select shift</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                  <option value="Off">Off</option>
                </select>
              </div>
            )}

            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Notes (Optional)</label>
              <input
                type="text"
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                style={modalInputStyle}
                placeholder="Add note about this change"
              />
            </div>

            <div style={modalButtonGroupStyle}>
              <button 
                onClick={() => setShowEditModal(false)} 
                style={modalCancelButtonStyle}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddPendingChange} 
                style={modalSubmitButtonStyle}
              >
                + Add to Pending
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Changes Modal */}
      {showPendingModal && (
        <div style={modalOverlayStyle} onClick={() => setShowPendingModal(false)}>
          <div style={{ ...modalStyle, maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>📋 Pending Changes ({pendingChanges.length})</h3>
            
            {pendingChanges.length === 0 ? (
              <p style={{ color: '#666' }}>No pending changes to submit.</p>
            ) : (
              <>
                <div style={pendingListStyle}>
                  {pendingChanges.map((change, index) => (
                    <div key={change.id} style={pendingItemStyle}>
                      <div style={pendingItemHeaderStyle}>
                        <span style={pendingItemTypeStyle}>
                          {index + 1}. {change.changeType.toUpperCase()}
                        </span>
                        <button 
                          onClick={() => handleRemovePendingChange(change.id)}
                          style={pendingRemoveButtonStyle}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={pendingItemDetailsStyle}>
                        <strong>{change.employeeName}</strong> | 
                        {formatDate(change.date)} | 
                        {change.oldValue} → {change.newValue}
                      </div>
                      {change.notes && (
                        <div style={pendingItemNotesStyle}>📝 {change.notes}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={modalButtonGroupStyle}>
                  <button 
                    onClick={handleClearAllPendingChanges} 
                    style={{ ...modalCancelButtonStyle, backgroundColor: '#dc3545' }}
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => setShowPendingModal(false)} 
                    style={{ ...modalCancelButtonStyle }}
                  >
                    Close
                  </button>
                  <button 
                    onClick={handleSubmitAllChanges} 
                    style={{ ...modalSubmitButtonStyle }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : `✅ Submit All (${pendingChanges.length})`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Version Delete Confirmation Modal */}
      {versionToDelete && (
        <div style={modalOverlayStyle} onClick={cancelDeleteVersion}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ ...modalTitleStyle, color: '#dc3545' }}>⚠️ Delete Version {versionToDelete}</h3>
            <p style={modalTextStyle}>
              Are you sure you want to delete Version {versionToDelete}?
              <br />
              <br />
              <strong>This action:</strong>
              <ul style={modalListStyle}>
                <li>Cannot be undone</li>
                <li>Will remove this version from history</li>
                <li>Will not affect other versions</li>
              </ul>
              {versionToDelete === snapshots.length && (
                <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                  ⚠️ This is the latest version. Deleting it will revert to the previous version.
                </p>
              )}
            </p>
            <div style={modalButtonGroupStyle}>
              <button 
                onClick={cancelDeleteVersion} 
                style={modalCancelButtonStyle}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteVersion} 
                style={modalDeleteButtonStyle}
              >
                Yes, Delete Version
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    )}
  </>
);
};

// ============================================
// STYLES SECTION
// ============================================

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '30px 20px',
};

const loadingStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
  fontSize: '18px',
  color: '#666',
};

// Modal styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  maxWidth: '500px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const modalTitleStyle: React.CSSProperties = {
  marginBottom: '20px',
  color: '#1e3a5f',
};

const modalTextStyle: React.CSSProperties = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px',
};

const modalListStyle: React.CSSProperties = {
  marginTop: '10px',
  paddingLeft: '20px',
  color: '#666',
  lineHeight: '1.8',
};

const modalFieldStyle: React.CSSProperties = {
  marginBottom: '15px',
};

const modalLabelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#333',
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const modalSelectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const modalButtonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
};

const modalCancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

const modalSubmitButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

const modalDeleteButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

// Pending changes styles
const pendingListStyle: React.CSSProperties = {
  maxHeight: '300px',
  overflowY: 'auto',
  marginBottom: '15px',
};

const pendingItemStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '8px',
  border: '1px solid #e9ecef',
};

const pendingItemHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
};

const pendingItemTypeStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#1e3a5f',
};

const pendingRemoveButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: '2px 8px',
  fontSize: '14px',
};

const pendingItemDetailsStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#555',
};

const pendingItemNotesStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#666',
  fontStyle: 'italic',
  marginTop: '4px',
};

export default RosterDisplay;