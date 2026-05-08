import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import RoomCard from '../components/RoomCard';
import { MapPin, Star, Users, Wifi, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const StarRow = ({ rating, count }) => (
  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
    {[1,2,3,4,5].map(i=>(
      <Star key={i} size={16} fill={i<=Math.round(rating)?'var(--primary)':'none'} color={i<=Math.round(rating)?'var(--primary)':'var(--surface-3)'}/>
    ))}
    <span style={{fontWeight:700,color:'var(--primary)'}}>{rating}</span>
    <span style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>({count?.toLocaleString()} reviews)</span>
  </div>
);

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getHotelById(id),
      api.getRoomsByHotel(id)
    ])
      .then(([h, r]) => {
        setHotel(h);
        setHotelRooms(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (hotel) document.title = `${hotel.name} – StayLux`;
  }, [hotel]);

  if (loading) return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'80px'}}><div className="spinner"/></div>;
  if (!hotel) return (
    <div style={{textAlign:'center',padding:'160px 24px',paddingTop:'120px'}}>
      <div style={{fontSize:'3rem'}}>🏨</div>
      <h2 style={{margin:'16px 0 8px'}}>Hotel Not Found</h2>
      <Link to="/search" className="btn btn-primary" style={{marginTop:'16px'}}>Browse Hotels</Link>
    </div>
  );

  const images = hotel.images || [hotel.image];

  return (
    <div style={{paddingTop:'80px'}}>
      {/* Breadcrumb */}
      <div className="container" style={{padding:'20px 24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.85rem',color:'var(--text-muted)'}}>
          <Link to="/" style={{color:'var(--text-muted)'}}>Home</Link>
          <ChevronRight size={14}/>
          <Link to="/search" style={{color:'var(--text-muted)'}}>Hotels</Link>
          <ChevronRight size={14}/>
          <span style={{color:'var(--text-primary)'}}>{hotel.name}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container" style={{padding:'0 24px 32px'}}>
        <div className="gallery">
          <div className="gallery-main">
            <img src={images[imgIdx]} alt={hotel.name} className="gallery-img" key={imgIdx}/>
            {images.length > 1 && (
              <>
                <button className="gallery-btn gallery-prev" onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)} id="gallery-prev">
                  <ChevronLeft size={20}/>
                </button>
                <button className="gallery-btn gallery-next" onClick={()=>setImgIdx(i=>(i+1)%images.length)} id="gallery-next">
                  <ChevronRight size={20}/>
                </button>
                <div className="gallery-dots">
                  {images.map((_,i)=>(
                    <button key={i} className={`gallery-dot ${i===imgIdx?'active':''}`} onClick={()=>setImgIdx(i)}/>
                  ))}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img,i)=>(
                <img key={i} src={img} alt="" className={`gallery-thumb ${i===imgIdx?'active':''}`} onClick={()=>setImgIdx(i)} loading="lazy"/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hotel Info */}
      <div className="container" style={{padding:'0 24px'}}>
        <div className="hotel-detail-layout">
          {/* Main Content */}
          <div className="hotel-detail-main">
            <div style={{display:'flex',flexWrap:'wrap',gap:'10px',marginBottom:'12px'}}>
              <span className="badge badge-gold">{hotel.category}</span>
              {hotel.tags?.map(t=><span key={t} className="badge badge-gray">{t}</span>)}
            </div>
            <h1 className="serif" style={{fontSize:'clamp(1.8rem,4vw,2.8rem)',marginBottom:'10px'}}>{hotel.name}</h1>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px',color:'var(--text-muted)',fontSize:'0.9rem'}}>
              <MapPin size={14}/> {hotel.location}
            </div>
            <StarRow rating={hotel.rating} count={hotel.reviewCount}/>

            <div className="divider-gold" style={{margin:'24px 0'}}/>

            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'12px'}}>About This Property</h2>
            <p style={{color:'var(--text-secondary)',lineHeight:1.8,fontSize:'0.95rem'}}>{hotel.longDescription}</p>

            <div className="divider" style={{margin:'28px 0'}}/>

            {/* Amenities */}
            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'16px'}}>Amenities</h2>
            <div className="amenities-grid">
              {hotel.amenities.map(a=>(
                <div key={a} className="amenity-item">
                  <Check size={14} color="var(--primary)"/>
                  <span>{a}</span>
                </div>
              ))}
            </div>

            <div className="divider" style={{margin:'28px 0'}}/>

            {/* Rooms */}
            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'20px'}}>
              Available Rooms <span style={{color:'var(--text-muted)',fontWeight:400,fontSize:'0.9rem'}}>({hotelRooms.length} options)</span>
            </h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px'}}>
              {hotelRooms.map(room=><RoomCard key={room.id} room={room}/>)}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="hotel-detail-sidebar">
            <div className="card-glass hotel-price-card">
              <div style={{marginBottom:'8px'}}>
                <span style={{fontSize:'0.78rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em'}}>Starting from</span>
              </div>
              <div style={{marginBottom:'16px'}}>
                <span style={{fontSize:'2.2rem',fontWeight:800,color:'var(--primary)'}}>${hotel.pricePerNight}</span>
                <span style={{color:'var(--text-muted)',fontSize:'0.9rem'}}> / night</span>
              </div>
              <StarRow rating={hotel.rating} count={hotel.reviewCount}/>
              <div className="divider"/>
              <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'16px'}}>Select a room below to proceed with your booking.</p>
              <a href="#rooms" className="btn btn-primary btn-full" id="choose-room-btn">Choose a Room</a>
              <div style={{display:'flex',alignItems:'center',gap:'6px',justifyContent:'center',marginTop:'12px',fontSize:'0.78rem',color:'var(--text-muted)'}}>
                🔒 Free cancellation available
              </div>
            </div>

            <div className="card hotel-info-card" style={{marginTop:'16px',padding:'20px'}}>
              <h4 style={{fontWeight:700,marginBottom:'14px',fontSize:'0.95rem'}}>Hotel Highlights</h4>
              {[['📍','Location',hotel.location],['⭐','Rating',`${hotel.rating} / 5.0`],['🛏️','Room Types',`${hotelRooms.length} available`],['👥','Best For',hotel.tags?.[0]||hotel.category]].map(([icon,label,val])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)',fontSize:'0.85rem'}}>
                  <span style={{color:'var(--text-muted)'}}>{icon} {label}</span>
                  <span style={{fontWeight:600}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="rooms" style={{paddingBottom:'80px'}}/>

      <style>{`
        .gallery{display:grid;grid-template-columns:1fr 120px;gap:12px;height:460px;}
        .gallery-main{position:relative;border-radius:var(--radius-lg);overflow:hidden;height:100%;}
        .gallery-img{width:100%;height:100%;object-fit:cover;animation:fadeIn .3s ease;}
        .gallery-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.6);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2);border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;transition:var(--transition);}
        .gallery-btn:hover{background:rgba(0,0,0,.85);}
        .gallery-prev{left:16px;}
        .gallery-next{right:16px;}
        .gallery-dots{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:6px;}
        .gallery-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.5);border:none;cursor:pointer;transition:var(--transition);}
        .gallery-dot.active{background:var(--primary);width:20px;border-radius:4px;}
        .gallery-thumbs{display:flex;flex-direction:column;gap:8px;overflow-y:auto;}
        .gallery-thumb{height:calc(25% - 6px);min-height:80px;width:120px;object-fit:cover;border-radius:var(--radius-sm);cursor:pointer;border:2px solid transparent;transition:var(--transition);opacity:.7;}
        .gallery-thumb.active,.gallery-thumb:hover{opacity:1;border-color:var(--primary);}
        .hotel-detail-layout{display:grid;grid-template-columns:1fr 320px;gap:40px;align-items:start;padding-bottom:80px;}
        .hotel-detail-sidebar{position:sticky;top:100px;}
        .hotel-price-card{padding:28px;}
        .amenities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;}
        .amenity-item{display:flex;align-items:center;gap:8px;font-size:.88rem;color:var(--text-secondary);}
        @media(max-width:900px){
          .hotel-detail-layout{grid-template-columns:1fr;}
          .hotel-detail-sidebar{position:static;}
          .gallery{grid-template-columns:1fr;height:300px;}
          .gallery-thumbs{display:none;}
        }
      `}</style>
    </div>
  );
};

export default HotelDetail;
