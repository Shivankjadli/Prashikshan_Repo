import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Building2, Briefcase, ArrowRight,
  UserPlus, Search, Handshake, Trophy,
  Github, Twitter, Linkedin, Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './landing.css';

/* ── Intersection Observer hook for scroll-reveal ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.15 }
    );
    const elements = ref.current?.querySelectorAll('.reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function LandingPage() {
  const pageRef = useReveal();

  return (
    <div ref={pageRef}>
      <Navbar />

      {/* ── Hero ──────────────────────────────────── */}
      <section className="landing-hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-lines" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Academia × Industry Interface Platform
          </div>

          <h1 className="hero-title">
            <span className="hero-title-gradient">
              Bridging the Gap Between Campus & Career
            </span>
          </h1>

          <p className="hero-subtitle">
            Prashikshan connects students, colleges, and industry partners on a single
            intelligent platform — making placements seamless, transparent, and data-driven.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn-primary" id="hero-get-started">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="hero-btn-secondary" id="hero-login">
              Login to Dashboard
            </Link>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <div className="hero-stat-value">10K+</div>
              <div className="hero-stat-label">Students</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Companies</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">150+</div>
              <div className="hero-stat-label">Colleges</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">95%</div>
              <div className="hero-stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section className="landing-section features-section" id="features">
        <div className="section-header reveal">
          <div className="section-overline">Platform Features</div>
          <h2 className="section-title">Three Dashboards, One Ecosystem</h2>
          <p className="section-subtitle">
            Each stakeholder gets a purpose-built dashboard
            designed for their exact workflows.
          </p>
        </div>

        <div className="features-grid">
          {/* Student */}
          <div className="feature-card reveal">
            <div className="feature-icon feature-icon-student">
              <GraduationCap size={26} />
            </div>
            <h3 className="feature-title">Student Dashboard</h3>
            <p className="feature-desc">
              Discover opportunities, build your profile, and track every application
              from submission to offer.
            </p>
            <ul className="feature-list">
              <li><span className="feature-list-check">✓</span> Browse & apply for internships</li>
              <li><span className="feature-list-check">✓</span> Skill assessments & quizzes</li>
              <li><span className="feature-list-check">✓</span> Assignment submissions</li>
              <li><span className="feature-list-check">✓</span> Real-time offer tracking</li>
            </ul>
          </div>

          {/* College */}
          <div className="feature-card reveal">
            <div className="feature-icon feature-icon-college">
              <Building2 size={26} />
            </div>
            <h3 className="feature-title">College Dashboard</h3>
            <p className="feature-desc">
              Oversee student progress, approve job postings, and analyse
              placement performance at a glance.
            </p>
            <ul className="feature-list">
              <li><span className="feature-list-check">✓</span> Student tracking & analytics</li>
              <li><span className="feature-list-check">✓</span> Job & quiz approval workflows</li>
              <li><span className="feature-list-check">✓</span> Placement reports & insights</li>
              <li><span className="feature-list-check">✓</span> Multi-department management</li>
            </ul>
          </div>

          {/* Industry */}
          <div className="feature-card reveal">
            <div className="feature-icon feature-icon-industry">
              <Briefcase size={26} />
            </div>
            <h3 className="feature-title">Industry Dashboard</h3>
            <p className="feature-desc">
              Post opportunities, filter candidates with precision,
              and manage your entire recruitment pipeline.
            </p>
            <ul className="feature-list">
              <li><span className="feature-list-check">✓</span> Job posting management</li>
              <li><span className="feature-list-check">✓</span> Smart candidate filtering</li>
              <li><span className="feature-list-check">✓</span> Quizzes & assignments</li>
              <li><span className="feature-list-check">✓</span> Offer letter generation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="landing-section how-it-works-section" id="how-it-works">
        <div className="section-header reveal">
          <div className="section-overline">How It Works</div>
          <h2 className="section-title">From Registration to Placement</h2>
          <p className="section-subtitle">
            Four simple steps connect talent with opportunity.
          </p>
        </div>

        <div className="steps-container reveal">
          {[
            { num: '01', icon: UserPlus, title: 'Create Your Profile', desc: 'Sign up as a student, college, or recruiter and set up your profile in minutes.' },
            { num: '02', icon: Search, title: 'Discover & Match', desc: 'Browse curated opportunities or find the perfect candidates for your openings.' },
            { num: '03', icon: Handshake, title: 'Apply & Collaborate', desc: 'Submit applications, take assessments, and engage through a streamlined pipeline.' },
            { num: '04', icon: Trophy, title: 'Get Placed', desc: 'Receive offers, track placements, and celebrate career milestones together.' },
          ].map(step => (
            <div className="step-card" key={step.num}>
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Statistics ───────────────────────────── */}
      <section className="landing-section stats-section" id="stats">
        <div className="section-header reveal">
          <div className="section-overline">By The Numbers</div>
          <h2 className="section-title">Growing Every Day</h2>
          <p className="section-subtitle">
            Trusted by top colleges and companies across the country.
          </p>
        </div>

        <div className="stats-grid reveal">
          {[
            { value: '10,000+', label: 'Students Placed' },
            { value: '500+', label: 'Partner Companies' },
            { value: '150+', label: 'Affiliated Colleges' },
            { value: '95%', label: 'Placement Success Rate' },
          ].map(stat => (
            <div className="stat-block" key={stat.label}>
              <div className="stat-block-value">{stat.value}</div>
              <div className="stat-block-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="cta-section reveal">
        <div className="cta-card">
          <h2 className="cta-title">Ready to Transform Your Placement Process?</h2>
          <p className="cta-subtitle">
            Join thousands of students, colleges, and recruiters who trust
            Prashikshan to bridge academia and industry.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="hero-btn-primary" id="cta-get-started">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="hero-btn-secondary" id="cta-login">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div>
            <div className="footer-brand-text">Prashikshan</div>
            <p className="footer-brand-desc">
              An intelligent academia-industry interface platform
              making campus placements seamless and data-driven.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-col-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#stats">Statistics</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-col-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Connect</div>
            <ul className="footer-col-links">
              <li><a href="mailto:hello@prashikshan.com">hello@prashikshan.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Prashikshan. All rights reserved.</span>
          <div className="footer-social">
            <a href="#" className="footer-social-link" aria-label="GitHub"><Github size={16} /></a>
            <a href="#" className="footer-social-link" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a href="#" className="footer-social-link" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
