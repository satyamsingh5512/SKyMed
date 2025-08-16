import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SystemContextType {
  isOnline: boolean;
  lastUpdate: Date;
  systemHealth: 'good' | 'warning' | 'critical';
  activeAlerts: number;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
  const [systemData, setSystemData] = useState<SystemContextType>({
    isOnline: true,
    lastUpdate: new Date(),
    systemHealth: 'good',
    activeAlerts: 3
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData(prev => ({
        ...prev,
        lastUpdate: new Date()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SystemContext.Provider value={systemData}>
      {children}
    </SystemContext.Provider>
  );
};