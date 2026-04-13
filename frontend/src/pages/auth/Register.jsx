import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { makeUnauthenticatedRequest } from '../../utils/csrf';
import { usePasswordValidation, isPasswordValid } from '../../hooks/usePasswordValidation';
import './AuthStyles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const { firstName, email, password, password2 } = formData;

  const {
    passwordValidation,
    showPasswordRequirements,
    passwordsMatch,
    showPasswordMatchIndicators,
  } = usePasswordValidation(password, password2);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors.length > 0) setErrors([]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword2Visibility = () => {
    setShowPassword2(!showPassword2);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
  
    const newErrors = [];
    
    if (password !== password2) {
      newErrors.push('Passwords do not match');
    }
    
    if (!isPasswordValid(passwordValidation)) {
      newErrors.push('Password does not meet security requirements');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    try {
      const response = await makeUnauthenticatedRequest('post', '/api/auth/register', {
        firstName,
        email,
        password
      });

      login(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.details) {
        setErrors(err.response.data.details.map(detail => detail.message));
      } else if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(error => error.msg || error));
      } else {
        setErrors([err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        
        {errors.length > 0 && (
          <div className="error-message">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={onChange}
              required
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
              required
              autoComplete="email"
              spellCheck="false"
              maxLength="254"
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className={`password-input-container ${showPasswordMatchIndicators && passwordsMatch ? 'has-indicator' : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Create a strong password"
              />
              {showPasswordMatchIndicators && passwordsMatch && (
                <div className="password-match-indicator show">
                  <i className="fas fa-check"></i>
                </div>
              )}
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
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
                    One special character (!@#$%^&*(),.?":{}|&lt;&gt;) {passwordValidation.hasSpecialChar ? '✅' : '❌'}
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <div className={`password-input-container ${showPasswordMatchIndicators && passwordsMatch ? 'has-indicator' : ''}`}>
              <input
                type={showPassword2 ? "text" : "password"}
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                required
                placeholder="Confirm your password"
              />
              {showPasswordMatchIndicators && (
                <div className={`password-match-indicator ${passwordsMatch ? 'show' : 'show error'}`}>
                  <i className={passwordsMatch ? "fas fa-check" : "fas fa-times"}></i>
                </div>
              )}
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePassword2Visibility}
                aria-label={showPassword2 ? "Hide password" : "Show password"}
              >
                <i className={showPassword2 ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
