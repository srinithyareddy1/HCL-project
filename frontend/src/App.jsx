import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelDetail from './pages/HotelDetail';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const AUTH_ROUTES = ['/login', '/register'];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);
  return (
    <div className="page-wrapper">
      {/* WCAG 2.4.1 – Skip to main content */}
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      {!isAuth && <Navbar />}
      <main id="main-content" className="page-content" role="main">
        {children}
      </main>
      {!isAuth && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/book/:roomId" element={<Booking />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={
              <div style={{textAlign:'center',padding:'200px 24px',minHeight:'100vh'}}>
                <div style={{fontSize:'4rem',marginBottom:'16px'}}>🏨</div>
                <h1 style={{marginBottom:'8px'}}>404 – Page Not Found</h1>
                <p style={{color:'var(--text-muted)',marginBottom:'24px'}}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary btn-lg">Go Home</a>
              </div>
            }/>
          </Routes>
        </Layout>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
