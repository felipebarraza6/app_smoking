import React, { createContext, useState } from "react";

export const ConnectionContext = createContext({
  isConnected: true,
  setIsConnected: () => {},
});

export const ConnectionProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};
