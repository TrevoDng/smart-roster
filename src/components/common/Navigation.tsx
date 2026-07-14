import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <div style={logoStyle}>
          <Link to="/dashboard" style={linkStyle}>
            📋 Smart Roster
          </Link>
        </div>
        
        <div style={navLinksStyle}>
          <Link to="/dashboard" style={linkStyle}>
            Dashboard
          </Link>
          <Link to="/create-roster" style={linkStyle}>
            Create Roster
          </Link>
        </div>

        <div style={userInfoStyle}>
          <span style={userNameStyle}>
            👤 {user?.firstName} {user?.lastName}
          </span>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  backgroundColor: '#1e3a5f',
  padding: '15px 20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const navContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px',
};

const logoStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const navLinksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '25px',
  alignItems: 'center',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  transition: 'color 0.3s',
};

const userInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  color: 'white',
};

const userNameStyle: React.CSSProperties = {
  fontSize: '14px',
  opacity: 0.9,
};

const logoutButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
};

export default Navigation;