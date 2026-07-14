import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');
  
  const { register, isLoggedIn, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in - runs only when isLoggedIn changes
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  // Clear error when component unmounts - only once
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
    }
  }, [formData, register, navigate]);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div style={rowStyle}>
            <div style={halfInputStyle}>
              <label style={labelStyle}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter first name"
                required
              />
            </div>
            <div style={halfInputStyle}>
              <label style={labelStyle}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter phone number (optional)"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Confirm your password"
              required
            />
          </div>

          {(localError || error) && (
            <div style={errorStyle}>
              {localError || error}
            </div>
          )}

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Already have an account? <Link to="/login" style={linkStyle}>Login here</Link>
        </p>
        
        <p style={{ marginTop: '10px' }}>
          <Link to="/" style={linkStyle}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

// Styles remain the same as before
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  padding: '20px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '450px',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#1e3a5f',
  marginBottom: '30px',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
  marginBottom: '20px',
};

const halfInputStyle: React.CSSProperties = {
  flex: 1,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '10px',
  borderRadius: '6px',
  marginBottom: '15px',
};

const linkTextStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  color: '#666',
};

const linkStyle: React.CSSProperties = {
  color: '#1e3a5f',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default Register;