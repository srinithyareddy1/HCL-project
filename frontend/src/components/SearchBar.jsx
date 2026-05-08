import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { api } from '../services/api';

const SearchBar = ({ initialValues = {}, compact = false }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialValues.location || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '');
  const [guests, setGuests] = useState(initialValues.guests || '2');
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.getHotels().then(data => {
      const unique = [...new Set(data.map(h => h.location))].filter(Boolean);
      setLocations(unique.sort());
    }).catch(console.error);
  }, []);

  const validate = () => {
    const errs = {};
    if (!location) errs.location = 'Please select a destination';
    if (!checkIn) errs.checkIn = 'Select check-in date';
    if (!checkOut) errs.checkOut = 'Select check-out date';
    if (checkIn && checkOut && checkOut <= checkIn) errs.checkOut = 'Check-out must be after check-in';
    return errs;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    navigate(`/search?location=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <form onSubmit={handleSearch} className={`search-bar ${compact ? 'compact' : ''}`} noValidate role="search" aria-label="Search hotels">
      {/* Location Dropdown */}
      <div className="search-field" role="group" aria-labelledby="search-location-label">
        <label className="search-label" htmlFor="search-location" id="search-location-label"><MapPin size={13} aria-hidden="true"/> Destination</label>
        <select
          id="search-location"
          className={`search-input ${errors.location ? 'error' : ''}`}
          value={location}
          onChange={e => { setLocation(e.target.value); setErrors(p => ({...p, location: ''})); }}
          aria-invalid={!!errors.location}
          aria-describedby={errors.location ? 'search-location-error' : 'search-location-hint'}
          aria-required="true"
          required
          aria-label="Select hotel destination"
        >
          <option value="" disabled>Select destination...</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <span className="sr-only" id="search-location-hint">Required. Choose a city or destination from the list.</span>
        {errors.location && <span className="search-error" id="search-location-error" role="alert" aria-live="assertive">{errors.location}</span>}
      </div>

      <div className="search-divider" />

      {/* Check-in */}
      <div className="search-field">
        <label className="search-label" htmlFor="search-checkin"><Calendar size={13} aria-hidden="true"/> Check-in</label>
        <input
          id="search-checkin"
          type="date"
          className={`search-input ${errors.checkIn ? 'error' : ''}`}
          min={today}
          value={checkIn}
          onChange={e => { setCheckIn(e.target.value); setErrors(p => ({...p, checkIn: ''})); }}
          aria-invalid={!!errors.checkIn}
          aria-describedby={errors.checkIn ? 'search-checkin-error' : undefined}
        />
        {errors.checkIn && <span className="search-error" id="search-checkin-error" role="alert">{errors.checkIn}</span>}
      </div>

      <div className="search-divider" />

      {/* Check-out */}
      <div className="search-field">
        <label className="search-label" htmlFor="search-checkout"><Calendar size={13} aria-hidden="true"/> Check-out</label>
        <input
          id="search-checkout"
          type="date"
          className={`search-input ${errors.checkOut ? 'error' : ''}`}
          min={checkIn || today}
          value={checkOut}
          onChange={e => { setCheckOut(e.target.value); setErrors(p => ({...p, checkOut: ''})); }}
          aria-invalid={!!errors.checkOut}
          aria-describedby={errors.checkOut ? 'search-checkout-error' : undefined}
        />
        {errors.checkOut && <span className="search-error" id="search-checkout-error" role="alert">{errors.checkOut}</span>}
      </div>

      <div className="search-divider" />

      {/* Guests */}
      <div className="search-field search-field-sm">
        <label className="search-label" htmlFor="search-guests"><Users size={13} aria-hidden="true"/> Guests</label>
        <select
          id="search-guests"
          className="search-input"
          value={guests}
          onChange={e => setGuests(e.target.value)}
        >
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
        </select>
      </div>

      {/* Search Button */}
      <button type="submit" className="search-btn" id="search-submit-btn">
        <Search size={18} />
        {!compact && <span>Search</span>}
      </button>

      <style>{`
        .search-bar {
          display: flex;
          align-items: flex-start;
          background: var(--bg-glass);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 8px;
          gap: 0;
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 860px;
        }
        .search-bar.compact {
          border-radius: var(--radius-lg);
          padding: 6px;
        }
        .search-field {
          display: flex;
          flex-direction: column;
          padding: 10px 16px;
          min-width: 0;
          flex: 1;
          gap: 4px;
        }
        .search-field-sm { flex: 0.5; }
        .search-label {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--text-muted);
        }
        .search-input {
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.92rem;
          font-weight: 500;
          padding: 0;
          font-family: var(--font-sans);
          width: 100%;
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-input::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
          cursor: pointer;
        }
        .search-input.error { color: var(--error); }
        .search-error {
          font-size: 0.72rem;
          color: var(--error);
          font-weight: 600;
        }
        /* Accessible select styling */
        select.search-input {
          cursor: pointer;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a7a96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 20px;
        }
        select.search-input:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.4);
          border-radius: 4px;
        }
        select.search-input option {
          background: #1e1e2e;
          color: #f0ece4;
          padding: 8px 12px;
          font-size: 0.9rem;
        }
        select.search-input option:checked {
          background: #c9a96e;
          color: #1a1000;
        }
        .search-divider {
          width: 1px;
          background: var(--border);
          align-self: stretch;
          margin: 8px 0;
          flex-shrink: 0;
        }
        .search-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          color: #1a1000;
          border: none;
          border-radius: var(--radius-lg);
          padding: 14px 24px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          align-self: center;
          flex-shrink: 0;
          white-space: nowrap;
          margin: 4px;
        }
        .search-btn:hover {
          box-shadow: 0 4px 20px var(--primary-glow);
          transform: scale(1.02);
        }
        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
            border-radius: var(--radius-lg);
          }
          .search-divider { width: 100%; height: 1px; margin: 0; }
          .search-field { flex: none; width: 100%; }
          .search-field-sm { flex: none; width: 100%; }
          .search-btn { width: calc(100% - 8px); justify-content: center; }
        }
      `}</style>
    </form>
  );
};

export default SearchBar;
