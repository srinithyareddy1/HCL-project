import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Hotel, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} aria-label="Main navigation">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="StayLux Home">
          <div className="logo-icon">
            <Hotel size={20} />
          </div>
          <span className="logo-text">Stay<span className="text-gradient">Lux</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links" role="menubar" aria-label="Site navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Hotels</NavLink>
          <NavLink to="/search?category=Resort" className={({ isActive }) => `nav-link`}>Resorts</NavLink>
          <NavLink to="/search?category=Luxury" className={({ isActive }) => `nav-link`}>Luxury</NavLink>
        </div>

        {/* Desktop Auth */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-menu-wrapper">
              <button className="user-menu-btn" onClick={() => setUserMenuOpen(o => !o)} id="user-menu-toggle" aria-expanded={userMenuOpen} aria-controls="user-dropdown" aria-haspopup="true">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown" id="user-dropdown" role="menu" aria-label="User menu">
                  <div className="dropdown-header">
                    <div className="user-avatar-lg">{user.name.charAt(0)}</div>
                    <div>
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                      <span className={`badge badge-gold`} style={{fontSize:'10px', marginTop:'4px'}}>{user.tier} Member</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)} id="dropdown-dashboard" role="menuitem">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button className="dropdown-item danger" onClick={handleLogout} id="dropdown-logout" role="menuitem">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-btn">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} id="mobile-menu-btn" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu" role="navigation" aria-label="Mobile navigation">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/search" className="mobile-link" onClick={() => setMenuOpen(false)}>Hotels</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="mobile-link danger" onClick={() => { handleLogout(); setMenuOpen(false); }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="mobile-link accent" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
