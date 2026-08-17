// src/components/roster/help/HelpPage.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../common/BackButton';
import { helpContents, helpButtonIds, HelpContent } from './helpData';

const HelpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState<string>('print');
  const [activeContent, setActiveContent] = useState<HelpContent>(helpContents.print);

  // Get roster ID from navigation state
  const rosterId = (location.state as any)?.rosterId || '';

  // If no rosterId, redirect to dashboard
  useEffect(() => {
    if (!rosterId) {
      navigate('/dashboard');
    }
  }, [rosterId, navigate]);

  // Get the active button from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section && helpContents[section]) {
      setActiveButton(section);
      setActiveContent(helpContents[section]);
    }
  }, [location]);

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
    setActiveContent(helpContents[buttonId]);
    // Update URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.set('section', buttonId);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <BackButton 
            label="Back to Roster" 
            urlTo={`/roster/${rosterId}`}  // Uses actual roster ID
          />
        </div>
        <h1 style={titleStyle}>📖 How to Use the System</h1>
        <div style={headerRightStyle}></div>
      </div>

      {/* Navigation Buttons */}
      <div style={navContainerStyle}>
        <div style={navButtonsStyle}>
          {helpButtonIds.map((id) => (
            <button
              key={id}
              onClick={() => handleButtonClick(id)}
              style={{
                ...navButtonStyle,
                ...(activeButton === id ? activeNavButtonStyle : {}),
              }}
              className={`help-nav-btn ${activeButton === id ? 'active' : ''}`}
            >
              {helpContents[id].buttonLabel}
            </button>
          ))}
        </div>
        {/* Sliding indicator */}
        <div style={sliderContainerStyle}>
          <div
            style={{
              ...sliderStyle,
              transform: `translateX(${helpButtonIds.indexOf(activeButton) * 100}%)`,
              width: `${100 / helpButtonIds.length}%`,
            }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div style={contentContainerStyle}>
        <div style={contentCardStyle}>
          <h2 style={contentTitleStyle}>{activeContent.title}</h2>
          <p style={contentDescriptionStyle}>{activeContent.description}</p>

          <div style={contentBodyStyle}>
            {/* Steps */}
            <div style={stepsSectionStyle}>
              <h3 style={sectionTitleStyle}>📋 Step-by-Step Guide</h3>
              <ol style={stepsListStyle}>
                {activeContent.steps.map((step, index) => (
                  <li key={index} style={stepItemStyle}>
                    <span style={stepNumberStyle}>{index + 1}</span>
                    <span style={stepTextStyle}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            {activeContent.tips && activeContent.tips.length > 0 && (
              <div style={tipsSectionStyle}>
                <h3 style={sectionTitleStyle}>💡 Pro Tips</h3>
                <ul style={tipsListStyle}>
                  {activeContent.tips.map((tip, index) => (
                    <li key={index} style={tipItemStyle}>
                      <span style={tipIconStyle}>✨</span>
                      <span style={tipTextStyle}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Image Placeholder */}
            <div style={imageSectionStyle}>
              <h3 style={sectionTitleStyle}>🖼️ Visual Guide</h3>
              <div style={imagePlaceholderStyle}>
                <div style={imagePlaceholderInnerStyle}>
                  <span style={imagePlaceholderIconStyle}>📸</span>
                  <p style={imagePlaceholderTextStyle}>
                    Screenshot placeholder
                    <br />
                    <span style={imagePlaceholderSubStyle}>
                      (Screenshot: {activeContent.title})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <p style={footerTextStyle}>
          Smart Roster v1.0 • Need more help? Contact support
        </p>
      </div>

      <style>
        {`
          .help-nav-btn {
            position: relative;
            transition: all 0.3s ease;
          }
          .help-nav-btn:hover {
            background-color: #e8f0fe !important;
            transform: translateY(-2px);
          }
          .help-nav-btn.active {
            background-color: #1e3a5f !important;
            color: white !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(30, 58, 95, 0.3);
          }
        `}
      </style>
    </div>
  );
};

// ============================================
// STYLES
// ============================================

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 30px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px',
};

const headerLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const headerRightStyle: React.CSSProperties = {
  minWidth: '100px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(24px, 3vw, 32px)',
  fontWeight: '700',
  color: '#1e3a5f',
  margin: 0,
  textAlign: 'center',
};

const navContainerStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px 30px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  marginBottom: '24px',
};

const navButtonsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
  maxWidth: '100%',
  overflow: 'auto',
  marginBottom: '16px',
};

const navButtonStyle: React.CSSProperties = {
  padding: '14px 20px',
  backgroundColor: '#f1f3f5',
  color: '#495057',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  textAlign: 'center',
};

const activeNavButtonStyle: React.CSSProperties = {
  backgroundColor: '#1e3a5f',
  color: 'white',
  boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)',
};

const sliderContainerStyle: React.CSSProperties = {
  position: 'relative',
  height: '4px',
  backgroundColor: '#e9ecef',
  borderRadius: '2px',
  overflow: 'hidden',
};

const sliderStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  backgroundColor: '#1e3a5f',
  borderRadius: '2px',
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
};

const contentContainerStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  padding: '30px',
  overflow: 'auto',
  marginBottom: '24px',
};

const contentCardStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
};

const contentTitleStyle: React.CSSProperties = {
  fontSize: 'clamp(22px, 2.5vw, 28px)',
  fontWeight: '700',
  color: '#1e3a5f',
  marginBottom: '12px',
};

const contentDescriptionStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#495057',
  lineHeight: '1.6',
  marginBottom: '24px',
  padding: '16px 20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  borderLeft: '4px solid #1e3a5f',
};

const contentBodyStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
};

const stepsSectionStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1e3a5f',
  marginBottom: '16px',
};

const stepsListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const stepItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '10px 14px',
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const stepNumberStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '28px',
  height: '28px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  borderRadius: '50%',
  fontSize: '13px',
  fontWeight: '700',
  flexShrink: 0,
};

const stepTextStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#333',
  lineHeight: '1.5',
  paddingTop: '2px',
};

const tipsSectionStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#fff8e1',
  borderRadius: '8px',
  border: '1px solid #ffe0b2',
};

const tipsListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const tipItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '8px 12px',
  backgroundColor: 'white',
  borderRadius: '6px',
};

const tipIconStyle: React.CSSProperties = {
  fontSize: '18px',
  flexShrink: 0,
  marginTop: '2px',
};

const tipTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#555',
  lineHeight: '1.5',
};

const imageSectionStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
};

const imagePlaceholderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#e9ecef',
  borderRadius: '8px',
  minHeight: '200px',
  border: '2px dashed #adb5bd',
};

const imagePlaceholderInnerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  textAlign: 'center',
  padding: '20px',
};

const imagePlaceholderIconStyle: React.CSSProperties = {
  fontSize: '48px',
};

const imagePlaceholderTextStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#6c757d',
  margin: 0,
};

const imagePlaceholderSubStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#adb5bd',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6c757d',
  margin: 0,
};

export default HelpPage;
