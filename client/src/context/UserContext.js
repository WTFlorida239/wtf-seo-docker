import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/current_user');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(false); // Explicitly set to false for not logged in
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const hasPermission = (permission) => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    isLoading,
    hasPermission,
  };

  return (
    <UserContext.Provider value={value}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};
