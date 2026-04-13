import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { makeUnauthenticatedRequest } from '../../utils/csrf';
import { useLanguage } from '../../context/LanguageContext';
import './AuthStyles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [oldPasswordInfo, setOldPasswordInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [userId, setUserId] = useState(null);
  const [verificationMethod, setVerificationMethod] = useState('totp');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, formatDate } = useLanguage();

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (oldPasswordInfo) setOldPasswordInfo(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await makeUnauthenticatedRequest('post', '/api/auth/login', {
        email,
        password
      });
  
      if (response.data.requiresTwoFactor) {
        setShow2FA(true);
        setUserId(response.data.userId);
        setLoading(false);
        return;
      }
  
      login(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.isOldPassword) {
        setOldPasswordInfo({
          message: err.response.data.message,
          passwordChangedAt: err.response.data.passwordChangedAt
        });
      } else {
        setError(
          err.response?.data?.message || 
          t('default_login_error')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async () => {
    setVerifying(true);
    setError('');
    
    try {
      const response = await makeUnauthenticatedRequest('post', '/api/two-factor/verify', {
        userId,
        token: verificationCode,
        method: verificationMethod
      });
  
      login(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || '2FA verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const sendEmailOTP = async () => {
    try {
      await makeUnauthenticatedRequest('post', '/api/two-factor/send-email-otp', {
        userId
      });
      setVerificationMethod('email');
      setError('');
    } catch (err) {
      setError('Failed to send email OTP');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {show2FA ? (
          <div className="two-factor-verification">
            <h3>{t('twofa_title')}</h3>
            <div className="verification-methods">
              <button 
                className={verificationMethod === 'totp' ? 'active' : ''}
                onClick={() => setVerificationMethod('totp')}
              >
                {t('auth_app')}
              </button>
              <button 
                className={verificationMethod === 'backup' ? 'active' : ''}
                onClick={() => setVerificationMethod('backup')}
              >
                {t('backup_code')}
              </button>
              <button 
                className={verificationMethod === 'email' ? 'active' : ''}
                onClick={() => setVerificationMethod('email')}
              >
                {t('email_otp')}
              </button>
            </div>
            
            <div className="form-group">
              <label>
                {verificationMethod === 'totp' && t('totp_prompt')}
                {verificationMethod === 'backup' && t('backup_prompt')}
                {verificationMethod === 'email' && t('email_prompt')}
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={verificationMethod === 'backup' ? 'XXXXXXXX' : 'XXXXXX'}
                maxLength={verificationMethod === 'backup' ? 8 : 6}
              />
            </div>
            
            {verificationMethod === 'email' && (
              <button type="button" onClick={sendEmailOTP} className="send-otp-btn">
                {t('send_email_otp')}
              </button>
            )}
            
            <button 
              type="button" 
              className="verify-btn"
              onClick={handle2FAVerification}
            >
              {verifying ? t('verifying') : t('verify')}
            </button>
            
            <button onClick={() => setShow2FA(false)} className="back-btn">
              {t('back_to_login')}
            </button>
          </div>
        ) : (
          <>
            <h2>{t('login_title')}</h2>
            
            {error && <div className="error-message">{error}</div>}
            {oldPasswordInfo && (
              <div className="old-password-message">
                <p>{t('old_password_changed_on')} {formatDate(oldPasswordInfo.passwordChangedAt)}.</p>
                <Link to="/forgot-password" className="reset-password-link">
                  {t('reset_password_cta')}
                </Link>
              </div>
            )}
            
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="email">{t('email_label')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder={t('email_placeholder')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t('password_label')}</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    placeholder={t('password_placeholder')}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? t('hide_password') : t('show_password')}
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="auth-btn"
                disabled={loading}
              >
                {loading ? t('logging_in') : t('login_button')}
              </button>
            </form>
            
            <div className="auth-links">
              <p>{t('no_account')} <Link to="/register">{t('register_here')}</Link></p>
              <p><Link to="/forgot-password">{t('forgot_password')}</Link></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
