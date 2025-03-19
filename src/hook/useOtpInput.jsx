import { useState, useRef, useEffect } from "react";

/**
 * Custom hook to handle OTP input logic with automatic verification
 * @param {number} length - Length of the OTP code
 * @param {Object} options - Additional options
 * @param {Function} options.onComplete - Callback when OTP is complete
 * @param {string} options.secret - Secret key for verification
 * @param {Function} options.onVerificationComplete - Callback after verification completes
 * @param {boolean} options.resetOnFailure - Whether to reset inputs on verification failure (default: true)
 * @param {number} options.verificationDelay - Delay in ms before verifying OTP (default: 300)
 * @returns {Object} OTP input handling methods and state
 */
export const useOtpInput = (length = 6, options = {}) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const verificationTimerRef = useRef(null);
  
  // Default resetOnFailure to true unless explicitly set to false
  const resetOnFailure = options.resetOnFailure !== false;
  // Delay before verification to ensure all input events have processed
  const verificationDelay = options.verificationDelay || 100;

  // Handle countdown for resend capability
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  // Check if the OTP is complete
  const isOtpComplete = otp.every(digit => digit !== "");
  
  // Auto-verify when OTP is complete with a delay to ensure all input events finish
  useEffect(() => {
    // Clear any existing verification timer
    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
      verificationTimerRef.current = null;
    }

    if (isOtpComplete) {
      const otpCode = otp.join("");
      
      // Call onComplete callback if provided
      if (options.onComplete) {
        options.onComplete(otpCode);
      }
      
      // Add delay before verification to ensure UI is updated completely
      verificationTimerRef.current = setTimeout(() => {
        // Automatically trigger verification
        verifyOtp();
        verificationTimerRef.current = null;
      }, verificationDelay);
    }

    // Cleanup
    return () => {
      if (verificationTimerRef.current) {
        clearTimeout(verificationTimerRef.current);
      }
    };
  }, [otp]);

  // Handle input change
  const handleChange = (index, e) => {
    const value = e.target.value.slice(-1).replace(/\D/g, ""); // Take only the last digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Reset verification status when user starts typing again
    if (verificationStatus) {
      setVerificationStatus(null);
    }

    // Move to next input if a value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input when backspace is pressed in an empty input
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    
    if (pastedData) {
      const newOtp = [...otp];
      // Clear all fields first
      for (let i = 0; i < length; i++) {
        newOtp[i] = "";
      }
      // Then populate with pasted data
      for (let i = 0; i < pastedData.length; i++) {
        if (i < length) {
          newOtp[i] = pastedData[i];
        }
      }
      setOtp(newOtp);
      
      // Focus on the last completed field or the next empty one
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Start verification process
  const verifyOtp = async (verificationFn) => {
    if (!isOtpComplete) return;
    
    // Cancel any pending verification first
    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
      verificationTimerRef.current = null;
    }
    
    setIsVerifying(true);
    
    try {
      let isValid = false;
      let resultData = null;
      
      if (verificationFn) {
        // Use custom verification function if provided
        isValid = await verificationFn(otp.join(""));
      } else {
        // Default: Make API request to verify OTP
        const otpCode = otp.join("");
        
        const response = await fetch('http://localhost:3000/twofactor/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: otpCode,
            secret: options.secret || ''
          }),
        });
        
        resultData = await response.json();
        isValid = resultData.success;
      }
      
      // Define precise status messages based on verification result
      const statusMessage = isValid
        ? "Código verificado correctamente"
        : "Incorrect code. Please try again.";
      
      setVerificationStatus({
        success: isValid,
        message: statusMessage,
        data: resultData
      });
      
      // Reset OTP inputs if verification failed and resetOnFailure is true
      if (!isValid && resetOnFailure) {
        resetOtp();
        // Focus on first input after reset
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
      
      if (options.onVerificationComplete) {
        options.onVerificationComplete(isValid, resultData);
      }
      
      return isValid;
    } catch (error) {
      console.error('OTP verification error:', error);
      
      setVerificationStatus({
        success: false,
        message: "There was a server error. Please try again later.",
        error: error.message
      });
      
      // Reset OTP inputs on error if resetOnFailure is true
      if (resetOnFailure) {
        resetOtp();
        // Focus on first input after reset
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
      
      if (options.onVerificationComplete) {
        options.onVerificationComplete(false, null, error);
      }
      
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  // Trigger resend cooldown
  const startResendCooldown = (seconds = 60) => {
    setResendDisabled(true);
    setCountdown(seconds);
  };

  // Reset the OTP input
  const resetOtp = () => {
    // Ensure complete reset of all digits
    setOtp(Array(length).fill(""));
    setVerificationStatus(null);
    setIsVerifying(false);
  };

  return {
    otp,
    inputRefs,
    isOtpComplete,
    isVerifying,
    verificationStatus,
    resendDisabled,
    countdown,
    handleChange,
    handleKeyDown,
    handlePaste,
    verifyOtp,
    startResendCooldown,
    resetOtp,
    setVerificationStatus
  };
};