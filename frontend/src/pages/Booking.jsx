import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Shield, Tag, Users, Calendar, ChevronRight, AlertCircle } from 'lucide-react';

const Booking = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    checkIn: today,
    checkOut: tomorrow,
    guests: '2',
    specialRequests: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const r = await api.getRoomById(roomId);
        if (r) {
          setRoom(r);
          const h = await api.getHotelById(r.hotelId);
          setHotel(h);
          document.title = `Book ${r.type} – StayLux`;
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [roomId]);

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 1;
    const diff = (new Date(form.checkOut) - new Date(form.checkIn)) / 86400000;
    return diff > 0 ? diff : 1;
  })();

  const subtotal = room ? room.price * nights : 0;
  const taxes = Math.round(subtotal * 0.12);
  const discount = appliedPromo ? appliedPromo.savings : 0;
  const total = subtotal + taxes - discount;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.checkIn) e.checkIn = 'Required';
    if (!form.checkOut) e.checkOut = 'Required';
    if (form.checkOut <= form.checkIn) e.checkOut = 'Must be after check-in';
    return e;
  };

  const applyPromo = async () => {
    setPromoError('');
    try {
      const res = await api.validatePromo(promoCode, subtotal + taxes);
      setAppliedPromo(res);
      addToast(`Promo "${res.code}" applied! You save $${res.savings}`, 'success');
    } catch (err) {
      setPromoError(err.message || 'Invalid promo code.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.bookRoom({
        roomId: room.id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        promoCode: appliedPromo ? appliedPromo.code : null,
      });
      addToast("Booking Confirmed!", "success");

      const mappedBooking = {
        id: res.id,
        guestEmail: form.email,
        hotelImage: hotel.image,
        hotelName: hotel.name,
        location: hotel.location,
        roomType: room.type,
        confirmationNumber: res.id ? `GS-BK-${res.id}` : `GS-BK-${Date.now()}`,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: parseInt(form.guests),
        nights: nights,
        totalAmount: total,
        status: 'confirmed'
      };

      navigate('/confirmation', { state: { booking: mappedBooking } });
    } catch (err) {
      addToast(err.message || "Failed to book room", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!room || !hotel) return (
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'80px'}}>
      <div className="spinner"/>
    </div>
  );

  return (
    <div style={{paddingTop:'80px',paddingBottom:'80px'}}>
      <div className="container" style={{padding:'32px 24px'}}>
        {/* Breadcrumb */}
        <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'28px'}}>
          <Link to={`/hotel/${hotel.id}`} style={{color:'var(--text-muted)'}}>{hotel.name}</Link>
          <ChevronRight size={14}/>
          <span style={{color:'var(--text-primary)'}}>Book {room.type}</span>
        </div>

        <h1 className="serif" style={{fontSize:'2rem',marginBottom:'8px'}}>Complete Your <span className="text-gradient">Booking</span></h1>
        <p style={{color:'var(--text-muted)',marginBottom:'36px'}}>Fill in your details and confirm your reservation.</p>

        {!user && (
          <div className="alert alert-warning" style={{marginBottom:'24px'}}>
            <AlertCircle size={16}/>
            <span>Please <Link to="/login" style={{color:'var(--warning)',fontWeight:700}}>sign in</Link> to complete your booking and access your dashboard.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="booking-layout">
            {/* Left – Form */}
            <div>
              {/* Guest Info */}
              <div className="card" style={{padding:'28px',marginBottom:'20px'}}>
                <h2 style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'20px'}}>👤 Guest Information</h2>
                <div className="grid-2" style={{gap:'16px'}}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input id="book-first-name" className={`form-input ${errors.firstName?'error':''}`} value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} placeholder="John"/>
                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input id="book-last-name" className={`form-input ${errors.lastName?'error':''}`} value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} placeholder="Doe"/>
                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input id="book-email" type="email" className={`form-input ${errors.email?'error':''}`} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="john@email.com"/>
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input id="book-phone" className={`form-input ${errors.phone?'error':''}`} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+1 234 567 8900"/>
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="card" style={{padding:'28px',marginBottom:'20px'}}>
                <h2 style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'20px'}}>📅 Stay Details</h2>
                <div className="grid-3" style={{gap:'16px'}}>
                  <div className="form-group">
                    <label className="form-label">Check-in</label>
                    <input id="book-checkin" type="date" className={`form-input ${errors.checkIn?'error':''}`} min={today} value={form.checkIn} onChange={e=>setForm(f=>({...f,checkIn:e.target.value}))}/>
                    {errors.checkIn && <span className="form-error">{errors.checkIn}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Check-out</label>
                    <input id="book-checkout" type="date" className={`form-input ${errors.checkOut?'error':''}`} min={form.checkIn||today} value={form.checkOut} onChange={e=>setForm(f=>({...f,checkOut:e.target.value}))}/>
                    {errors.checkOut && <span className="form-error">{errors.checkOut}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guests</label>
                    <select id="book-guests" className="form-input" value={form.guests} onChange={e=>setForm(f=>({...f,guests:e.target.value}))}>
                      {[1,2,3,4].map(n=><option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{marginTop:'16px'}}>
                  <label className="form-label">Special Requests (optional)</label>
                  <textarea id="book-requests" className="form-input" rows={3} placeholder="Early check-in, dietary requirements, room preferences..." value={form.specialRequests} onChange={e=>setForm(f=>({...f,specialRequests:e.target.value}))} style={{resize:'vertical'}}/>
                </div>
              </div>

              {/* Promo */}
              <div className="card" style={{padding:'24px',marginBottom:'20px'}}>
                <h2 style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'16px'}}><Tag size={16}/> Promo Code</h2>
                <div style={{display:'flex',gap:'10px'}}>
                  <input id="promo-code-input" className="form-input" placeholder="Enter promo code" value={promoCode} onChange={e=>{setPromoCode(e.target.value);setPromoError('');}}/>
                  <button type="button" className="btn btn-outline" onClick={applyPromo} disabled={!promoCode} id="apply-promo-btn">Apply</button>
                </div>
                {promoError && <p className="form-error" style={{marginTop:'6px'}}>{promoError}</p>}
                {appliedPromo && <p style={{color:'var(--success)',fontSize:'0.85rem',marginTop:'6px'}}>✓ {appliedPromo.title} applied!</p>}
              </div>
            </div>

            {/* Right – Summary */}
            <div>
              <div className="card-glass" style={{padding:'28px',position:'sticky',top:'100px'}}>
                <h2 style={{fontSize:'1.05rem',fontWeight:700,marginBottom:'20px'}}>📋 Booking Summary</h2>

                {/* Room */}
                <div style={{display:'flex',gap:'12px',marginBottom:'20px'}}>
                  <img src={room.image} alt={room.type} style={{width:'80px',height:'60px',objectFit:'cover',borderRadius:'var(--radius-sm)',flexShrink:0}}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:'0.95rem'}}>{room.type}</div>
                    <div style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{hotel.name}</div>
                    <div style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>📍 {hotel.location}</div>
                  </div>
                </div>

                <div style={{display:'flex',gap:'16px',marginBottom:'16px',fontSize:'0.85rem'}}>
                  <span style={{display:'flex',alignItems:'center',gap:'4px',color:'var(--text-secondary)'}}><Calendar size={13}/> {nights} night{nights>1?'s':''}</span>
                  <span style={{display:'flex',alignItems:'center',gap:'4px',color:'var(--text-secondary)'}}><Users size={13}/> {form.guests} guest{parseInt(form.guests)>1?'s':''}</span>
                </div>

                <div className="divider"/>

                {/* Price Breakdown */}
                <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'16px',fontSize:'0.9rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--text-secondary)'}}>${room.price} × {nights} night{nights>1?'s':''}</span>
                    <span>${subtotal}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--text-secondary)'}}>Taxes & Fees (12%)</span>
                    <span>${taxes}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{display:'flex',justifyContent:'space-between',color:'var(--success)'}}>
                      <span>Promo Discount</span>
                      <span>-${discount}</span>
                    </div>
                  )}
                </div>

                <div className="divider-gold"/>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                  <span style={{fontWeight:700,fontSize:'1rem'}}>Total</span>
                  <span style={{fontSize:'1.6rem',fontWeight:800,color:'var(--primary)'}}>${total}</span>
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="confirm-booking-btn">
                  {loading ? <><div className="spinner" style={{width:'18px',height:'18px',borderWidth:'2px'}}/> Processing...</> : '✓ Confirm Booking'}
                </button>

                <div style={{display:'flex',alignItems:'center',gap:'6px',justifyContent:'center',marginTop:'12px',fontSize:'0.78rem',color:'var(--text-muted)'}}>
                  <Shield size={12}/> Secure payment · Free cancellation
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .booking-layout{display:grid;grid-template-columns:1fr 380px;gap:28px;align-items:start;}
        @media(max-width:900px){.booking-layout{grid-template-columns:1fr;}}
      `}</style>
    </div>
  );
};

export default Booking;
