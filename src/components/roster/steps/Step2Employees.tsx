import React, { useState } from 'react';
import { EmployeeFormData } from '../../../types';
import { generateId, generateCompanyNumber } from '../../../utils/storage';

interface Step2EmployeesProps {
  employees: EmployeeFormData[];
  onUpdate: (data: { employees: EmployeeFormData[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2Employees: React.FC<Step2EmployeesProps> = ({
  employees,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [localEmployees, setLocalEmployees] = useState<EmployeeFormData[]>(employees);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<EmployeeFormData>>({
  name: '',
  phone: '',
  email: '',
  companyNumber: generateCompanyNumber(),
  circlePattern: ['Day', 'Day', 'Night', 'Night', 'Off', 'Off'], // Default 6-slot
});
  const [error, setError] = useState('');

  const handleAddEmployee = () => {
    setError('');

    if (!formData.name) {
      setError('Please enter employee name');
      return;
    }

    if (!formData.phone) {
      setError('Please enter employee phone');
      return;
    }

    if (!formData.email) {
      setError('Please enter employee email');
      return;
    }

    const newEmployee: EmployeeFormData = {
  id: generateId(),
  name: formData.name,
  phone: formData.phone,
  email: formData.email,
  companyNumber: formData.companyNumber || generateCompanyNumber(),
  circlePattern: ['Day', 'Day', 'Night', 'Night', 'Off', 'Off'], // Default 6-slot
};

    if (editingIndex !== null) {
      // Update existing employee
      const updated = [...localEmployees];
      updated[editingIndex] = newEmployee;
      setLocalEmployees(updated);
      setEditingIndex(null);
    } else {
      // Add new employee
      setLocalEmployees([...localEmployees, newEmployee]);
    }

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      companyNumber: generateCompanyNumber(),
      circlePattern: ['Day', 'Day', 'Night', 'Night', 'Off', 'Off'],
    });
  };

  const handleEdit = (index: number) => {
    const employee = localEmployees[index];
    setFormData({
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      companyNumber: employee.companyNumber,
      circlePattern: employee.circlePattern,
    });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      const updated = localEmployees.filter((_, i) => i !== index);
      setLocalEmployees(updated);
      if (editingIndex === index) {
        setEditingIndex(null);
        setFormData({
          name: '',
          phone: '',
          email: '',
          companyNumber: generateCompanyNumber(),
          circlePattern: ['Day', 'Day', 'Night', 'Night', 'Off', 'Off'],
        });
      }
    }
  };

  const handleNext = () => {
    if (localEmployees.length === 0) {
      setError('Please add at least one employee');
      return;
    }
    onUpdate({ employees: localEmployees });
    onNext();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Step 2: Add Employees</h2>
      <p style={descriptionStyle}>
        Add employees to the roster. You'll set their circle patterns in the next step.
      </p>

      <div style={formContainerStyle}>
        <div style={formRowStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Employee Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Full name"
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Phone number"
            />
          </div>
        </div>

        <div style={formRowStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Email address"
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Company Number</label>
            <input
              type="text"
              name="companyNumber"
              value={formData.companyNumber || ''}
              onChange={handleChange}
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
              readOnly
            />
            <small style={helperStyle}>Auto-generated</small>
          </div>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <button 
          onClick={handleAddEmployee} 
          style={addButtonStyle}
          type="button"
        >
          {editingIndex !== null ? 'Update Employee' : '+ Add Employee'}
        </button>

        {editingIndex !== null && (
          <button 
            onClick={() => {
              setEditingIndex(null);
              setFormData({
                name: '',
                phone: '',
                email: '',
                companyNumber: generateCompanyNumber(),
                circlePattern: ['Day', 'Day', 'Night', 'Night', 'Off', 'Off'],
              });
            }} 
            style={cancelButtonStyle}
            type="button"
          >
            Cancel Editing
          </button>
        )}
      </div>

      {localEmployees.length > 0 && (
        <div style={listContainerStyle}>
          <h4 style={listTitleStyle}>Added Employees ({localEmployees.length})</h4>
          {localEmployees.map((emp, index) => (
            <div key={emp.id} style={employeeItemStyle}>
              <div style={employeeInfoStyle}>
                <strong>{emp.name}</strong>
                <span style={detailStyle}>{emp.phone}</span>
                <span style={detailStyle}>{emp.email}</span>
                <span style={detailStyle}>#{emp.companyNumber}</span>
              </div>
              <div style={buttonGroupStyle}>
                <button 
                  onClick={() => handleEdit(index)} 
                  style={editButtonStyle}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(index)} 
                  style={deleteButtonStyle}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

const formContainerStyle: React.CSSProperties = {
  marginBottom: '25px',
};

const formRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px',
  marginBottom: '15px',
};

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle: React.CSSProperties = {
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '16px',
};

const helperStyle: React.CSSProperties = {
  marginTop: '5px',
  color: '#666',
  fontSize: '12px',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '10px',
  borderRadius: '6px',
  marginBottom: '15px',
};

const addButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginRight: '10px',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const listContainerStyle: React.CSSProperties = {
  marginTop: '25px',
  marginBottom: '25px',
};

const listTitleStyle: React.CSSProperties = {
  color: '#1e3a5f',
  marginBottom: '15px',
};

const employeeItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  marginBottom: '8px',
  flexWrap: 'wrap',
  gap: '10px',
};

const employeeInfoStyle: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const detailStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '14px',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const editButtonStyle: React.CSSProperties = {
  padding: '6px 15px',
  backgroundColor: '#ffc107',
  color: '#333',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '6px 15px',
  backgroundColor: '#dc3545',
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

export default Step2Employees;