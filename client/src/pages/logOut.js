import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    // Use the navigate hook to get the navigate function
    const navigate = useNavigate();
  
    // Effect to handle logout when component mounts
    useEffect(() => {
      // Logout logic
      localStorage.removeItem('authToken'); // erase the token given to the user from the server
      navigate('/'); // navigate to the home page
      window.location.reload();
         // Reload the entire page
    }, [navigate]); // Include navigate in the dependency array to prevent eslint warnings
  

  return (
    <div>
      {/* You can add any additional content or UI elements related to the logout process */}
    </div>
  );
};

export default Logout;
