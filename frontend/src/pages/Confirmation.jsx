import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Users, MapPin, Hash, Download } from 'lucide-react';

const Confirmation = () => {
  const { state } = useLocation();
  const booking = state?.booking;

  useEffect(() => {
    document.title = 'Booking Confirmed – StayLux';
    window.scrollTo(0, 0);
  }, []);

  if (!booking) return (
    <div style={{textAlign:'center',padding:'160px 24px',paddingTop:'120px'}}>
      <h2>No booking found</h2>
      <Link to="/" className="btn btn-primary" style={{marginTop:'16px'}}>Go Home</Link>
    </div>
  );

  return (
    <div style={{paddingTop:'80px',paddingBottom:'80px',minHeight:'100vh'}}>
      <div className="container" style={{maxWidth:'680px',margin:'0 auto',padding:'48px 24px'}}>
        {/* Success Header */}
        <div className="conf-header animate-up">
          <div className="conf-icon">
            <CheckCircle size={48} color="var(--success)" strokeWidth={1.5}/>
          </div>
          <div className="section-tag" style={{margin:'20px 0 12px'}}>🎉 Booking Confirmed</div>
          <h1 className="serif" style={{fontSize:'2.4rem',marginBottom:'12px'}}>
            You're All <span className="text-gradient">Set!</span>
          </h1>
          <p style={{color:'var(--text-muted)',lineHeight:1.7}}>
            Your reservation has been confirmed. A confirmation email has been sent to <strong style={{color:'var(--text-primary)'}}>{booking.guestEmail}</strong>.
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="card conf-card animate-up" style={{animationDelay:'0.15s'}}>
          {/* Hotel Info */}
          <div className="conf-hotel">
            <img src={booking.hotelImage} alt={booking.hotelName} className="conf-hotel-img"/>
            <div>
              <div className="badge badge-green" style={{marginBottom:'8px'}}>✓ Confirmed</div>
              <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:'4px'}}>{booking.hotelName}</h2>
              <div style={{display:'flex',alignItems:'center',gap:'4px',color:'var(--text-muted)',fontSize:'0.85rem'}}>
                <MapPin size={12}/> {booking.location}
              </div>
              <p style={{color:'var(--text-secondary)',fontSize:'0.9rem',marginTop:'4px'}}>{booking.roomType}</p>
            </div>
          </div>

          <div className="divider-gold"/>

          {/* Booking Details Grid */}
          <div className="conf-details">
            {[
              { icon: <Hash size={15}/>, label: 'Confirmation #', value: booking.confirmationNumber },
              { icon: <Calendar size={15}/>, label: 'Check-in', value: new Date(booking.checkIn).toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'}) },
              { icon: <Calendar size={15}/>, label: 'Check-out', value: new Date(booking.checkOut).toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'}) },
              { icon: <Users size={15}/>, label: 'Guests', value: `${booking.guests} guest${booking.guests>1?'s':''}` },
              { icon: <span>🌙</span>, label: 'Duration', value: `${booking.nights} night${booking.nights>1?'s':''}` },
              { icon: <span>🍽️</span>, label: 'Food', value: booking.foodPreference || 'None' },
              { icon: <span>💳</span>, label: 'Total Paid', value: `$${booking.totalAmount.toLocaleString()}` },
            ].map(item => (
              <div key={item.label} className="conf-detail-item">
                <div style={{display:'flex',alignItems:'center',gap:'6px',color:'var(--text-muted)',fontSize:'0.8rem',marginBottom:'4px'}}>
                  {item.icon} {item.label}
                </div>
                <div style={{fontWeight:700,fontSize:'0.95rem'}}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className="divider"/>

          {/* Total */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--surface-2)',borderRadius:'var(--radius-md)',padding:'16px 20px'}}>
            <span style={{fontWeight:600}}>Total Amount Charged</span>
            <span style={{fontSize:'1.6rem',fontWeight:800,color:'var(--primary)'}}>${booking.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* What's Next */}
        <div className="card animate-up" style={{padding:'24px',marginTop:'20px',animationDelay:'0.3s'}}>
          <h3 style={{fontWeight:700,marginBottom:'16px'}}>What happens next?</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {[
              ['📧','Confirmation Email','Check your inbox for booking details and receipt.'],
              ['🏨','Hotel Contact','The hotel will contact you 24h before arrival.'],
              ['🔑','Check-in Ready','Head straight to reception — your room will be ready.'],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                <span style={{fontSize:'1.3rem',flexShrink:0}}>{icon}</span>
                <div>
                  <div style={{fontWeight:600,fontSize:'0.9rem'}}>{title}</div>
                  <div style={{fontSize:'0.83rem',color:'var(--text-muted)'}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'28px'}} className="animate-up" style={{animationDelay:'0.45s'}}>
          <Link to="/dashboard" className="btn btn-primary btn-lg" style={{flex:1}} id="conf-dashboard-btn">
            View My Bookings
          </Link>
          <Link to="/" className="btn btn-ghost btn-lg" style={{flex:1}} id="conf-home-btn">
            Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        .conf-header{text-align:center;margin-bottom:32px;}
        .conf-icon{width:96px;height:96px;border-radius:50%;background:rgba(76,175,128,.1);border:2px solid rgba(76,175,128,.3);display:flex;align-items:center;justify-content:center;margin:0 auto;}
        .conf-card{overflow:hidden;}
        .conf-hotel{display:flex;gap:16px;align-items:flex-start;padding:24px;}
        .conf-hotel-img{width:100px;height:80px;object-fit:cover;border-radius:var(--radius-sm);flex-shrink:0;}
        .conf-details{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:24px;}
        .conf-detail-item{background:var(--surface-1);border-radius:var(--radius-sm);padding:14px;}
        @media(max-width:480px){.conf-details{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
};

export default Confirmation;
