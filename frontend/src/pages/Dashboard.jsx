import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, MapPin, Hash, LayoutDashboard, Clock, CheckCircle, XCircle, Star, TrendingUp, RefreshCw, X } from 'lucide-react';

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'badge-blue', icon: <Clock size={12}/> },
  completed: { label: 'Completed', color: 'badge-green', icon: <CheckCircle size={12}/> },
  cancelled: { label: 'Cancelled', color: 'badge-red', icon: <XCircle size={12}/> },
};

const Dashboard = () => {
  const { user, bookings, loyalty, cancelBooking, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    document.title = 'My Dashboard – StayLux';
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab);

  const handleCancel = async (id) => {
    const success = await cancelBooking(id);
    setCancelId(null);
    if (success) {
      addToast('Booking cancelled successfully.', 'success');
    } else {
      addToast('Failed to cancel booking.', 'error');
    }
  };

  const loyaltyPoints = loyalty?.points || 0;
  const loyaltyTier = loyalty?.tier || 'Silver';

  const stats = [
    { icon: '🏨', label: 'Total Bookings', value: bookings.length },
    { icon: '✈️', label: 'Upcoming Stays', value: bookings.filter(b => b.status === 'upcoming').length },
    { icon: '✅', label: 'Completed Stays', value: bookings.filter(b => b.status === 'completed').length },
    { icon: '⭐', label: 'Loyalty Points', value: loyaltyPoints.toLocaleString() },
  ];

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Header */}
        <div className="dash-header">
          <div>
            <div className="section-tag" style={{ marginBottom: '10px' }}>
              <LayoutDashboard size={12} /> My Dashboard
            </div>
            <h1 className="serif" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', marginBottom: '6px' }}>
              Welcome back, <span className="text-gradient">{user.name.split(' ')[0]}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Member since {new Date(user.memberSince || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{loyaltyTier} Member</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/search" className="btn btn-outline" id="dash-search-btn">🔍 Find Hotels</Link>
            <button className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }} id="dash-logout-btn">Sign Out</button>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {stats.map(s => (
            <div key={s.label} className="stat-card card">
              <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dash-layout">
          {/* Bookings */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>My Bookings</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['all', 'upcoming', 'completed', 'cancelled'].map(tab => (
                  <button
                    key={tab}
                    className={`cat-btn ${activeTab === tab ? 'active' : ''}`}
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={() => setActiveTab(tab)}
                    id={`tab-${tab}`}
                    aria-pressed={activeTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏨</div>
                <h3 style={{ marginBottom: '8px' }}>No bookings yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Start exploring hotels and book your dream stay.</p>
                <Link to="/search" className="btn btn-primary" id="dash-explore-btn">Explore Hotels</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.map(booking => {
                  const cfg = statusConfig[booking.status] || statusConfig.upcoming;
                  return (
                    <div key={booking.id} className="card booking-card">
                      <img src={booking.hotelImage} alt={booking.hotelName} className="booking-img" />
                      <div className="booking-info">
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{booking.hotelName}</h3>
                              <span className={`badge ${cfg.color}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {cfg.icon} {cfg.label}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{booking.roomType}</p>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={11} /> {booking.location}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>${booking.totalAmount.toLocaleString()}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{booking.nights} nights</div>
                          </div>
                        </div>
                        <div className="booking-dates">
                          <span><Calendar size={12} /> Check-in: <strong>{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                          <span>→</span>
                          <span>Check-out: <strong>{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Hash size={11} /> {booking.confirmationNumber}
                        </div>
                        {booking.status === 'upcoming' && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <Link to={`/hotel/${booking.hotelId}`} className="btn btn-ghost btn-sm" id={`view-hotel-${booking.id}`}>View Hotel</Link>
                            <button className="btn btn-danger btn-sm" onClick={() => setCancelId(booking.id)} id={`cancel-${booking.id}`}>Cancel</button>
                          </div>
                        )}
                        {booking.status === 'completed' && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <Link to={`/hotel/${booking.hotelId}`} className="btn btn-outline btn-sm" id={`rebook-${booking.id}`}>
                              <RefreshCw size={13} /> Rebook
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="dash-sidebar">
            {/* Profile Card */}
            <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary-light),var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: '#1a1000', flexShrink: 0 }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  <span className="badge badge-gold" style={{ marginTop: '4px', fontSize: '10px' }}>{loyaltyTier} Member</span>
                </div>
              </div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Loyalty Points</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{loyaltyPoints.toLocaleString()}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: '3px', overflow: 'hidden' }} role="progressbar" aria-valuenow={loyaltyPoints} aria-valuemin={0} aria-valuemax={5000} aria-label={`Loyalty points: ${loyaltyPoints} of 5000`}>
                  <div style={{ height: '100%', width: `${Math.min((loyaltyPoints / 5000) * 100, 100)}%`, background: 'linear-gradient(90deg,var(--primary-light),var(--primary))', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {5000 - loyaltyPoints} pts to Platinum
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '0.95rem' }}>Quick Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/search" className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'flex-start' }}>🔍 Find New Hotel</Link>
                <Link to="/search?category=Luxury" className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'flex-start' }}>✨ Luxury Collection</Link>
                <button className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'flex-start' }}>📞 Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelId && (
        <div className="modal-overlay" onClick={() => setCancelId(null)} role="presentation">
          <div className="modal-box" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title" aria-describedby="cancel-modal-desc">
            <h3 id="cancel-modal-title" style={{ marginBottom: '12px' }}>Cancel Booking?</h3>
            <p id="cancel-modal-desc" style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-ghost btn-full" onClick={() => setCancelId(null)} id="cancel-modal-no">Keep Booking</button>
              <button className="btn btn-danger btn-full" onClick={() => handleCancel(cancelId)} id="cancel-modal-yes">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dash-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:32px;}
        .dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:36px;}
        .stat-card{padding:24px;display:flex;flex-direction:column;gap:8px;align-items:flex-start;}
        .dash-layout{display:grid;grid-template-columns:1fr 280px;gap:28px;align-items:start;}
        .dash-sidebar{position:sticky;top:100px;}
        .booking-card{display:flex;gap:16px;padding:20px;align-items:flex-start;}
        .booking-img{width:100px;height:80px;object-fit:cover;border-radius:var(--radius-sm);flex-shrink:0;}
        .booking-info{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0;}
        .booking-dates{display:flex;align-items:center;gap:8px;font-size:0.82rem;color:var(--text-muted);flex-wrap:wrap;}
        .cat-btn{padding:8px 20px;border-radius:var(--radius-full);border:1.5px solid var(--border);background:transparent;color:var(--text-secondary);font-size:.88rem;font-weight:600;cursor:pointer;transition:var(--transition);}
        .cat-btn:hover{border-color:var(--border-active);color:var(--text-primary);}
        .cat-btn.active{background:linear-gradient(135deg,var(--primary-light),var(--primary));border-color:transparent;color:#1a1000;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:2000;padding:16px;}
        .modal-box{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:32px;max-width:400px;width:100%;animation:fadeIn .2s ease;}
        @media(max-width:1024px){.dash-layout{grid-template-columns:1fr;}.dash-sidebar{position:static;}}
        @media(max-width:768px){.dash-stats{grid-template-columns:repeat(2,1fr);}.booking-card{flex-direction:column;}.booking-img{width:100%;height:160px;}}
      `}</style>
    </div>
  );
};

export default Dashboard;
