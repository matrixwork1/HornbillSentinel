import { useState, useEffect } from 'react';

/**
 * Validates a password against security requirements.
 * @param {string} password
 * @returns {{ hasUppercase: boolean, hasLowercase: boolean, hasNumber: boolean, hasSpecialChar: boolean, hasMinLength: boolean }}
 */
export const validatePassword = (password) => ({
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  hasMinLength: password.length >= 12,
});

/**
 * Returns true if every requirement in the validation object is met.
 * @param {{ hasUppercase: boolean, hasLowercase: boolean, hasNumber: boolean, hasSpecialChar: boolean, hasMinLength: boolean }} validation
 * @returns {boolean}
 */
export const isPasswordValid = (validation) =>
  Object.values(validation).every(Boolean);

/**
 * Custom hook that manages password validation and password-match state.
 *
 * @param {string} password       – the new password value
 * @param {string} confirmPassword – the confirm-password value
 * @returns {{
 *   passwordValidation: object,
 *   showPasswordRequirements: boolean,
 *   passwordsMatch: boolean,
 *   showPasswordMatchIndicators: boolean,
 * }}
 */
export const usePasswordValidation = (password, confirmPassword) => {
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPasswordMatchIndicators, setShowPasswordMatchIndicators] = useState(false);

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
      setShowPasswordMatchIndicators(true);
    } else {
      setShowPasswordMatchIndicators(false);
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
      setShowPasswordRequirements(!isPasswordValid(validation));
    } else {
      setShowPasswordRequirements(false);
    }
  }, [password]);

  return {
    passwordValidation,
    showPasswordRequirements,
    passwordsMatch,
    showPasswordMatchIndicators,
  };
};
