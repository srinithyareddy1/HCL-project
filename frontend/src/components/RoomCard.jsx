import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize2, Wifi, Star, CheckCircle, XCircle } from 'lucide-react';

const RoomCard = ({ room }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`room-card card ${!room.available ? 'unavailable' : ''}`}>
      <div className="room-img-wrapper">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' : room.image}
          alt={room.type}
          className="room-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className={`room-availability ${room.available ? 'avail' : 'unavail'}`}>
          {room.available ? <><CheckCircle size={13}/> Available</> : <><XCircle size={13}/> Booked</>}
        </div>
      </div>

      <div className="room-body">
        <div className="room-header">
          <h3 className="room-type">{room.type}</h3>
          <div className="room-price">
            <span className="price-amount">${room.price}</span>
            <span className="price-per">/night</span>
          </div>
        </div>
        <p className="room-desc">{room.description}</p>

        <div className="room-meta">
          <span><Users size={13}/> {room.capacity} guests</span>
          <span><Maximize2 size={13}/> {room.size} m²</span>
        </div>

        <div className="room-amenities">
          {room.amenities.slice(0, 5).map(a => (
            <span key={a} className="room-amenity">
              <span className="amenity-dot" /> {a}
            </span>
          ))}
        </div>

        {room.available ? (
          <Link
            to={`/book/${room.id}`}
            className="btn btn-primary btn-full"
            id={`book-room-${room.id}`}
          >
            Book Now
          </Link>
        ) : (
          <button className="btn btn-ghost btn-full" disabled style={{opacity:0.5, cursor:'not-allowed'}}>
            Unavailable
          </button>
        )}
      </div>

      <style>{`
        .room-card { display: flex; flex-direction: column; }
        .room-card.unavailable { opacity: 0.7; }
        .room-img-wrapper {
          position: relative; height: 200px; overflow: hidden;
          flex-shrink: 0;
        }
        .room-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: var(--transition-slow);
        }
        .room-card:hover .room-img { transform: scale(1.04); }
        .room-availability {
          position: absolute; bottom: 10px; right: 10px;
          display: flex; align-items: center; gap: 4px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.73rem; font-weight: 600;
        }
        .room-availability.avail {
          background: rgba(76,175,128,0.15);
          border: 1px solid rgba(76,175,128,0.4);
          color: var(--success);
        }
        .room-availability.unavail {
          background: rgba(224,92,106,0.15);
          border: 1px solid rgba(224,92,106,0.4);
          color: var(--error);
        }
        .room-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .room-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .room-type { font-size: 1rem; font-weight: 700; }
        .room-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
        .room-meta {
          display: flex; gap: 16px;
          font-size: 0.82rem; color: var(--text-secondary);
        }
        .room-meta span { display: flex; align-items: center; gap: 4px; }
        .room-amenities { display: flex; flex-direction: column; gap: 4px; }
        .room-amenity {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.82rem; color: var(--text-secondary);
        }
        .amenity-dot {
          width: 5px; height: 5px;
          border-radius: 50%; background: var(--primary);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default RoomCard;
