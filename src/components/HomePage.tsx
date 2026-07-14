import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1>Smart Roster Generator</h1>
      <p style={{ fontSize: '18px', color: '#555', marginBottom: '30px' }}>
        Welcome to the Smart Roster Generator! This application helps you create, manage, 
        and track employee rosters efficiently.
      </p>
      
      {isLoggedIn ? (
        <div>
          <p style={{ fontSize: '20px', color: '#2a5298' }}>
            Welcome back, {user?.firstName}! 👋
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <Link to="/dashboard">
              <button style={buttonStyle}>Go to Dashboard</button>
            </Link>
            <button onClick={logout} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/login">
            <button style={buttonStyle}>Login</button>
          </Link>
          <Link to="/register">
            <button style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Register</button>
          </Link>
        </div>
      )}
      
      <div style={{ marginTop: '50px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Features:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>Create and manage employee rosters</li>
          <li>Track overtime, extra off, and shift changes</li>
          <li>History tracking with user accountability</li>
          <li>Multiple roster support</li>
        </ul>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '12px 30px',
  fontSize: '18px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: '0.3s',
};

export default HomePage;