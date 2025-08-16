import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  parcels: any[];
  addParcel: (parcel: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567'
  });

  const [parcels, setParcels] = useState<any[]>([]);

  const addParcel = (parcel: any) => {
    setParcels(prev => [...prev, parcel]);
  };

  return (
    <UserContext.Provider value={{ user, parcels, addParcel }}>
      {children}
    </UserContext.Provider>
  );
};