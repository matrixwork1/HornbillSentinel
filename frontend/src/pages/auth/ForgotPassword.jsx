import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeUnauthenticatedRequest } from '../../utils/csrf';
import { usePasswordValidation, isPasswordValid, validatePassword } from '../../hooks/usePasswordValidation';
import './AuthStyles.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  
  const navigate = useNavigate();

  const {
    passwordValidation,
    showPasswordRequirements,
    passwordsMatch,
    showPasswordMatchIndicators,
  } = usePasswordValidation(newPassword, confirmPassword);

  // OTP Timer Effect
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => {
          if (timer <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    } else if (otpTimer === 0 && step === 2) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, step]);

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await makeUnauthenticatedRequest('POST', '/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      if (response.data.success) {
        setStep(2);
        setOtpTimer(600);
        setCanResendOtp(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await makeUnauthenticatedRequest('POST', '/api/auth/forgot-password', { email });
      setMessage('New verification code sent!');
      setOtpTimer(600);
      setCanResendOtp(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await makeUnauthenticatedRequest('POST', '/api/auth/verify-otp', { email, otp });
      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setMessage('OTP verified! Please enter your new password.');
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const validation = validatePassword(newPassword);
    if (!isPasswordValid(validation)) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    try {
      await makeUnauthenticatedRequest('POST', '/api/auth/reset-password-with-token', {
        token: resetToken,
        password: newPassword
      });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="page-container">
      <div className="auth-container reset-password">
        <div className="auth-card">
          <h2 className="reset-password-header">Reset Password</h2>
          
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOTPSubmit}>
              <p>We've sent a 6-digit verification code to {email}</p>
              
              {/* OTP Timer Display */}
              <div className="otp-timer-container">
                {otpTimer > 0 ? (
                  <div>
                    <p className="otp-timer-label">Code expires in:</p>
                    <p className={`otp-timer-value ${otpTimer <= 60 ? 'otp-timer-urgent' : ''}`}>
                      {formatTimer(otpTimer)}
                    </p>
                  </div>
                ) : (
                  <p className="otp-timer-expired">
                    Verification code has expired
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  className="otp-input"
                />
              </div>
              
              <button type="submit" className="auth-button primary" disabled={loading || otp.length !== 6 || otpTimer === 0}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              
              {canResendOtp && (
                <button 
                  type="button" 
                  className="auth-button secondary" 
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend Verification Code'}
                </button>
              )}
              
              <button 
                type="button" 
                className="auth-button secondary" 
                onClick={() => {
                  setStep(1);
                  setOtpTimer(0);
                  setCanResendOtp(false);
                  setOtp('');
                }}
              >
                Back to Email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label>New Password</label>
                <div className={`password-input-container ${showPasswordMatchIndicators && passwordsMatch ? 'has-indicator' : ''}`}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                  />
                  {showPasswordMatchIndicators && passwordsMatch && (
                    <div className="password-match-indicator show">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('new')}
                    aria-label={showPasswords.new ? "Hide password" : "Show password"}
                  >
                    <i className={showPasswords.new ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
                
                {showPasswordRequirements && (
                  <div className="password-requirements">
                    <p>Password must contain:</p>
                    <ul>
                      <li className={passwordValidation.hasMinLength ? 'valid' : 'invalid'}>
                        At least 12 characters {passwordValidation.hasMinLength ? '✅' : '❌'}
                      </li>
                      <li className={passwordValidation.hasUppercase ? 'valid' : 'invalid'}>
                        One uppercase letter {passwordValidation.hasUppercase ? '✅' : '❌'}
                      </li>
                      <li className={passwordValidation.hasLowercase ? 'valid' : 'invalid'}>
                        One lowercase letter {passwordValidation.hasLowercase ? '✅' : '❌'}
                      </li>
                      <li className={passwordValidation.hasNumber ? 'valid' : 'invalid'}>
                        One number {passwordValidation.hasNumber ? '✅' : '❌'}
                      </li>
                      <li className={passwordValidation.hasSpecialChar ? 'valid' : 'invalid'}>
                        One special character (e.g., !@#$%^&*(),.?":{}|&lt;&gt;) {passwordValidation.hasSpecialChar ? '✅' : '❌'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className={`password-input-container ${showPasswordMatchIndicators && passwordsMatch ? 'has-indicator' : ''}`}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                  {showPasswordMatchIndicators && (
                    <div className={`password-match-indicator ${passwordsMatch ? 'show' : 'show error'}`}>
                      <i className={passwordsMatch ? "fas fa-check" : "fas fa-times"}></i>
                    </div>
                  )}
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('confirm')}
                    aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                  >
                    <i className={showPasswords.confirm ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>
              
              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <div className="auth-links">
            <button onClick={() => navigate('/login')} className="auth-link-button">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
