// hooks/useNotification.ts
import { useState, useEffect, useCallback } from 'react';

export const useNotification = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((message: string = 'Preference saved!'): void => {
    if (timer) {
      clearTimeout(timer);
    }
    setPopupMessage(message);
    setShowPopup(true);
    const newTimer = setTimeout(() => {
      setShowPopup(false);
    }, 2000);
    setTimer(newTimer);
  }, [timer]);

  const hideNotification = useCallback((): void => {
    setShowPopup(false);
    if (timer) {
      clearTimeout(timer);
    }
  }, [timer]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return {
    showPopup,
    popupMessage,
    showNotification,
    hideNotification
  };
};