import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Hotel, Check } from 'lucide-react';

const Register = () => {
  const { register, loading, error, setError, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = 'Create Account – StayLux';
    if (user) navigate('/dashboard');
    return () => setError(null);
  }, [user, navigate, setError]);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.agree) e.agree = 'Please agree to the terms';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    const ok = await register(form.name, form.email, form.password);
    if (ok) {
      addToast('Account created! Welcome to StayLux 🎉', 'success');
      navigate('/dashboard');
    }
  };

  const strength = (() => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'var(--error)', 'var(--warning)', 'var(--info)', 'var(--success)'][strength];

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1200&q=80" alt="" className="auth-bg-img"/>
        <div className="auth-bg-overlay"/>
      </div>

      <div className="auth-container" style={{maxWidth:'480px'}}>
        <div className="auth-card card-glass animate-up">
          <Link to="/" className="auth-logo">
            <div className="logo-icon"><Hotel size={18}/></div>
            <span style={{fontFamily:'var(--font-serif)',fontWeight:800,fontSize:'1.3rem'}}>Stay<span className="text-gradient">Lux</span></span>
          </Link>

          <h1 style={{fontSize:'1.8rem',fontWeight:700,marginBottom:'6px',marginTop:'20px'}}>Create account</h1>
          <p style={{color:'var(--text-muted)',marginBottom:'28px',fontSize:'0.9rem'}}>Join StayLux and unlock premium hotel experiences</p>

          {error && (
            <div className="alert alert-error" style={{marginBottom:'20px'}}>
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group" style={{marginBottom:'14px'}}>
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" className={`form-input ${formErrors.name?'error':''}`} placeholder="John Doe" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} autoComplete="name"/>
              {formErrors.name && <span className="form-error">{formErrors.name}</span>}
            </div>

            <div className="form-group" style={{marginBottom:'14px'}}>
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input id="reg-email" type="email" className={`form-input ${formErrors.email?'error':''}`} placeholder="john@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} autoComplete="email"/>
              {formErrors.email && <span className="form-error">{formErrors.email}</span>}
            </div>

            <div className="form-group" style={{marginBottom:'6px'}}>
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{position:'relative'}}>
                <input id="reg-password" type={showPass?'text':'password'} className={`form-input ${formErrors.password?'error':''}`} placeholder="Min. 6 characters" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} style={{paddingRight:'44px'}}/>
                <button type="button" onClick={()=>setShowPass(s=>!s)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',display:'flex'}}>
                  {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
              {formErrors.password && <span className="form-error">{formErrors.password}</span>}
            </div>

            {form.password && (
              <div style={{marginBottom:'14px'}}>
                <div style={{display:'flex',gap:'4px',marginBottom:'4px'}}>
                  {[1,2,3,4].map(i=>(
                    <div key={i} style={{flex:1,height:'3px',borderRadius:'2px',background:i<=strength?strengthColor:'var(--surface-3)',transition:'var(--transition)'}}/>
                  ))}
                </div>
                <span style={{fontSize:'0.75rem',color:strengthColor,fontWeight:600}}>{strengthLabel}</span>
              </div>
            )}

            <div className="form-group" style={{marginBottom:'18px'}}>
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input id="reg-confirm" type="password" className={`form-input ${formErrors.confirm?'error':''}`} placeholder="Repeat your password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))}/>
              {formErrors.confirm && <span className="form-error">{formErrors.confirm}</span>}
            </div>

            <label style={{display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'24px',cursor:'pointer',fontSize:'0.85rem',color:'var(--text-muted)'}}>
              <input id="reg-agree" type="checkbox" checked={form.agree} onChange={e=>setForm(f=>({...f,agree:e.target.checked}))} style={{accentColor:'var(--primary)',marginTop:'2px',flexShrink:0}}/>
              I agree to the <a href="#" style={{color:'var(--primary)'}}>Terms of Service</a> and <a href="#" style={{color:'var(--primary)'}}>Privacy Policy</a>
            </label>
            {formErrors.agree && <span className="form-error" style={{display:'block',marginTop:'-18px',marginBottom:'14px'}}>{formErrors.agree}</span>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="register-submit-btn">
              {loading ? <><div className="spinner" style={{width:'18px',height:'18px',borderWidth:'2px'}}/> Creating account...</> : '✨ Create Free Account'}
            </button>
          </form>

          <div style={{marginTop:'20px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              {['No credit card required','Free cancellation on most bookings','Access to exclusive member deals'].map(b=>(
                <div key={b} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'0.82rem',color:'var(--text-muted)'}}>
                  <Check size={13} color="var(--success)"/> {b}
                </div>
              ))}
            </div>
          </div>

          <p style={{textAlign:'center',marginTop:'24px',fontSize:'0.9rem',color:'var(--text-muted)'}}>
            Already have an account?{' '}
            <Link to="/login" style={{color:'var(--primary)',fontWeight:600}} id="goto-login">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;padding:24px;}
        .auth-bg{position:fixed;inset:0;z-index:-1;}
        .auth-bg-img{width:100%;height:100%;object-fit:cover;}
        .auth-bg-overlay{position:absolute;inset:0;background:rgba(10,10,15,.8);backdrop-filter:blur(2px);}
        .auth-container{width:100%;z-index:1;}
        .auth-card{padding:40px;border-radius:var(--radius-xl);}
        .auth-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-primary);}
      `}</style>
    </div>
  );
};

export default Register;
