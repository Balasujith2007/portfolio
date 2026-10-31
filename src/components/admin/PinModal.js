import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaTimes, FaSpinner, FaShieldAlt } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import './PinModal.css';

const PinModal = () => {
  const { isPinModalOpen, setIsPinModalOpen, loginWithPin } = usePortfolio();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const modalRef = useRef(null);

  // Reset state and focus first input on open
  useEffect(() => {
    if (isPinModalOpen) {
      setPin(['', '', '', '']);
      setError('');
      setIsSubmitting(false);
      setTimeout(() => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPinModalOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPinModalOpen) return;
      if (e.key === 'Escape') {
        setIsPinModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPinModalOpen, setIsPinModalOpen]);

  if (!isPinModalOpen) return null;

  const handleInputChange = (index, value) => {
    setError('');
    // Allow only numeric character
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const char = cleaned.slice(-1);
    const newPin = [...pin];
    newPin[index] = char;
    setPin(newPin);

    // Auto-advance
    if (char && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    // Auto-submit if all 4 digits are entered
    if (index === 3 && char) {
      const fullPin = newPin.join('');
      if (fullPin.length === 4) {
        submitPin(fullPin);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = '';
        setPin(newPin);
        inputRefs[index - 1].current.focus();
      } else {
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current.focus();
    } else if (e.key === 'Enter') {
      const fullPin = pin.join('');
      if (fullPin.length === 4) {
        submitPin(fullPin);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;

    const digits = pasted.split('');
    const newPin = ['', '', '', ''];
    digits.forEach((d, i) => {
      if (i < 4) newPin[i] = d;
    });
    setPin(newPin);

    if (digits.length >= 4) {
      inputRefs[3].current.focus();
      submitPin(newPin.join(''));
    } else {
      const nextIdx = Math.min(digits.length, 3);
      inputRefs[nextIdx].current.focus();
    }
  };

  const submitPin = async (fullPin) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      await loginWithPin(fullPin);
    } catch (err) {
      setError(err.message || 'Incorrect PIN. Verification failed.');
      // Reset inputs & focus first
      setPin(['', '', '', '']);
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length !== 4) {
      setError('Please enter all 4 digits of your PIN.');
      return;
    }
    submitPin(fullPin);
  };

  return (
    <AnimatePresence>
      <div 
        className="pin-modal-overlay" 
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsPinModalOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-modal-title"
      >
        <motion.div 
          className="pin-modal-card"
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        >
          <button 
            className="pin-modal-close" 
            onClick={() => setIsPinModalOpen(false)}
            aria-label="Close PIN modal"
            type="button"
          >
            <FaTimes />
          </button>

          <div className="pin-modal-header">
            <div className="pin-icon-badge">
              <FaShieldAlt className="shield-icon" />
              <FaLock className="lock-subicon" />
            </div>
            <h2 id="pin-modal-title">Portfolio Admin Access</h2>
            <p className="pin-modal-subtitle">Enter your 4-digit PIN to manage your portfolio.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="pin-modal-form">
            <div className="pin-inputs-row" onPaste={handlePaste}>
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`pin-digit-box ${digit ? 'filled' : ''} ${error ? 'error' : ''}`}
                  aria-label={`PIN digit ${index + 1}`}
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            {error && (
              <motion.div 
                className="pin-error-alert"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="btn btn-primary pin-submit-btn"
              disabled={isSubmitting || pin.join('').length !== 4}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spin" /> Verifying...
                </>
              ) : (
                'Verify & Enter Admin'
              )}
            </button>
          </form>

          <div className="pin-modal-footer">
            <span>Secured with rate-limiting & encrypted session authorization</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PinModal;
