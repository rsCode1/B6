import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Logout component.
 * Handles the logout process and redirects to the home page.
 */
const Logout = () => {
    const navigate = useNavigate();
  
    useEffect(() => {

      localStorage.removeItem('authToken'); 
      navigate('/'); 
         // Reload the entire page
        window.location.reload();
    }, [navigate]);
  

  return (
    <div>
      {/* You can add any additional content or UI elements related to the logout process */}
    </div>
  );
};

export default Logout;
