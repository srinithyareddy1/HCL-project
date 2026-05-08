import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Heart } from 'lucide-react';
import { useState } from 'react';

const StarRating = ({ rating, hotelName }) => (
  <div className="stars" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={13} className={i <= Math.round(rating) ? 'star' : 'star star-empty'} fill={i <= Math.round(rating) ? 'var(--primary)' : 'none'} aria-hidden="true" />
    ))}
    <span style={{fontSize:'0.82rem', color:'var(--text-secondary)', marginLeft:'4px'}} aria-hidden="true">{rating}</span>
  </div>
);

const HotelCard = ({ hotel, horizontal = false }) => {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <article className={`hotel-card card ${horizontal ? 'hotel-card--horizontal' : ''}`} aria-label={`${hotel.name} – ${hotel.location}, from $${hotel.pricePerNight} per night`}>
      {/* Image */}
      <div className="hotel-card-img-wrapper">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' : hotel.image}
          alt={`${hotel.name} hotel in ${hotel.location}`}
          className="hotel-card-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="hotel-card-overlay" aria-hidden="true" />
        {/* Category Badge */}
        <span className="hotel-card-category badge badge-gold">{hotel.category}</span>
        {/* Wishlist */}
        <button className={`hotel-card-like ${liked ? 'liked' : ''}`} onClick={() => setLiked(l => !l)} aria-label={liked ? `Remove ${hotel.name} from wishlist` : `Add ${hotel.name} to wishlist`} aria-pressed={liked}>
          <Heart size={16} fill={liked ? '#e05c6a' : 'none'} color={liked ? '#e05c6a' : 'white'} />
        </button>
        {hotel.featured && (
          <span className="hotel-card-featured">✦ Featured</span>
        )}
      </div>

      {/* Body */}
      <div className="hotel-card-body">
        <div className="hotel-card-location">
          <MapPin size={12} />
          <span>{hotel.location}</span>
        </div>
        <h3 className="hotel-card-name">{hotel.name}</h3>
        <StarRating rating={hotel.rating} />
        <p className="hotel-card-reviews">{hotel.reviewCount.toLocaleString()} reviews</p>

        {/* Description - only show in horizontal mode */}
        {horizontal && hotel.description && (
          <p className="hotel-card-desc">{hotel.description}</p>
        )}

        {/* Amenity tags */}
        <div className="hotel-card-tags">
          {hotel.amenities.slice(0, horizontal ? 5 : 3).map(a => (
            <span key={a} className="hotel-tag">{a}</span>
          ))}
          {hotel.amenities.length > (horizontal ? 5 : 3) && (
            <span className="hotel-tag">+{hotel.amenities.length - (horizontal ? 5 : 3)}</span>
          )}
        </div>

        <div className="hotel-card-footer">
          <div className="hotel-card-price">
            <span className="price-amount">${hotel.pricePerNight}</span>
            <span className="price-per"> / night</span>
          </div>
          <Link
            to={`/hotel/${hotel.id}`}
            className="btn btn-primary btn-sm"
            id={`view-hotel-${hotel.id}`}
          >
            View Details
            <span className="sr-only"> for {hotel.name}</span>
          </Link>
        </div>
      </div>

      <style>{`
        .hotel-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          cursor: pointer;
        }
        .hotel-card-img-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .hotel-card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: var(--transition-slow);
        }
        .hotel-card:hover .hotel-card-img { transform: scale(1.06); }
        .hotel-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 50%);
        }
        .hotel-card-category {
          position: absolute; top: 12px; left: 12px;
        }
        .hotel-card-like {
          position: absolute; top: 12px; right: 12px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
          cursor: pointer;
        }
        .hotel-card-like:hover { background: rgba(224,92,106,0.2); border-color: #e05c6a; }
        .hotel-card-like.liked { background: rgba(224,92,106,0.15); border-color: #e05c6a; }
        .hotel-card-featured {
          position: absolute; bottom: 12px; left: 12px;
          font-size: 0.72rem; font-weight: 700;
          color: var(--primary-light);
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .hotel-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .hotel-card-location {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.8rem; color: var(--text-muted);
        }
        .hotel-card-name {
          font-size: 1.05rem; font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .hotel-card-desc {
          font-size: 0.85rem; color: var(--text-muted);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hotel-card-reviews { font-size: 0.78rem; color: var(--text-muted); }
        .hotel-card-tags {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-top: 4px;
        }
        .hotel-tag {
          padding: 3px 8px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .hotel-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .price-amount {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary);
        }
        .price-per { font-size: 0.82rem; color: var(--text-muted); }

        /* ========== HORIZONTAL LAYOUT ========== */
        .hotel-card--horizontal {
          flex-direction: row;
          height: auto;
        }
        .hotel-card--horizontal .hotel-card-img-wrapper {
          width: 280px;
          height: auto;
          min-height: 200px;
          border-radius: var(--radius-lg) 0 0 var(--radius-lg);
        }
        .hotel-card--horizontal .hotel-card-body {
          padding: 20px 24px;
          gap: 8px;
        }
        .hotel-card--horizontal .hotel-card-name {
          font-size: 1.2rem;
        }
        .hotel-card--horizontal .hotel-card-footer {
          border-top: none;
          padding-top: 8px;
        }
        .hotel-card--horizontal .price-amount {
          font-size: 1.5rem;
        }
        @media (max-width: 768px) {
          .hotel-card--horizontal {
            flex-direction: column;
          }
          .hotel-card--horizontal .hotel-card-img-wrapper {
            width: 100%;
            height: 200px;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          }
        }
      `}</style>
    </article>
  );
};

export default HotelCard;
