import React from 'react';
import { EmployeeFormData } from '../../../types';

interface Step4ReviewProps {
  formData: {
    startDate: string;
    endDate: string;
    employees: EmployeeFormData[];
  };
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step4Review: React.FC<Step4ReviewProps> = ({
  formData,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays();

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Step 4: Review & Create</h2>
      <p style={descriptionStyle}>
        Review the roster details before creating it.
      </p>

      <div style={reviewSectionStyle}>
        <h4 style={sectionTitleStyle}>📅 Roster Period</h4>
        <div style={infoRowStyle}>
          <span style={labelStyle}>Start Date:</span>
          <span>{formatDate(formData.startDate)}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={labelStyle}>End Date:</span>
          <span>{formatDate(formData.endDate)}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={labelStyle}>Total Days:</span>
          <span>{totalDays} days</span>
        </div>
      </div>

      <div style={reviewSectionStyle}>
        <h4 style={sectionTitleStyle}>👥 Employees ({formData.employees.length})</h4>
        {formData.employees.map((employee) => (
          <div key={employee.id} style={employeeReviewStyle}>
            <div style={employeeReviewHeaderStyle}>
              <strong>{employee.name}</strong>
              <span style={companyNumberStyle}>#{employee.companyNumber}</span>
            </div>
            <div style={employeeReviewDetailsStyle}>
              <span>{employee.email}</span>
              <span>{employee.phone}</span>
            </div>
            <div style={patternPreviewStyle}>
              <span style={patternLabelStyle}>Pattern:</span>
              {employee.circlePattern.map((shift, idx) => (
                <span 
                  key={idx} 
                  style={{
                    ...patternBadgeStyle,
                    backgroundColor: getShiftColor(shift),
                  }}
                >
                  {shift}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={warningBoxStyle}>
        <p style={warningTextStyle}>
          ⚠️ <strong>Note:</strong> Once created, this roster will be saved and you'll be able to make changes
          (overtime, extra off, shift changes) from the roster view page.
        </p>
      </div>

      <div style={buttonContainerStyle}>
        <button onClick={onBack} style={backButtonStyle} disabled={isSubmitting}>
          ← Back
        </button>
        <button onClick={onSubmit} style={submitButtonStyle} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : '✅ Create Roster'}
        </button>
      </div>
    </div>
  );
};

const getShiftColor = (shift: string): string => {
  switch (shift) {
    case 'Day': return '#4CAF50';
    case 'Night': return '#2196F3';
    case 'Off': return '#9E9E9E';
    default: return '#9E9E9E';
  }
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

const reviewSectionStyle: React.CSSProperties = {
  marginBottom: '25px',
  paddingBottom: '20px',
  borderBottom: '1px solid #eee',
};

const sectionTitleStyle: React.CSSProperties = {
  color: '#1e3a5f',
  marginBottom: '15px',
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid #f5f5f5',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#666',
};

const employeeReviewStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '12px',
};

const employeeReviewHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
};

const companyNumberStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#666',
  backgroundColor: '#e9ecef',
  padding: '2px 10px',
  borderRadius: '12px',
};

const employeeReviewDetailsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px',
};

const patternPreviewStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const patternLabelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#666',
  marginRight: '5px',
  fontSize: '13px',
};

const patternBadgeStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: '20px',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
};

const warningBoxStyle: React.CSSProperties = {
  backgroundColor: '#fff3cd',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '25px',
};

const warningTextStyle: React.CSSProperties = {
  margin: 0,
  color: '#856404',
  fontSize: '14px',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '25px',
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

const submitButtonStyle: React.CSSProperties = {
  padding: '12px 30px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Step4Review;