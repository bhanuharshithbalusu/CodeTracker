import toast from 'react-hot-toast';

// Keep track of recent toast messages to prevent duplicates
const recentToasts = new Set();
const TOAST_TIMEOUT = 1000; // 1 second timeout for duplicate prevention

/**
 * Show a toast message with duplicate prevention
 * @param {Function} toastFunction - toast.success, toast.error, etc.
 * @param {string} message - The message to display
 * @param {Object} options - Additional toast options
 */
const showToast = (toastFunction, message, options = {}) => {
  // Create a unique key for this message
  const toastKey = `${toastFunction.name}-${message}`;
  
  // If this exact message was shown recently, don't show it again
  if (recentToasts.has(toastKey)) {
    return;
  }
  
  // Add to recent toasts
  recentToasts.add(toastKey);
  
  // Remove from recent toasts after timeout
  setTimeout(() => {
    recentToasts.delete(toastKey);
  }, TOAST_TIMEOUT);
  
  // Show the toast
  return toastFunction(message, options);
};

export const dedupedToast = {
  success: (message, options) => showToast(toast.success, message, options),
  error: (message, options) => showToast(toast.error, message, options),
  loading: (message, options) => showToast(toast.loading, message, options),
  // Regular toast functions for cases where duplicates are wanted
  ...toast
};

export default dedupedToast;
