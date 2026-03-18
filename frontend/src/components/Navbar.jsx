import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../NavbarStyles.css';
import logo from '../images/logo.png';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
    setProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  };

  const closeProfileDropdown = () => {
    setProfileDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Mobile menu icon */}
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        {/* Logo - using imported logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={logo} alt={t('alt_logo')} className="navbar-logo-img" />
        </Link>
        
        {/* Desktop nav links */}
        <ul className="nav-menu desktop-only">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>{t('nav_home')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMobileMenu}>{t('nav_about')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>{t('nav_contact')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/assessment-start" className="nav-link" onClick={closeMobileMenu}>{t('nav_assessment')}</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>{t('nav_dashboard')}</Link>
            </li>
          )}
        </ul>
        
        {/* User profile for desktop only */}
        <div className="user-profile desktop-only">
          {/* Language selector */}
          <div className="language-select">
            <span className="language-label">{t('language_label')}:</span>
            <select
              aria-label={t('aria_select_language')}
              value={language}
              onChange={(e)=>setLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="en">{t('lang_en')}</option>
              <option value="zh">{t('lang_zh')}</option>
              <option value="ms">{t('lang_ms')}</option>
              <option value="swk">{t('lang_swk')}</option>
            </select>
          </div>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">{t('nav_login')}</Link>
              <Link to="/register" className="register-button">{t('nav_register')}</Link>
            </>
          ) : (
            <>
              <span className="welcome-text">{t('dash_hello')}, {user?.name}!</span>
              <div className="profile-dropdown-container">
                <button 
                  className="nav-link profile-btn" 
                  onClick={toggleProfileDropdown}
                  onMouseEnter={() => setProfileDropdown(true)}
                >
                  {t('nav_profile')}
                  <i className="fas fa-chevron-down profile-arrow"></i>
                </button>
                {profileDropdown && (
                  <div 
                    className="profile-dropdown"
                    onMouseLeave={closeProfileDropdown}
                  >
                    <Link 
                      to="/account-settings" 
                      className="dropdown-item"
                      onClick={closeProfileDropdown}
                    >
                      <i className="fas fa-cog"></i>
                      {t('nav_account')}
                    </Link>
                    <button 
                      className="dropdown-item logout-dropdown" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      {t('nav_logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu overlay — rendered outside navbar-container for full-screen coverage */}
      {click && <div className="mobile-menu-backdrop" onClick={closeMobileMenu} />}
      <div className={click ? 'mobile-menu active' : 'mobile-menu'}>
        <div className="mobile-menu-header">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img src={logo} alt={t('alt_logo')} className="navbar-logo-img" />
          </Link>
          <button className="mobile-close-btn" onClick={closeMobileMenu} aria-label="Close menu">
            <i className="fas fa-times" />
          </button>
        </div>
        <ul className="mobile-menu-links">
          <li><Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>{t('nav_home')}</Link></li>
          <li><Link to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>{t('nav_about')}</Link></li>
          <li><Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>{t('nav_contact')}</Link></li>
          <li><Link to="/assessment-start" className="mobile-nav-link" onClick={closeMobileMenu}>{t('nav_assessment')}</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>{t('nav_dashboard')}</Link></li>
              <li><Link to="/account-settings" className="mobile-nav-link" onClick={closeMobileMenu}>{t('nav_account')}</Link></li>
            </>
          )}
        </ul>
        <div className="mobile-menu-divider" />
        <div className="language-select-mobile">
          <span className="language-label">{t('language_label')}:</span>
          <select
            aria-label="Select language"
            value={language}
            onChange={(e)=>{ setLanguage(e.target.value); closeMobileMenu(); }}
            className="language-dropdown"
          >
            <option value="en">{t('lang_en')}</option>
            <option value="zh">{t('lang_zh')}</option>
            <option value="ms">{t('lang_ms')}</option>
            <option value="swk">{t('lang_swk')}</option>
          </select>
        </div>
        <div className="mobile-menu-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="mobile-login-btn" onClick={closeMobileMenu}>
                <i className="fas fa-sign-in-alt" /> {t('nav_login')}
              </Link>
              <Link to="/register" className="mobile-register-btn" onClick={closeMobileMenu}>
                <i className="fas fa-user-plus" /> {t('nav_register')}
              </Link>
            </>
          ) : (
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> {t('nav_logout')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
