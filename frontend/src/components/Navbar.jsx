import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`landing-navbar${scrolled ? ' scrolled' : ''}`} id="landing-navbar">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">P</div>
          <span className="nav-brand-text">Prashikshan</span>
        </Link>

        <ul className="nav-links">
          <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
          <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>Services</a></li>
          <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a></li>
          <li><a href="#stats" onClick={(e) => { e.preventDefault(); scrollTo('stats'); }}>About</a></li>
        </ul>

        <div className="nav-actions">
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/register" className="nav-btn-primary">Get Started</Link>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          id="nav-toggle-btn"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`nav-mobile-overlay${mobileOpen ? ' open' : ''}`}>
        <button className="nav-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
        <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a>
        <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>Services</a>
        <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a>
        <a href="#stats" onClick={(e) => { e.preventDefault(); scrollTo('stats'); }}>About</a>
        <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
        <Link to="/register" className="nav-btn-primary" onClick={() => setMobileOpen(false)} style={{ marginTop: 8 }}>Get Started</Link>
      </div>
    </>
  );
}
