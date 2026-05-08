import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user on startup if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const u = await api.getMyProfile();
      setUser(u);
      const b = await api.getMyBookings();
      setBookings(b);
      const l = await api.getMyLoyalty();
      setLoyalty(l);
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('token', res.token);
      await loadUserData();
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await api.register({ name, email, password, phone: '9999999999' });
      // Registration successful, now login
      return await login(email, password);
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setLoading(false);
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setBookings([]);
    setLoyalty(null);
    setError(null);
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      await api.cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, bookings, loyalty, loading, error, login, register, logout, addBooking, cancelBooking, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
