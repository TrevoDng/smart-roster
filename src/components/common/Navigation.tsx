import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={navContainerStyle}>
          {/* Logo */}
          <Link to="/dashboard" style={logoLinkStyle}>
            <FontAwesomeIcon 
              icon={faBookOpenReader} 
              style={{ fontSize: '22px', color: '#1e3a5f' }}
            />
            <span style={logoTextStyle}>Smart Roster</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div style={desktopNavStyle} className="desktop-nav">
            <Link 
              to="/" 
              style={{
                ...navLinkStyle,
                ...(isActive('/') ? activeNavLinkStyle : {})
              }}
              className="nav-link"
            >
              <span style={linkIconStyle}><i className="fa-solid fa-house"></i></span>
              Home
            </Link>
            <Link 
              to="/dashboard" 
              style={{
                ...navLinkStyle,
                ...(isActive('/dashboard') ? activeNavLinkStyle : {})
              }}
              className="nav-link"
            >
              <span style={linkIconStyle}>📊</span>
              Dashboard
            </Link>
            <Link 
              to="/create-roster" 
              style={{
                ...navLinkStyle,
                ...(isActive('/create-roster') ? activeNavLinkStyle : {})
              }}
              className="nav-link"
            >
              <span style={linkIconStyle}>✨</span>
              Create Roster
            </Link>
          </div>

          {/* Right Section */}
          <div style={rightSectionStyle}>
            {/* User Info - Desktop */}
            <div style={userInfoStyle} className="user-info">
              <div style={userAvatarStyle}>
                <span style={avatarTextStyle}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div style={userDetailsStyle}>
                <span style={userNameStyle}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span style={userRoleStyle}>Admin</span>
              </div>
            </div>

            {/* Logout Button - Desktop */}
            <button onClick={handleLogout} style={logoutButtonStyle} className="logout-btn">
              <span style={logoutIconStyle}>🚪</span>
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu} 
              style={mobileMenuButtonStyle}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              <span style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>
                {isMobileMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={mobileOverlayStyle} onClick={toggleMobileMenu}>
          <div style={mobileMenuStyle} onClick={(e) => e.stopPropagation()}>
            <div style={mobileMenuHeaderStyle}>
              <FontAwesomeIcon 
                icon={faBookOpenReader} 
                style={{ fontSize: '20px', color: '#1e3a5f' }}
              />
              <span style={mobileMenuTitleStyle}>Smart Roster</span>
              <button 
                onClick={toggleMobileMenu} 
                style={mobileCloseButtonStyle}
              >
                ✕
              </button>
            </div>

            <div style={mobileMenuLinksStyle}>
              <Link 
                to="/dashboard" 
                style={mobileLinkStyle}
                className="mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span style={linkIconStyle}>📊</span>
                Dashboard
              </Link>
              <Link 
                to="/create-roster" 
                style={mobileLinkStyle}
                className="mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span style={linkIconStyle}>✨</span>
                Create Roster
              </Link>
            </div>

            <div style={mobileDividerStyle}></div>

            <div style={mobileUserInfoStyle}>
              <div style={mobileUserAvatarStyle}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div style={mobileUserDetailsStyle}>
                <span style={mobileUserNameStyle}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span style={mobileUserRoleStyle}>Administrator</span>
              </div>
              <button onClick={handleLogout} style={mobileLogoutButtonStyle} className="mobile-logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================
// STYLES
// ============================================

const navStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '0 16px',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  borderBottom: '1px solid #e2e8f0',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
};

const navContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// Logo
const logoLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  color: '#1e293b',
  flexShrink: 0,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: 'clamp(16px, 2.5vw, 22px)',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  whiteSpace: 'nowrap',
};

// Desktop Navigation
const desktopNavStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
};

const navLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#475569',
  textDecoration: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  backgroundColor: 'transparent',
  whiteSpace: 'nowrap',
};

const activeNavLinkStyle: React.CSSProperties = {
  color: '#1e3a5f',
  backgroundColor: '#eff6ff',
};

const linkIconStyle: React.CSSProperties = {
  fontSize: '16px',
};

// Right Section
const rightSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

// User Info
const userInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const userAvatarStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: '600',
  fontSize: '13px',
  flexShrink: 0,
};

const avatarTextStyle: React.CSSProperties = {
  color: 'white',
  fontWeight: '600',
  fontSize: '13px',
  textTransform: 'uppercase',
};

const userDetailsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  lineHeight: '1.2',
};

const userNameStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#1e293b',
};

const userRoleStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#94a3b8',
  fontWeight: '500',
};

// Logout Button
const logoutButtonStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  whiteSpace: 'nowrap',
};

const logoutIconStyle: React.CSSProperties = {
  fontSize: '14px',
};

// Mobile Menu Button
const mobileMenuButtonStyle: React.CSSProperties = {
  display: 'none',
  background: 'none',
  border: 'none',
  color: '#1e293b',
  cursor: 'pointer',
  padding: '4px',
  alignItems: 'center',
  justifyContent: 'center',
};

// Mobile Overlay
const mobileOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 2000,
  animation: 'fadeIn 0.3s ease',
};

// Mobile Menu
const mobileMenuStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '85%',
  maxWidth: '320px',
  height: '100%',
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  animation: 'slideIn 0.3s ease',
};

const mobileMenuHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  paddingBottom: '16px',
  borderBottom: '1px solid #e2e8f0',
};

const mobileMenuTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1e293b',
  flex: 1,
};

const mobileCloseButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  color: '#64748b',
  cursor: 'pointer',
  padding: '4px',
};

const mobileMenuLinksStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const mobileLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#475569',
  textDecoration: 'none',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
};

const mobileDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#e2e8f0',
};

const mobileUserInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  marginTop: 'auto',
};

const mobileUserAvatarStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: '600',
  fontSize: '14px',
  textTransform: 'uppercase',
  flexShrink: 0,
};

const mobileUserDetailsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const mobileUserNameStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1e293b',
};

const mobileUserRoleStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#94a3b8',
};

const mobileLogoutButtonStyle: React.CSSProperties = {
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
};

// CSS Animations
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @media (min-width: 769px) {
    .mobile-menu-btn {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }
    .user-info {
      display: none !important;
    }
    .logout-btn {
      display: none !important;
    }
    .mobile-menu-btn {
      display: flex !important;
    }
  }

  @media (max-width: 480px) {
    .logo-text {
      font-size: 16px !important;
    }
    .logo-icon {
      font-size: 18px !important;
    }
    nav {
      padding: 0 12px !important;
      height: 56px !important;
    }
  }

  .nav-link:hover {
    background-color: #f1f5f9 !important;
    color: #1e293b !important;
  }
  .logout-btn:hover {
    background-color: #e2e8f0 !important;
  }
  .mobile-link:hover {
    background-color: #f1f5f9 !important;
  }
  .mobile-logout-btn:hover {
    background-color: #dc2626 !important;
  }
`;
document.head.appendChild(styleElement);

export default Navigation;
