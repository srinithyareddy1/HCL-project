import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { hotels, promotions } from '../services/mockData';
import { Sparkles, TrendingUp, Shield, Star, Tag, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Luxury', 'Resort', 'Business', 'Safari', 'Boutique'];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleHotels, setVisibleHotels] = useState([]);

  useEffect(() => {
    document.title = 'StayLux – Premium Hotel Booking';
    const filtered = activeCategory === 'All' ? hotels : hotels.filter(h => h.category === activeCategory);
    setVisibleHotels(filtered.slice(0, 6));
  }, [activeCategory]);

  const featuredHotels = hotels.filter(h => h.featured).slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80" alt="Luxury Hotel" className="hero-bg-img" />
          <div className="hero-bg-overlay" />
        </div>
        <div className="hero-content container">
          <div className="hero-text animate-up">
            <div className="section-tag" style={{margin:'0 0 20px'}}>
              <Sparkles size={12}/> Premium Hotel Experiences
            </div>
            <h1 className="hero-title serif">
              Find Your Perfect<br />
              <span className="text-gradient">Luxury Escape</span>
            </h1>
            <p className="hero-subtitle">
              Discover handpicked hotels in 50+ destinations. From iconic city towers to exclusive private islands.
            </p>
          </div>
          <div className="hero-search animate-up" style={{animationDelay:'0.2s', width:'100%'}}>
            <SearchBar />
          </div>
          <div className="hero-stats animate-up" style={{animationDelay:'0.35s'}}>
            {[['500+','Hotels Worldwide'],['50+','Destinations'],['4.9★','Avg Rating'],['98%','Happy Guests']].map(([n,l],i,a) => (
              <div key={l} style={{display:'flex',alignItems:'center',gap:'24px'}}>
                <div className="hero-stat">
                  <span className="stat-num">{n}</span>
                  <span className="stat-label">{l}</span>
                </div>
                {i < a.length-1 && <div className="stat-divider"/>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><Star size={12}/> Handpicked for You</div>
            <h2 className="section-title serif">Featured <span className="text-gradient">Properties</span></h2>
            <p className="section-subtitle">Curated selection of the world's most extraordinary hotels</p>
          </div>
          <div className="featured-grid">
            {featuredHotels.map((hotel, i) => (
              <div key={hotel.id} className={`featured-card ${i===0?'featured-large':''}`}>
                <img src={hotel.image} alt={hotel.name} className="featured-img" loading={i===0?'eager':'lazy'}/>
                <div className="featured-overlay">
                  <div className="featured-info">
                    <span className="badge badge-gold">{hotel.category}</span>
                    <h3 className="featured-name">{hotel.name}</h3>
                    <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.65)'}}>📍 {hotel.location}</p>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div><span className="featured-price">${hotel.pricePerNight}</span><span style={{color:'rgba(255,255,255,0.6)',fontSize:'0.82rem'}}>/night</span></div>
                      <Link to={`/hotel/${hotel.id}`} className="btn btn-primary btn-sm" id={`featured-${hotel.id}`}>Explore</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse */}
      <section className="section" style={{paddingTop:0}}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><TrendingUp size={12}/> Browse Collection</div>
            <h2 className="section-title serif">Explore <span className="text-gradient">Hotels</span></h2>
          </div>
          <div className="category-filter">
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-btn ${activeCategory===c?'active':''}`} onClick={() => setActiveCategory(c)} id={`cat-${c.toLowerCase()}`}>{c}</button>
            ))}
          </div>
          <div className="grid-3" style={{marginTop:'32px'}}>
            {visibleHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel}/>)}
          </div>
          <div style={{textAlign:'center',marginTop:'40px'}}>
            <Link to="/search" className="btn btn-outline btn-lg" id="view-all-btn">View All Hotels <ChevronRight size={16}/></Link>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="section" style={{background:'var(--bg-card)'}}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><Tag size={12}/> Limited Time</div>
            <h2 className="section-title serif">Exclusive <span className="text-gradient">Deals</span></h2>
          </div>
          <div className="grid-2">
            {promotions.slice(0,4).map(promo => (
              <div key={promo.id} className="promo-card card">
                <div className="promo-discount">{promo.type==='percentage'?`-${promo.discount}%`:`-$${promo.discount}`}</div>
                <div style={{flex:1}}>
                  <h3 style={{fontWeight:700,marginBottom:'6px'}}>{promo.title}</h3>
                  <p style={{fontSize:'0.87rem',color:'var(--text-muted)',marginBottom:'14px',lineHeight:1.5}}>{promo.description}</p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span className="promo-code"><Tag size={12}/> <code>{promo.code}</code></span>
                    <Link to="/search" className="btn btn-outline btn-sm">Use Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><Shield size={12}/> Why StayLux</div>
            <h2 className="section-title serif">The <span className="text-gradient">StayLux</span> Promise</h2>
          </div>
          <div className="grid-4">
            {[
              {icon:'🏆',title:'Handpicked Hotels',desc:'Every property vetted for quality, comfort, and exceptional service.'},
              {icon:'💳',title:'Best Price Guarantee',desc:"Find a lower price? We'll match it. No questions asked."},
              {icon:'🔒',title:'Secure Booking',desc:'Payments protected with bank-grade encryption.'},
              {icon:'🎧',title:'24/7 Concierge',desc:'Our luxury travel experts are available around the clock.'},
            ].map(item => (
              <div key={item.title} className="why-card card">
                <span style={{fontSize:'2rem'}}>{item.icon}</span>
                <h3 style={{fontSize:'1rem',fontWeight:700}}>{item.title}</h3>
                <p style={{fontSize:'0.87rem',color:'var(--text-muted)',lineHeight:1.6}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-card">
            <div style={{maxWidth:'520px',position:'relative',zIndex:1}}>
              <h2 className="serif" style={{fontSize:'2.2rem',marginBottom:'12px'}}>Start Your Luxury Journey Today</h2>
              <p style={{color:'var(--text-secondary)',marginBottom:'28px',lineHeight:1.7}}>Join over 100,000 travelers who trust StayLux for their premium hotel bookings.</p>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">Create Free Account</Link>
                <Link to="/search" className="btn btn-outline btn-lg" id="cta-explore-btn">Explore Hotels</Link>
              </div>
            </div>
            <div className="cta-circles">
              <div className="cta-c1"/><div className="cta-c2"/>
              <div style={{fontSize:'4rem',color:'var(--primary)',opacity:0.2}}>✦</div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero{min-height:100vh;display:flex;align-items:center;position:relative;padding:120px 0 80px;}
        .hero-bg{position:absolute;inset:0;overflow:hidden;}
        .hero-bg-img{width:100%;height:100%;object-fit:cover;}
        .hero-bg-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,10,15,.92) 0%,rgba(10,10,15,.6) 60%,rgba(10,10,15,.85) 100%);}
        .hero-content{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:36px;width:100%;}
        .hero-text{max-width:640px;}
        .hero-title{font-size:clamp(2.8rem,6vw,5rem);line-height:1.08;margin-bottom:20px;}
        .hero-subtitle{font-size:1.1rem;color:var(--text-secondary);max-width:500px;line-height:1.7;}
        .hero-stats{display:flex;align-items:center;gap:0;flex-wrap:wrap;}
        .hero-stat{text-align:center;}
        .stat-num{display:block;font-size:1.5rem;font-weight:800;color:var(--primary);}
        .stat-label{font-size:0.78rem;color:var(--text-muted);}
        .stat-divider{width:1px;height:36px;background:var(--border);margin:0 24px;}
        .featured-grid{display:grid;grid-template-columns:1.5fr 1fr;grid-template-rows:320px 320px;gap:16px;}
        .featured-card{position:relative;border-radius:var(--radius-lg);overflow:hidden;cursor:pointer;}
        .featured-large{grid-row:1/3;}
        .featured-img{width:100%;height:100%;object-fit:cover;transition:var(--transition-slow);}
        .featured-card:hover .featured-img{transform:scale(1.05);}
        .featured-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,15,.9) 0%,transparent 60%);display:flex;align-items:flex-end;padding:24px;}
        .featured-info{width:100%;display:flex;flex-direction:column;gap:8px;}
        .featured-name{font-size:1.2rem;font-weight:700;color:white;font-family:var(--font-serif);}
        .featured-price{font-size:1.4rem;font-weight:800;color:var(--primary);}
        .category-filter{display:flex;gap:8px;flex-wrap:wrap;}
        .cat-btn{padding:8px 20px;border-radius:var(--radius-full);border:1.5px solid var(--border);background:transparent;color:var(--text-secondary);font-size:.88rem;font-weight:600;cursor:pointer;transition:var(--transition);}
        .cat-btn:hover{border-color:var(--border-active);color:var(--text-primary);background:var(--primary-glow);}
        .cat-btn.active{background:linear-gradient(135deg,var(--primary-light),var(--primary));border-color:transparent;color:#1a1000;}
        .promo-card{display:flex;gap:20px;padding:24px;align-items:flex-start;}
        .promo-discount{background:linear-gradient(135deg,var(--primary-light),var(--primary));color:#1a1000;font-size:1.1rem;font-weight:900;padding:12px 16px;border-radius:var(--radius-md);flex-shrink:0;text-align:center;min-width:72px;}
        .promo-code{display:flex;align-items:center;gap:6px;background:var(--surface-2);border:1px dashed var(--border-active);border-radius:var(--radius-sm);padding:6px 10px;font-size:.85rem;color:var(--primary);}
        .why-card{padding:28px;display:flex;flex-direction:column;gap:12px;}
        .cta-card{background:linear-gradient(135deg,var(--surface-2) 0%,var(--surface-1) 100%);border:1px solid var(--border);border-radius:var(--radius-xl);padding:64px;display:flex;align-items:center;justify-content:space-between;gap:40px;position:relative;overflow:hidden;}
        .cta-circles{position:relative;flex-shrink:0;}
        .cta-c1{position:absolute;width:200px;height:200px;border-radius:50%;border:1px solid var(--border-active);opacity:.4;top:-100px;right:-100px;}
        .cta-c2{position:absolute;width:120px;height:120px;border-radius:50%;border:1px solid var(--border-active);opacity:.4;top:-40px;right:-40px;}
        @media(max-width:900px){
          .featured-grid{grid-template-columns:1fr;grid-template-rows:auto;}
          .featured-large{grid-row:auto;}
          .featured-card{height:250px;}
          .cta-card{padding:36px 24px;flex-direction:column;}
          .cta-circles{display:none;}
        }
      `}</style>
    </div>
  );
};

export default Home;
