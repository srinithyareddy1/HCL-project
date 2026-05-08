import { createContext, useContext, useState, useCallback } from 'react';
import { mockUser, mockBookings } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 900));
    if (email && password.length >= 6) {
      setUser(mockUser);
      setBookings(mockBookings);
      setLoading(false);
      return true;
    }
    setError('Invalid email or password. Please try again.');
    setLoading(false);
    return false;
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 1000));
    if (name && email && password.length >= 6) {
      const newUser = { ...mockUser, name, email, loyaltyPoints: 0, tier: 'Silver', memberSince: new Date().toISOString().split('T')[0] };
      setUser(newUser);
      setBookings([]);
      setLoading(false);
      return true;
    }
    setError('Registration failed. Please check your details.');
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setBookings([]);
    setError(null);
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  const cancelBooking = useCallback((bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
  }, []);

  return (
    <AuthContext.Provider value={{ user, bookings, loading, error, login, register, logout, addBooking, cancelBooking, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
