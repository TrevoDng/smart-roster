import React, { useState } from 'react';
import { EmployeeFormData } from '../../../types';

interface Step3PatternsProps {
  employees: EmployeeFormData[];
  onUpdate: (data: { employees: EmployeeFormData[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3Patterns: React.FC<Step3PatternsProps> = ({
  employees,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [localEmployees, setLocalEmployees] = useState<EmployeeFormData[]>(
    employees.map(emp => ({
      ...emp,
      circlePattern: emp.circlePattern || ['Day', 'Day', 'Night', 'Night', 'Off', 'Off'],
    }))
  );

  // State for custom shift input
  const [customShiftInput, setCustomShiftInput] = useState<{ [key: string]: string }>({});

  const shiftOptions = ['Day', 'Night', 'Off'];

  const getShiftColor = (shift: string): string => {
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
    };
    return colors[shift] || '#607D8B'; // Default color for custom shifts
  };

  const getShiftEmoji = (shift: string): string => {
    const emojis: { [key: string]: string } = {
      'Day': '☀️',
      'Night': '🌙',
      'Off': '📴',
      'Overtime': '⏰',
      'Morning': '🌅',
      'Evening': '🌆',
      'Holiday': '🎉',
      'Sick': '🤒',
      'Training': '📚',
    };
    return emojis[shift] || '📋';
  };

  const handleShiftChange = (employeeIndex: number, patternIndex: number, value: string) => {
    const updated = [...localEmployees];
    updated[employeeIndex].circlePattern[patternIndex] = value;
    setLocalEmployees(updated);
  };

  const handleAddPatternSlot = (employeeIndex: number) => {
    const updated = [...localEmployees];
    updated[employeeIndex].circlePattern.push('Off');
    setLocalEmployees(updated);
  };

  const handleRemovePatternSlot = (employeeIndex: number, patternIndex: number) => {
    const updated = [...localEmployees];
    if (updated[employeeIndex].circlePattern.length <= 1) {
      alert('Cannot remove the last slot. Each employee needs at least one shift.');
      return;
    }
    updated[employeeIndex].circlePattern.splice(patternIndex, 1);
    setLocalEmployees(updated);
  };

  const handlePatternLengthChange = (employeeIndex: number, newLength: number) => {
    if (newLength < 1) {
      alert('Pattern must have at least 1 slot');
      return;
    }
    if (newLength > 50) {
      alert('Pattern cannot exceed 50 slots');
      return;
    }

    const updated = [...localEmployees];
    const currentPattern = updated[employeeIndex].circlePattern;
    
    if (newLength > currentPattern.length) {
      while (currentPattern.length < newLength) {
        currentPattern.push('Off');
      }
    } else if (newLength < currentPattern.length) {
      currentPattern.splice(newLength);
    }
    
    setLocalEmployees(updated);
  };

  const handleAddCustomShift = (employeeIndex: number, customShift: string) => {
    if (!customShift.trim()) return;
    const updated = [...localEmployees];
    updated[employeeIndex].circlePattern.push(customShift.trim());
    setLocalEmployees(updated);
    setCustomShiftInput({ ...customShiftInput, [employeeIndex]: '' });
  };

  const handleRemoveCustomShift = (employeeIndex: number, value: string) => {
    // Remove the custom shift from the select options
    // Note: We're not actually storing a list of custom shifts globally,
    // but we can clean up the input field
    setCustomShiftInput({ ...customShiftInput, [employeeIndex]: '' });
  };

  const handleCopyPattern = (sourceIndex: number) => {
    const sourcePattern = localEmployees[sourceIndex].circlePattern;
    const updated = localEmployees.map((emp, idx) => {
      if (idx !== sourceIndex) {
        return { ...emp, circlePattern: [...sourcePattern] };
      }
      return emp;
    });
    setLocalEmployees(updated);
    alert(`Pattern copied to all employees!`);
  };

  const handlePastePattern = (targetIndex: number, sourcePattern: string[]) => {
    const updated = [...localEmployees];
    updated[targetIndex].circlePattern = [...sourcePattern];
    setLocalEmployees(updated);
  };

  const handleNext = () => {
    const invalidEmployees = localEmployees.filter(emp => emp.circlePattern.length === 0);
    if (invalidEmployees.length > 0) {
      alert(`Please ensure all employees have at least one shift in their pattern.`);
      return;
    }
    onUpdate({ employees: localEmployees });
    onNext();
  };

  // Get all shift types used in the roster
  const getAllShifts = () => {
    const shifts = new Set<string>();
    localEmployees.forEach(emp => {
      emp.circlePattern.forEach(shift => shifts.add(shift));
    });
    return Array.from(shifts);
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Step 3: Set Circle Patterns</h2>
      <p style={descriptionStyle}>
        Create custom shift patterns for each employee. You can use any shift names and any pattern length.
        Each pattern repeats throughout the roster period.
      </p>

      <div style={infoBoxStyle}>
        <p style={infoTextStyle}>
          🎯 <strong>Flexible Pattern Builder</strong>
          <br />
          • <strong>Add/Remove slots</strong> to create any pattern length (1-50 slots)
          <br />
          • <strong>Choose shifts</strong> from the dropdown or type custom shift names
          <br />
          • <strong>Examples:</strong> 
          <br />
          6-slot: Day, Day, Night, Night, Off, Off
          <br />
          5-slot: Morning, Day, Evening, Night, Off
          <br />
          4-slot: Day, Night, Training, Off
          <br />
          • <strong>Copy pattern</strong> from one employee to all others
        </p>
      </div>

      {/* Show all shifts used in the roster */}
      {localEmployees.length > 0 && (
        <div style={legendStyle}>
          <h5 style={legendTitleStyle}>📊 Shifts Used in This Roster:</h5>
          <div style={legendContainerStyle}>
            {getAllShifts().map(shift => (
              <span key={shift} style={{
                ...legendItemStyle,
                backgroundColor: getShiftColor(shift),
                color: 'white',
              }}>
                {getShiftEmoji(shift)} {shift}
              </span>
            ))}
          </div>
        </div>
      )}

      {localEmployees.map((employee, empIndex) => (
        <div key={employee.id} style={employeePatternStyle}>
          <div style={employeeHeaderStyle}>
            <div style={employeeNameContainerStyle}>
              <h4 style={employeeNameStyle}>{employee.name}</h4>
              <span style={employeePatternLengthStyle}>
                {employee.circlePattern.length} slots
              </span>
            </div>
            <div style={patternControlsStyle}>
              <span style={patternLengthLabel}>Pattern Length:</span>
              <button
                onClick={() => handlePatternLengthChange(empIndex, employee.circlePattern.length - 1)}
                style={patternControlButtonStyle}
                title="Remove last slot"
              >
                -
              </button>
              <span style={patternLengthValue}>{employee.circlePattern.length}</span>
              <button
                onClick={() => handlePatternLengthChange(empIndex, employee.circlePattern.length + 1)}
                style={patternControlButtonStyle}
                title="Add new slot"
              >
                +
              </button>
              <button
                onClick={() => handleCopyPattern(empIndex)}
                style={copyPatternButtonStyle}
                title="Copy this pattern to all employees"
              >
                📋 Copy to All
              </button>
            </div>
          </div>
          
          <div style={patternGridStyle}>
            {employee.circlePattern.map((shift, shiftIndex) => {
              // Generate options with custom shifts
              const allOptions = [...shiftOptions];
              // Add any custom shifts from other employees
              getAllShifts().forEach(s => {
                if (!allOptions.includes(s)) {
                  allOptions.push(s);
                }
              });
              
              return (
                <div key={shiftIndex} style={patternItemStyle}>
                  <label style={patternLabelStyle}>Slot {shiftIndex + 1}</label>
                  <div style={slotContainerStyle}>
                    <select
                      value={shift}
                      onChange={(e) => handleShiftChange(empIndex, shiftIndex, e.target.value)}
                      style={{
                        ...selectStyle,
                        backgroundColor: getShiftColor(shift),
                        color: 'white',
                      }}
                    >
                      {allOptions.map((option) => (
                        <option key={option} value={option} style={{ 
                          backgroundColor: '#fff', 
                          color: '#333' 
                        }}>
                          {getShiftEmoji(option)} {option}
                        </option>
                      ))}
                      <option value="__custom__" style={{ 
                        backgroundColor: '#e7f3ff', 
                        color: '#1e3a5f',
                        fontWeight: 'bold' 
                      }}>
                        ➕ Add Custom Shift
                      </option>
                    </select>
                    {employee.circlePattern.length > 1 && (
                      <button
                        onClick={() => handleRemovePatternSlot(empIndex, shiftIndex)}
                        style={removeSlotButtonStyle}
                        title="Remove this slot"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={addSlotButtonContainerStyle}>
            <button
              onClick={() => handleAddPatternSlot(empIndex)}
              style={addSlotButtonStyle}
            >
              + Add Slot
            </button>
          </div>
        </div>
      ))}

      <div style={buttonContainerStyle}>
        <button onClick={onBack} style={backButtonStyle}>
          ← Back
        </button>
        <button onClick={handleNext} style={buttonStyle}>
          Next Step →
        </button>
      </div>
    </div>
  );
};

// Styles
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
  marginBottom: '20px',
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: '#e7f3ff',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '25px',
};

const infoTextStyle: React.CSSProperties = {
  margin: 0,
  color: '#1e3a5f',
  fontSize: '14px',
  lineHeight: '1.8',
};

const legendStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '25px',
};

const legendTitleStyle: React.CSSProperties = {
  margin: '0 0 10px 0',
  color: '#1e3a5f',
};

const legendContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
};

const legendItemStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 'bold',
};

const employeePatternStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const employeeHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  flexWrap: 'wrap',
  gap: '10px',
};

const employeeNameContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const employeeNameStyle: React.CSSProperties = {
  color: '#1e3a5f',
  margin: 0,
};

const employeePatternLengthStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#666',
  backgroundColor: '#e9ecef',
  padding: '2px 10px',
  borderRadius: '12px',
};

const patternControlsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const patternLengthLabel: React.CSSProperties = {
  fontSize: '13px',
  color: '#666',
  marginRight: '5px',
};

const patternControlButtonStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#1e3a5f',
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const copyPatternButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
};

const patternLengthValue: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '16px',
  minWidth: '30px',
  textAlign: 'center',
  color: '#1e3a5f',
};

const patternGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '10px',
  marginBottom: '10px',
};

const patternItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const patternLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#666',
  fontWeight: 'bold',
};

const slotContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const selectStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  textAlign: 'center',
  appearance: 'auto',
  minWidth: '80px',
};

const removeSlotButtonStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#dc3545',
  color: 'white',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const addSlotButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: '5px',
};

const addSlotButtonStyle: React.CSSProperties = {
  padding: '6px 15px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '25px',
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

const backButtonStyle: React.CSSProperties = {
  padding: '12px 30px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Step3Patterns;