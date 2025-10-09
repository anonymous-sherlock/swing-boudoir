import { useState, useEffect } from 'react';

export const TOUR_STORAGE_KEY = 'swing-boudoir-product-tour-completed';
export const TOUR_TRIGGER_KEY = 'swing-boudoir-show-tour';

// Hook to check if tour should be shown
export const useProductTour = () => {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    const checkTourState = () => {
      const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      const shouldTriggerTour = localStorage.getItem(TOUR_TRIGGER_KEY);
      
      // Show tour if it's triggered and not completed
      if (shouldTriggerTour === 'true' && !tourCompleted) {
        setShouldShowTour(true);
        // Don't remove the trigger flag here - let the tour component handle it
      } else {
        setShouldShowTour(false);
      }
    };

    // Check initial state
    checkTourState();

    // Listen for storage changes (when triggerTour is called from another component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOUR_TRIGGER_KEY || e.key === TOUR_STORAGE_KEY) {
        checkTourState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events for same-tab communication
    const handleCustomEvent = () => {
      checkTourState();
    };

    window.addEventListener('tour-triggered', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tour-triggered', handleCustomEvent);
    };
  }, []);

  const markTourCompleted = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    localStorage.removeItem(TOUR_TRIGGER_KEY);
    setShouldShowTour(false);
  };

  const triggerTour = () => {
    // Clear any existing completion flag to allow re-running the tour
    localStorage.removeItem(TOUR_STORAGE_KEY);
    localStorage.setItem(TOUR_TRIGGER_KEY, 'true');
    setShouldShowTour(true);
    
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('tour-triggered'));
  };

  return { shouldShowTour, markTourCompleted, triggerTour };
};
