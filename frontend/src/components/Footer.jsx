import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Globe, MessageCircle, Camera, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon"><Hotel size={18} /></div>
              <span style={{fontFamily:'var(--font-serif)', fontWeight:800, fontSize:'1.2rem'}}>
                Stay<span className="text-gradient">Lux</span>
              </span>
            </Link>
            <p className="footer-desc">
              Discover the world's finest hotels and create memories that last a lifetime. Premium stays, exceptional service.
            </p>
            <div className="social-links">
              <a href="#" className="social-btn" aria-label="Website"><Globe size={16}/></a>
              <a href="#" className="social-btn" aria-label="Messages"><MessageCircle size={16}/></a>
              <a href="#" className="social-btn" aria-label="Photos"><Camera size={16}/></a>
              <a href="#" className="social-btn" aria-label="Videos"><Play size={16}/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/search">All Hotels</Link></li>
              <li><Link to="/search?category=Luxury">Luxury Collection</Link></li>
              <li><Link to="/search?category=Resort">Beach Resorts</Link></li>
              <li><Link to="/search?category=Safari">Safari Lodges</Link></li>
              <li><Link to="/search?category=Boutique">Boutique Hotels</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">My Bookings</Link></li>
              <li><a href="#">Loyalty Program</a></li>
              <li><a href="#">Group Bookings</a></li>
              <li><a href="#">Promotions</a></li>
              <li><a href="#">Gift Cards</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li><Mail size={14}/> support@staylux.com</li>
              <li><Phone size={14}/> +1 (800) 789-LUXE</li>
              <li><MapPin size={14}/> 100 Luxury Avenue, NY 10001</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StayLux. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-card);
          border-top: 1px solid var(--border);
          padding: 64px 0 0;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.4fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--text-primary);
          margin-bottom: 16px;
        }
        .footer-desc {
          font-size: 0.9rem; color: var(--text-muted);
          line-height: 1.7; margin-bottom: 24px;
        }
        .social-links { display: flex; gap: 10px; }
        .social-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          transition: var(--transition);
          text-decoration: none;
        }
        .social-btn:hover {
          background: var(--primary-glow);
          border-color: var(--border-active);
          color: var(--primary);
        }
        .footer-heading {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-links a, .footer-links li {
          font-size: 0.9rem; color: var(--text-muted);
          text-decoration: none; transition: var(--transition);
        }
        .footer-links a:hover { color: var(--primary); }
        .footer-contact { display: flex; flex-direction: column; gap: 12px; }
        .footer-contact li {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.88rem; color: var(--text-muted);
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-bottom p { font-size: 0.85rem; color: var(--text-muted); }
        .footer-bottom-links { display: flex; gap: 20px; }
        .footer-bottom-links a { font-size: 0.82rem; color: var(--text-muted); text-decoration: none; }
        .footer-bottom-links a:hover { color: var(--primary); }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
