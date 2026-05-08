import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import { api } from '../services/api';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

const AMENITY_OPTIONS = ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar','Parking','Airport Shuttle'];
const PRICE_RANGES = [{label:'Any',min:0,max:9999},{label:'Under $200',min:0,max:200},{label:'$200–$400',min:200,max:400},{label:'$400–$700',min:400,max:700},{label:'$700+',min:700,max:9999}];
const PER_PAGE = 5;

const SearchResults = () => {
  const [params] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({min:0,max:9999});
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);

  const location = params.get('location') || '';
  const checkIn = params.get('checkIn') || '';
  const checkOut = params.get('checkOut') || '';
  const guests = params.get('guests') || '2';
  const category = params.get('category') || '';

  useEffect(() => {
    document.title = `Hotels${location ? ' in ' + location : ''} – StayLux`;
    setLoading(true);

    api.searchHotels({ location })
      .then(data => {
        let found = data;
        if (category) found = found.filter(h => h.category === category);
        if (priceRange.max !== 9999) {
          found = found.filter(h => h.pricePerNight >= priceRange.min && h.pricePerNight <= priceRange.max);
        }
        if (selectedAmenities.length > 0) {
          found = found.filter(h => selectedAmenities.every(a => h.amenities.includes(a)));
        }

        if (sortBy === 'price-asc') found = [...found].sort((a,b) => a.pricePerNight - b.pricePerNight);
        else if (sortBy === 'price-desc') found = [...found].sort((a,b) => b.pricePerNight - a.pricePerNight);
        else if (sortBy === 'rating') found = [...found].sort((a,b) => b.rating - a.rating);
        
        setResults(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location, checkIn, checkOut, guests, category, priceRange, selectedAmenities, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [location, category, priceRange, selectedAmenities, sortBy]);

  const toggleAmenity = (a) => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev,a]);
  const clearFilters = () => { setPriceRange({min:0,max:9999}); setSelectedAmenities([]); };
  const hasFilters = priceRange.max !== 9999 || selectedAmenities.length > 0;

  const totalPages = Math.ceil(results.length / PER_PAGE);
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paged = results.slice(startIdx, startIdx + PER_PAGE);

  const goToPage = (p) => { setCurrentPage(p); window.scrollTo({ top: 280, behavior: 'smooth' }); };

  return (
    <div className="search-page" style={{paddingTop:'80px'}}>
      <div className="search-top-bar">
        <div className="container">
          <SearchBar initialValues={{location,checkIn,checkOut,guests}} compact />
        </div>
      </div>

      <div className="container" style={{padding:'32px 24px'}}>
        <div className="results-header">
          <div>
            <h1 style={{fontSize:'1.5rem',fontWeight:700}}>
              {loading ? 'Searching...' : `${results.length} hotel${results.length!==1?'s':''} found`}
              {location && <span style={{color:'var(--primary)'}}> in {location}</span>}
            </h1>
            {checkIn && checkOut && (
              <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginTop:'4px'}}>
                {checkIn} → {checkOut} · {guests} guest{parseInt(guests)>1?'s':''}
              </p>
            )}
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <label htmlFor="sort-select" className="sr-only">Sort results</label>
            <select className="form-input" style={{width:'auto',fontSize:'0.85rem'}} value={sortBy} onChange={e=>setSortBy(e.target.value)} id="sort-select" aria-label="Sort hotels by">
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button className={`btn btn-ghost btn-sm ${showFilters?'btn-outline':''}`} onClick={()=>setShowFilters(f=>!f)} id="filter-toggle-btn" aria-expanded={showFilters} aria-controls="filter-sidebar">
              <SlidersHorizontal size={15}/> Filters {hasFilters && <span className="badge badge-gold" style={{padding:'2px 6px',fontSize:'10px'}}>!</span>}
            </button>
          </div>
        </div>

        <div className="search-layout">
          {showFilters && (
            <aside className="filter-sidebar card animate-slide" id="filter-sidebar" aria-label="Search filters">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                <h3 style={{fontWeight:700}}>Filters</h3>
                {hasFilters && <button className="btn btn-ghost btn-sm" onClick={clearFilters}><X size={13}/> Clear</button>}
              </div>
              <fieldset className="filter-group" style={{border:'none',padding:0,margin:0}}>
                <legend className="filter-label">Price Range</legend>
                {PRICE_RANGES.map(p => (
                  <label key={p.label} className="filter-option">
                    <input type="radio" name="price" checked={priceRange.min===p.min && priceRange.max===p.max} onChange={()=>setPriceRange({min:p.min,max:p.max})}/>
                    <span>{p.label}</span>
                  </label>
                ))}
              </fieldset>
              <div className="divider" />
              <fieldset className="filter-group" style={{border:'none',padding:0,margin:0}}>
                <legend className="filter-label">Amenities</legend>
                {AMENITY_OPTIONS.map(a => (
                  <label key={a} className="filter-option">
                    <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={()=>toggleAmenity(a)}/>
                    <span>{a}</span>
                  </label>
                ))}
              </fieldset>
            </aside>
          )}

          {/* Results */}
          <div>
            <div className="results-grid" aria-label="Hotel search results">
              {loading ? (
                <div style={{gridColumn:'1/-1',display:'flex',justifyContent:'center',padding:'80px 0'}}>
                  <div className="spinner" role="status" aria-label="Loading"/>
                </div>
              ) : paged.length === 0 ? (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'80px 0'}}>
                  <div style={{fontSize:'3rem',marginBottom:'16px'}} aria-hidden="true">🔍</div>
                  <h3 style={{marginBottom:'8px'}}>No hotels found</h3>
                  <p style={{color:'var(--text-muted)'}}>Try adjusting your search or filters.</p>
                  <button className="btn btn-outline" style={{marginTop:'20px'}} onClick={clearFilters}>Clear Filters</button>
                </div>
              ) : (
                paged.map(hotel => <HotelCard key={hotel.id} hotel={hotel}/>)
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <nav className="pagination" aria-label="Search results pagination">
                <div className="pagination-info">
                  Showing <strong>{startIdx+1}–{Math.min(startIdx+PER_PAGE, results.length)}</strong> of <strong>{results.length}</strong> hotels
                </div>
                <div className="pagination-controls">
                  <button className="pg-btn" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} aria-label="Previous page" id="page-prev">
                    <ChevronLeft size={16}/>
                  </button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
                    <button key={p} className={`pg-btn ${currentPage===p?'active':''}`} onClick={()=>goToPage(p)} aria-label={`Page ${p}`} aria-current={currentPage===p?'page':undefined} id={`page-${p}`}>
                      {p}
                    </button>
                  ))}
                  <button className="pg-btn" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} aria-label="Next page" id="page-next">
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .search-top-bar{background:var(--bg-card);border-bottom:1px solid var(--border);padding:16px 0;}
        .results-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:28px;}
        .search-layout{display:grid;grid-template-columns:260px 1fr;gap:24px;align-items:start;}
        .filter-sidebar{padding:24px;position:sticky;top:100px;}
        .filter-group{display:flex;flex-direction:column;gap:10px;margin-bottom:4px;}
        .filter-label{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-secondary);margin-bottom:4px;}
        .filter-option{display:flex;align-items:center;gap:10px;font-size:0.88rem;color:var(--text-secondary);cursor:pointer;}
        .filter-option input{accent-color:var(--primary);}
        .filter-option:hover{color:var(--text-primary);}
        .results-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:20px;}

        /* Pagination */
        .pagination{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-top:28px;padding-top:20px;border-top:1px solid var(--border);}
        .pagination-info{font-size:.85rem;color:var(--text-muted);}
        .pagination-info strong{color:var(--text-primary);font-weight:700;}
        .pagination-controls{display:flex;align-items:center;gap:6px;}
        .pg-btn{
          display:flex;align-items:center;justify-content:center;
          min-width:38px;height:38px;padding:0 10px;
          border-radius:var(--radius-md);
          background:var(--surface-1);border:1px solid var(--border);
          color:var(--text-secondary);font-size:.85rem;font-weight:600;
          cursor:pointer;transition:var(--transition);
        }
        .pg-btn:hover:not(:disabled):not(.active){border-color:var(--border-active);color:var(--text-primary);background:var(--surface-2);}
        .pg-btn:focus-visible{outline:2px solid var(--primary);outline-offset:2px;box-shadow:var(--focus-ring);}
        .pg-btn.active{background:linear-gradient(135deg,var(--primary-light),var(--primary));border-color:transparent;color:#1a1000;font-weight:800;box-shadow:0 4px 16px var(--primary-glow);}
        .pg-btn:disabled{opacity:.35;cursor:not-allowed;}

        @media(max-width:900px){
          .search-layout{grid-template-columns:1fr;}
        }
        @media(max-width:600px){
          .pagination{flex-direction:column;align-items:center;}
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
