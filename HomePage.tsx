import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroSectionStyle}>
        <div style={heroContentStyle}>
          <div style={iconContainerStyle}>
            <span style={iconStyle}>📖</span>
          </div>
          <h1 style={titleStyle}>Smart Roster Generator</h1>
          <p style={subtitleStyle}>
            Streamline your workforce management with our intelligent roster system
          </p>
          
          {isLoggedIn ? (
            <div style={authContainerStyle}>
              <div style={welcomeCardStyle}>
                <span style={waveStyle}>👋</span>
                <p style={welcomeTextStyle}>
                  Welcome back, <strong style={nameStyle}>{user?.firstName}!</strong>
                </p>
                <p style={welcomeSubtextStyle}>Ready to manage your rosters?</p>
              </div>
              <div style={buttonGroupStyle}>
                <Link to="/dashboard">
                  <button style={{ ...buttonStyle, backgroundColor: '#2563eb', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)' }}>
                    <span>📊</span> Go to Dashboard
                  </button>
                </Link>
                <button onClick={logout} style={{ ...buttonStyle, backgroundColor: '#ef4444', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}>
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={authContainerStyle}>
              <p style={ctaTextStyle}>Get started with Smart Roster today</p>
              <div style={buttonGroupStyle}>
                <Link to="/login">
                  <button style={{ ...buttonStyle, backgroundColor: '#2563eb', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)' }}>
                    <span>🔐</span> Login
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{ ...buttonStyle, backgroundColor: '#16a34a', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)' }}>
                    <span>✨</span> Register
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div style={featuresSectionStyle}>
        <h2 style={sectionTitleStyle}>✨ Powerful Features</h2>
        <p style={sectionSubtitleStyle}>Everything you need to manage your workforce efficiently</p>
        
        <div style={featuresGridStyle}>
          <div style={featureCardStyle}>
            <div style={{ ...featureIconStyle, backgroundColor: '#dbeafe' }}>
              <span style={{ fontSize: '32px' }}>📋</span>
            </div>
            <h3 style={featureTitleStyle}>Create Rosters</h3>
            <p style={featureDescStyle}>
              Easily create and manage employee rosters with our intuitive interface
            </p>
            <div style={featureBadgeStyle}>Smart</div>
          </div>

          <div style={{ ...featureCardStyle, borderTop: '4px solid #f59e0b' }}>
            <div style={{ ...featureIconStyle, backgroundColor: '#fef3c7' }}>
              <span style={{ fontSize: '32px' }}>🔄</span>
            </div>
            <h3 style={featureTitleStyle}>Track Changes</h3>
            <p style={featureDescStyle}>
              Monitor overtime, extra off days, and shift changes with ease
            </p>
            <div style={{ ...featureBadgeStyle, backgroundColor: '#f59e0b' }}>Track</div>
          </div>

          <div style={{ ...featureCardStyle, borderTop: '4px solid #8b5cf6' }}>
            <div style={{ ...featureIconStyle, backgroundColor: '#ede9fe' }}>
              <span style={{ fontSize: '32px' }}>📜</span>
            </div>
            <h3 style={featureTitleStyle}>History Tracking</h3>
            <p style={featureDescStyle}>
              Full accountability with detailed history and version control
            </p>
            <div style={{ ...featureBadgeStyle, backgroundColor: '#8b5cf6' }}>History</div>
          </div>

          <div style={{ ...featureCardStyle, borderTop: '4px solid #ec4899' }}>
            <div style={{ ...featureIconStyle, backgroundColor: '#fce7f3' }}>
              <span style={{ fontSize: '32px' }}>📊</span>
            </div>
            <h3 style={featureTitleStyle}>Multiple Rosters</h3>
            <p style={featureDescStyle}>
              Create and manage multiple rosters for different departments or teams
            </p>
            <div style={{ ...featureBadgeStyle, backgroundColor: '#ec4899' }}>Multi</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={statsSectionStyle}>
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>100%</span>
            <span style={statLabelStyle}>User Satisfaction</span>
          </div>
          <div style={statDividerStyle}></div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>24/7</span>
            <span style={statLabelStyle}>Availability</span>
          </div>
          <div style={statDividerStyle}></div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>Free</span>
            <span style={statLabelStyle}>To Use</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={ctaSectionStyle}>
        <div style={ctaContentStyle}>
          <h2 style={ctaTitleStyle}>Ready to Get Started?</h2>
          <p style={ctaDescStyle}>
            Join thousands of users who trust Smart Roster for their workforce management
          </p>
          {!isLoggedIn && (
            <Link to="/register">
              <button style={{ ...buttonStyle, backgroundColor: '#16a34a', padding: '16px 48px', fontSize: '20px', boxShadow: '0 4px 20px rgba(22, 163, 74, 0.5)' }}>
                <span>🚀</span> Create Free Account
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// STYLES
// ============================================

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
};

const heroSectionStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 50%, #1e3a5f 100%)',
  padding: '80px 20px 60px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const heroContentStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
};

const iconContainerStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  padding: '20px',
  borderRadius: '50%',
  marginBottom: '24px',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
};

const iconStyle: React.CSSProperties = {
  fontSize: '48px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(36px, 6vw, 56px)',
  fontWeight: 'bold',
  color: 'white',
  marginBottom: '16px',
  letterSpacing: '-0.5px',
  textShadow: '0 2px 20px rgba(0,0,0,0.2)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 'clamp(16px, 2vw, 22px)',
  color: 'rgba(255,255,255,0.9)',
  maxWidth: '600px',
  margin: '0 auto 40px',
  lineHeight: '1.6',
};

const authContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
};

const welcomeCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: '20px 40px',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  width: '100%',
  maxWidth: '400px',
};

const waveStyle: React.CSSProperties = {
  fontSize: '32px',
  display: 'block',
  marginBottom: '8px',
};

const welcomeTextStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '24px',
  margin: 0,
};

const nameStyle: React.CSSProperties = {
  color: '#fbbf24',
};

const welcomeSubtextStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '14px',
  margin: '4px 0 0',
};

const ctaTextStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '18px',
  marginBottom: '8px',
  opacity: 0.95,
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const buttonStyle: React.CSSProperties = {
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: '600',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
};

const featuresSectionStyle: React.CSSProperties = {
  padding: '80px 20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'clamp(28px, 4vw, 38px)',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#1e293b',
  marginBottom: '12px',
};

const sectionSubtitleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#64748b',
  fontSize: '18px',
  marginBottom: '48px',
};

const featuresGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '24px',
};

const featureCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '32px 24px',
  borderRadius: '16px',
  textAlign: 'center',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  borderTop: '4px solid #2563eb',
};

const featureIconStyle: React.CSSProperties = {
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
};

const featureTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '8px',
};

const featureDescStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '12px',
};

const featureBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '20px',
  backgroundColor: '#2563eb',
  color: 'white',
  fontSize: '12px',
  fontWeight: '600',
};

const statsSectionStyle: React.CSSProperties = {
  backgroundColor: '#1e293b',
  padding: '60px 20px',
};

const statsContainerStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
};

const statItemStyle: React.CSSProperties = {
  textAlign: 'center',
  minWidth: '120px',
};

const statNumberStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#fbbf24',
  marginBottom: '4px',
};

const statLabelStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '14px',
};

const statDividerStyle: React.CSSProperties = {
  width: '1px',
  height: '40px',
  backgroundColor: '#475569',
};

const ctaSectionStyle: React.CSSProperties = {
  padding: '80px 20px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
};

const ctaContentStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
};

const ctaTitleStyle: React.CSSProperties = {
  fontSize: 'clamp(28px, 4vw, 36px)',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '12px',
};

const ctaDescStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '18px',
  marginBottom: '32px',
};

export default HomePage;
