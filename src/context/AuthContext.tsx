import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { authReducer } from '../reducers/authReducer';
import { 
  findUserByEmail, 
  saveUser, 
  setCurrentUser, 
  getCurrentUser,
  generateId 
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoggedIn: false,
    loading: true,
    error: null,
  });

  // Check for existing session on mount - only run once
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, []); // Empty dependency array - runs only once

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = findUserByEmail(credentials.email);
      
      if (!user) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'User not found' });
        return false;
      }
      
      if (user.password !== credentials.password) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid password' });
        return false;
      }
      
      // Store user in localStorage
      setCurrentUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
      
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const existingUser = findUserByEmail(data.email);
      if (existingUser) {
        dispatch({ type: 'REGISTER_FAILURE', payload: 'Email already registered' });
        return false;
      }
      
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        dispatch({ type: 'REGISTER_FAILURE', payload: 'Passwords do not match' });
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: generateId(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || '',
        companyNumber: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save user
      saveUser(newUser);
      
      // Auto-login after registration
      setCurrentUser(newUser);
      dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
      return true;
      
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'LOGIN_FAILURE', payload: '' });
  }, []);

  const value = useMemo(() => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  }), [state.user, state.isLoggedIn, state.loading, state.error, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};