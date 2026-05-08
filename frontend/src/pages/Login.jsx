import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Hotel } from 'lucide-react';

const Login = () => {
  const { login, loading, error, setError, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = 'Sign In – StayLux';
    if (user) navigate('/dashboard');
    return () => setError(null);
  }, [user, navigate, setError]);

  const validate = () => {
    const e = {};
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    const ok = await login(email, password);
    if (ok) {
      addToast('Welcome back! 👋', 'success');
      navigate('/dashboard');
    }
  };

  const fillDemo = () => { setEmail('alex.johnson@email.com'); setPassword('password123'); setFormErrors({}); };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80" alt="" className="auth-bg-img" />
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-container">
        <div className="auth-card card-glass animate-up">
          {/* Logo */}
          <Link to="/" className="auth-logo">
            <div className="logo-icon"><Hotel size={18}/></div>
            <span style={{fontFamily:'var(--font-serif)',fontWeight:800,fontSize:'1.3rem'}}>Stay<span className="text-gradient">Lux</span></span>
          </Link>

          <h1 style={{fontSize:'1.8rem',fontWeight:700,marginBottom:'6px',marginTop:'20px'}}>Welcome back</h1>
          <p style={{color:'var(--text-muted)',marginBottom:'28px',fontSize:'0.9rem'}}>Sign in to access your bookings and dashboard</p>

          {error && (
            <div className="alert alert-error" style={{marginBottom:'20px'}}>
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group" style={{marginBottom:'16px'}}>
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${formErrors.email?'error':''}`}
                placeholder="john@example.com"
                value={email}
                onChange={e=>{setEmail(e.target.value);setFormErrors(p=>({...p,email:''}));}}
                autoComplete="email"
              />
              {formErrors.email && <span className="form-error">{formErrors.email}</span>}
            </div>

            <div className="form-group" style={{marginBottom:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <a href="#" style={{fontSize:'0.78rem',color:'var(--primary)'}}>Forgot password?</a>
              </div>
              <div style={{position:'relative'}}>
                <input
                  id="login-password"
                  type={showPass?'text':'password'}
                  className={`form-input ${formErrors.password?'error':''}`}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e=>{setPassword(e.target.value);setFormErrors(p=>({...p,password:''}));}}
                  autoComplete="current-password"
                  style={{paddingRight:'44px'}}
                />
                <button type="button" onClick={()=>setShowPass(s=>!s)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',display:'flex'}}>
                  {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
              {formErrors.password && <span className="form-error">{formErrors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="login-submit-btn">
              {loading ? <><div className="spinner" style={{width:'18px',height:'18px',borderWidth:'2px'}}/> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div style={{position:'relative',margin:'20px 0',textAlign:'center'}}>
            <div style={{height:'1px',background:'var(--border)',position:'absolute',top:'50%',left:0,right:0}}/>
            <span style={{background:'var(--bg-card)',padding:'0 12px',position:'relative',fontSize:'0.82rem',color:'var(--text-muted)'}}>or</span>
          </div>

          <button className="btn btn-ghost btn-full" onClick={fillDemo} id="demo-login-btn">
            🎭 Use Demo Account
          </button>

          <p style={{textAlign:'center',marginTop:'24px',fontSize:'0.9rem',color:'var(--text-muted)'}}>
            Don't have an account?{' '}
            <Link to="/register" style={{color:'var(--primary)',fontWeight:600}} id="goto-register">Create one free</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;padding:24px;}
        .auth-bg{position:fixed;inset:0;z-index:-1;}
        .auth-bg-img{width:100%;height:100%;object-fit:cover;}
        .auth-bg-overlay{position:absolute;inset:0;background:rgba(10,10,15,.8);backdrop-filter:blur(2px);}
        .auth-container{width:100%;max-width:440px;z-index:1;}
        .auth-card{padding:40px;border-radius:var(--radius-xl);}
        .auth-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-primary);}
      `}</style>
    </div>
  );
};

export default Login;
