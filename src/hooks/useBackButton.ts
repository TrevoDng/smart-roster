import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BackButtonState {
  previousUrl: string | null;
  saveUrl: () => void;
  goBack: () => void;
  canGoBack: boolean;
}

export const useBackButton = (): BackButtonState => {
  const location = useLocation();
  const navigate = useNavigate();
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  // Save the current URL
  const saveUrl = () => {
    setPreviousUrl(location.pathname + location.search);
    // Also save to localStorage for persistence
    localStorage.setItem('backButtonPreviousUrl', location.pathname + location.search);
  };

  // Go back to the saved URL
  const goBack = () => {
    if (previousUrl) {
      navigate(previousUrl);
    } else {
      // Fallback: try to get from localStorage
      const savedUrl = localStorage.getItem('backButtonPreviousUrl');
      if (savedUrl) {
        navigate(savedUrl);
      } else {
        navigate('/dashboard');
      }
    }
  };

  // Check if we can go back
  const canGoBack = !!previousUrl || !!localStorage.getItem('backButtonPreviousUrl');

  // Load saved URL from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('backButtonPreviousUrl');
    if (savedUrl && !previousUrl) {
      setPreviousUrl(savedUrl);
    }
  }, []);

  return {
    previousUrl,
    saveUrl,
    goBack,
    canGoBack,
  };
};
