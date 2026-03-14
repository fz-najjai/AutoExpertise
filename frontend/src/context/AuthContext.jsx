import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8001/api', // Switched to 8001 to avoid conflicts
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to inject the token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/user');
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user", err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/register', data);
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch(e) {}
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
