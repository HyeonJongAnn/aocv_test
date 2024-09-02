import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useBodyClass = (className) => {
  const location = useLocation();
  
  useEffect(() => {
    document.body.classList.add(className);
    
    return () => {
      document.body.classList.remove(className);
    };
  }, [location, className]);
};

export default useBodyClass;
