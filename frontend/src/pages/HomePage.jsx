import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Gravity, MatterBody } from '../components/ui/Gravity';
import './HomePage.css';
import '../components/ui/Gravity.css';

const HomePage = () => {
  const { t } = useLanguage();

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section — Illuminated + Gravity */}
      <section className="hero-section">
        {/* Illuminated text area */}
        <div className="hero-illuminated">
          <div className="hero-bg-blobs">
            <div className="hero-bg-blob-top" />
            <div className="hero-bg-blob-bottom" />
          </div>

          <div className="hero-text-block" aria-hidden="true">
            <span
              className="hero-glow-text"
              data-text="Hornbill Sentinel"
            >
              Hornbill Sentinel
            </span>
            <br />
            <div className="hero-intro">Transforming Cybersecurity Awareness</div>
            <div className="hero-intro">Through Personalized Profiling</div>
          </div>

          <p className="hero-subtitle">
            Discover your unique digital behaviour type through our AI-powered assessment.
            Get{' '}
            <span className="highlight">personalized security recommendations</span>{' '}
            tailored to your habits and risk profile.
          </p>

          <div className="hero-cta-wrapper">
            <Link to="/assessment-start" className="start-assessment-btn">{t('btn_start_assessment')}</Link>
          </div>

          {/* SVG glow filter */}
          <svg className="hero-glow-svg" width="1440" height="300" viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow-4" colorInterpolationFilters="sRGB" x="-50%" y="-200%" width="200%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur4" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="19" result="blur19" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur9" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30" />
                <feColorMatrix in="blur4" result="color-0-blur" type="matrix" values="1 0 0 0 0  0 0.98 0 0 0  0 0 0.96 0 0  0 0 0 0.8 0" />
                <feOffset in="color-0-blur" result="layer-0-offsetted" dx="0" dy="0" />
                <feColorMatrix in="blur19" result="color-1-blur" type="matrix" values="0.482 0 0 0 0  0 0.576 0 0 0  0 0 1 0 0  0 0 0 1 0" />
                <feOffset in="color-1-blur" result="layer-1-offsetted" dx="0" dy="2" />
                <feColorMatrix in="blur9" result="color-2-blur" type="matrix" values="0.6 0 0 0 0  0 0.7 0 0 0  0 0 1 0 0  0 0 0 0.65 0" />
                <feOffset in="color-2-blur" result="layer-2-offsetted" dx="0" dy="2" />
                <feColorMatrix in="blur30" result="color-3-blur" type="matrix" values="0.788 0 0 0 0  0 0.690 0 0 0  0 0 0.549 0 0  0 0 0 1 0" />
                <feOffset in="color-3-blur" result="layer-3-offsetted" dx="0" dy="2" />
                <feColorMatrix in="blur30" result="color-4-blur" type="matrix" values="0.3 0 0 0 0  0 0.36 0 0 0  0 0 0.6 0 0  0 0 0 1 0" />
                <feOffset in="color-4-blur" result="layer-4-offsetted" dx="0" dy="16" />
                <feColorMatrix in="blur30" result="color-5-blur" type="matrix" values="0.2 0 0 0 0  0 0.25 0 0 0  0 0 0.5 0 0  0 0 0 1 0" />
                <feOffset in="color-5-blur" result="layer-5-offsetted" dx="0" dy="64" />
                <feColorMatrix in="blur30" result="color-6-blur" type="matrix" values="0.1 0 0 0 0  0 0.15 0 0 0  0 0 0.3 0 0  0 0 0 1 0" />
                <feOffset in="color-6-blur" result="layer-6-offsetted" dx="0" dy="64" />
                <feColorMatrix in="blur30" result="color-7-blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.68 0" />
                <feOffset in="color-7-blur" result="layer-7-offsetted" dx="0" dy="64" />
                <feMerge>
                  <feMergeNode in="layer-0-offsetted" />
                  <feMergeNode in="layer-1-offsetted" />
                  <feMergeNode in="layer-2-offsetted" />
                  <feMergeNode in="layer-3-offsetted" />
                  <feMergeNode in="layer-4-offsetted" />
                  <feMergeNode in="layer-5-offsetted" />
                  <feMergeNode in="layer-6-offsetted" />
                  <feMergeNode in="layer-7-offsetted" />
                  <feMergeNode in="layer-0-offsetted" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Gravity physics section */}
        <div className="hero-gravity-section">
          <div className="hero-gravity-label">Your Digital Types</div>
          <Gravity gravity={{ x: 0, y: 1 }} className="hero-gravity-container">
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="15%" y="10%">
              <div className="gravity-pill pill-strategic-custodian">Strategic Custodian</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="40%" y="8%">
              <div className="gravity-pill pill-technical-architect">Technical Architect</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="70%" y="12%">
              <div className="gravity-pill pill-network-liaison">Network Liaison</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="25%" y="25%" angle={8}>
              <div className="gravity-pill pill-operational-analyst">Operational Analyst</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="55%" y="20%">
              <div className="gravity-pill pill-digital-consumer">Digital Consumer</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="80%" y="18%" angle={-5}>
              <div className="gravity-pill pill-security-savvy">Security Savvy</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="10%" y="35%">
              <div className="gravity-pill pill-careless-clicker">Careless Clicker</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="45%" y="30%" angle={12}>
              <div className="gravity-pill pill-password-reuser">Password Reuser</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="65%" y="32%">
              <div className="gravity-pill pill-update-avoider">Update Avoider</div>
            </MatterBody>
            <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="35%" y="40%" angle={-8}>
              <div className="gravity-pill pill-oversharer">Oversharer</div>
            </MatterBody>
          </Gravity>
        </div>
      </section>

      <main className="home-main ambient-glow-bg">
        <div className="features reveal-stagger">
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>{t('feat_analysis_title')}</h3>
            <p>{t('feat_analysis_desc')}</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>{t('feat_recs_title')}</h3>
            <p>{t('feat_recs_desc')}</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <h3>{t('feat_progress_title')}</h3>
            <p>{t('feat_progress_desc')}</p>
          </div>
        </div>

        <div className="home-card reveal">
          <h2>{t('card_title')}</h2>
          <p>
            {t('card_body')}
          </p>
          <Link to="/assessment-start" className="start-btn">{t('btn_learn_more')}</Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
