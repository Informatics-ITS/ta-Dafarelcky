// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('email'));

  // ✅ LOGIN FUNCTION CALLED FROM THE LOGIN PAGE
  const login = async (email, password) => {
    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);

      const response = await axios.post(process.env.REACT_APP_API_LOGIN_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const receivedToken = response.data.result.token;
      setToken(receivedToken);
      setUserEmail(email);

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('email', email);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error };
    }
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
