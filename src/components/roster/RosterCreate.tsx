import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generateId, saveRoster, saveSnapshot } from '../../utils/storage';
import { Roster, EmployeeFormData } from '../../types';
import { createRosterName, createInitialSnapshot } from '../../utils/rosterHelpers';
import Navigation from '../common/Navigation';
import Step1Dates from './steps/Step1Dates';
import Step2Employees from './steps/Step2Employees';
import Step3Patterns from './steps/Step3Patterns';
import Step4Review from './steps/Step4Review';

const RosterCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    employees: [] as EmployeeFormData[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to create a roster');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create roster metadata
      const rosterName = createRosterName(formData.startDate, formData.endDate);
      
      const newRoster: Roster = {
        id: generateId(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        name: rosterName,
        employees: formData.employees.map(e => ({
          ...e,
          id: e.id,
          name: e.name,
          phone: e.phone,
          email: e.email,
          companyNumber: e.companyNumber,
          circlePattern: e.circlePattern,
        })),
        currentVersion: 1,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id,
      };
      
      // Save roster metadata
      saveRoster(newRoster);
      
      // Create and save initial snapshot
      const initialSnapshot = createInitialSnapshot(newRoster, user.id);
      saveSnapshot(initialSnapshot);
      
      // Navigate to the roster view
      navigate(`/roster/${newRoster.id}`);
    } catch (error) {
      console.error('Error creating roster:', error);
      alert('Failed to create roster. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Dates
            startDate={formData.startDate}
            endDate={formData.endDate}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2Employees
            employees={formData.employees}
            onUpdate={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3Patterns
            employees={formData.employees}
            onUpdate={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4Review
            formData={formData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <div style={containerStyle}>
        <div style={progressStyle}>
          <div style={progressBarStyle}>
            <div 
              style={{
                ...progressFillStyle,
                width: `${(currentStep / 4) * 100}%`,
              }}
            />
          </div>
          <div style={stepIndicatorStyle}>
            <span>Step {currentStep} of 4</span>
            <span style={stepTitleStyle}>
              {currentStep === 1 && 'Set Dates'}
              {currentStep === 2 && 'Add Employees'}
              {currentStep === 3 && 'Set Circle Patterns'}
              {currentStep === 4 && 'Review & Create'}
            </span>
          </div>
        </div>
        {renderStep()}
      </div>
    </>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '30px 20px',
};

const progressStyle: React.CSSProperties = {
  marginBottom: '40px',
};

const progressBarStyle: React.CSSProperties = {
  width: '100%',
  height: '8px',
  backgroundColor: '#e9ecef',
  borderRadius: '4px',
  overflow: 'hidden',
};

const progressFillStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: '#1e3a5f',
  transition: 'width 0.3s ease',
};

const stepIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '10px',
  color: '#666',
  fontSize: '14px',
};

const stepTitleStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#1e3a5f',
};

export default RosterCreate;