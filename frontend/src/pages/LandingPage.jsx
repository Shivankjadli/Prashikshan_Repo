import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import developerPhoto from '../assets/developer.jpg';
import {
  ArrowRight, UserPlus, Search, Handshake,
  Github, Twitter, Linkedin, Mail,
  BookOpen, ClipboardList, BarChart3, Shield,
  FileText, Gift, Target, Users, Layers, Zap
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
          <div className="hero-text">
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
          </div>

          <div className="hero-visual">
            <div className="hero-visual-circle">
              <div className="hero-visual-inner">
                🎓
              </div>
            </div>
            {/* Floating tags */}
            <div className="hero-float-tag hero-float-tag-1">
              <span className="tag-dot tag-indigo" /> Students
            </div>
            <div className="hero-float-tag hero-float-tag-2">
              <span className="tag-dot tag-purple" /> Internships
            </div>
            <div className="hero-float-tag hero-float-tag-3">
              <span className="tag-dot tag-cyan" /> Placements
            </div>
            <div className="hero-float-tag hero-float-tag-4">
              <span className="tag-dot tag-indigo" /> Colleges
            </div>
            <div className="hero-float-tag hero-float-tag-5">
              <span className="tag-dot tag-purple" /> Industry
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────── */}
      <section style={{ padding: '0 24px', marginTop: '-30px', position: 'relative', zIndex: 2 }}>
        <div className="hero-stats-row" style={{ maxWidth: 900, margin: '0 auto' }}>
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
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section className="landing-section features-section" id="features">
        <div className="section-header reveal">
          <div className="section-overline">Platform Features</div>
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-subtitle">
            Powerful tools designed for every stakeholder in the placement ecosystem.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon feature-icon-indigo">
              <Target size={26} />
            </div>
            <h3 className="feature-title">Internship Tracking</h3>
            <p className="feature-desc">
              Discover, apply, and track internship opportunities from application to offer letter.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon feature-icon-purple">
              <Users size={26} />
            </div>
            <h3 className="feature-title">Mentorship Hub</h3>
            <p className="feature-desc">
              Connect with industry mentors and get guidance for your career growth and skill development.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon feature-icon-cyan">
              <Layers size={26} />
            </div>
            <h3 className="feature-title">Role-based Dashboards</h3>
            <p className="feature-desc">
              Purpose-built dashboards for students, colleges, and recruiters with tailored workflows.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon feature-icon-blue">
              <Zap size={26} />
            </div>
            <h3 className="feature-title">Smart Analytics</h3>
            <p className="feature-desc">
              Track placement metrics, student progress, and hiring trends with real-time analytics.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────── */}
      <section className="landing-section services-section" id="services">
        <div className="section-header reveal">
          <div className="section-overline">What We Provide</div>
          <h2 className="section-title">Everything You Need, In One Place</h2>
          <p className="section-subtitle">
            Comprehensive tools for every step of the placement journey.
          </p>
        </div>

        <div className="services-grid">
          {[
            { icon: BookOpen, title: 'Skill Assessments', desc: 'Curated quizzes to evaluate and improve technical skills.' },
            { icon: ClipboardList, title: 'Assignments', desc: 'Real-world tasks assigned by recruiters to test practical ability.' },
            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track placement metrics, student progress, and hiring trends.' },
            { icon: Shield, title: 'Verified Profiles', desc: 'College-verified student profiles ensure authenticity and trust.' },
            { icon: FileText, title: 'Application Pipeline', desc: 'End-to-end tracking from application to offer acceptance.' },
            { icon: Gift, title: 'Offer Management', desc: 'Seamless offer generation, tracking, and acceptance workflow.' },
          ].map(svc => (
            <div className="service-card reveal" key={svc.title}>
              <div className="service-icon">
                <svc.icon size={24} />
              </div>
              <h3 className="service-title">{svc.title}</h3>
              <p className="service-desc">{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="landing-section how-it-works-section" id="how-it-works">
        <div className="section-header reveal">
          <div className="section-overline">How It Works</div>
          <h2 className="section-title">Get Started in 3 Simple Steps</h2>
          <p className="section-subtitle">
            From registration to placement — it's that easy.
          </p>
        </div>

        <div className="steps-container reveal">
          {[
            { num: '01', icon: UserPlus, title: 'Sign Up', desc: 'Create your account as a student, college, or recruiter in under a minute.' },
            { num: '02', icon: Search, title: 'Build Your Profile', desc: 'Add your skills, experience, and preferences to unlock personalized matches.' },
            { num: '03', icon: Handshake, title: 'Connect & Apply', desc: 'Discover opportunities, take assessments, and land your dream placement.' },
          ].map(step => (
            <div className="step-card" key={step.num}>
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="landing-section testimonials-section" id="testimonials">
        <div className="section-header reveal">
          <div className="section-overline">Testimonials</div>
          <h2 className="section-title">Loved by Students & Recruiters</h2>
          <p className="section-subtitle">
            Hear from people who've transformed their placement experience.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card reveal">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "Prashikshan made my placement journey incredibly smooth. I could track every application
              and received my offer letter within weeks. The dashboard is so intuitive!"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">AK</div>
              <div>
                <div className="testimonial-name">Aarav Kumar</div>
                <div className="testimonial-role">BTech Student, VJTI Mumbai</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card reveal">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "As a recruiter, finding the right candidates was always challenging. With Prashikshan's
              smart filtering and quiz assessments, we hire top talent effortlessly."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">PS</div>
              <div>
                <div className="testimonial-name">Priya Sharma</div>
                <div className="testimonial-role">HR Manager, TechCorp India</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card reveal">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "Managing placements for 500+ students was overwhelming until we started using Prashikshan.
              The analytics and student tracking features are game-changers."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">RD</div>
              <div>
                <div className="testimonial-name">Dr. Rajesh Desai</div>
                <div className="testimonial-role">Placement Officer, MIT Pune</div>
              </div>
            </div>
          </div>
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

      {/* ── Developer Section ─────────────────────── */}
      <section className="landing-section developer-section" id="developer">
        <div className="section-header reveal">
          <div className="section-overline">Behind the Code</div>
          <h2 className="section-title">Meet the Developer</h2>
          <p className="section-subtitle">
            The mind behind Prashikshan — building tools that matter.
          </p>
        </div>

        <div className="developer-card reveal">
          <div className="developer-image-col">
            <div className="developer-image-wrapper">
              <div className="developer-image-accent" />
              <img
                src={developerPhoto}
                alt="Shivank Jadli — Creator of Prashikshan"
                className="developer-photo"
              />
            </div>
          </div>

          <div className="developer-info-col">
            <h3 className="developer-name">Shivank Jadli</h3>
            <p className="developer-title">
              Full Stack Developer & Creator of Prashikshan
            </p>
            <p className="developer-bio">
              Passionate developer focused on building platforms that bridge the
              gap between students, colleges, and industry. Dedicated to creating
              impactful, user-friendly digital solutions.
            </p>

            <div className="developer-socials">
              <a
                href="https://linkedin.com/in/shivankjadli"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/shivankjadli"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-social-link"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="mailto:hello@prashikshan.com"
                className="dev-social-link"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>

            <div className="developer-actions">
              <a
                href="https://linkedin.com/in/shivankjadli"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-btn-primary"
                id="dev-connect-btn"
              >
                Connect <ArrowRight size={16} />
              </a>
              <a
                href="https://github.com/shivankjadli"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-btn-secondary"
                id="dev-project-btn"
              >
                View Project
              </a>
            </div>
          </div>
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
              <li><a href="#services">Services</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
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
