// GlobalVariable.jsx
import React, { createContext, useContext, useState } from "react";

const GlobalVariable = createContext();

export const GlobalVariableProvider = ({ children }) => {
  const [domainName, setDomainName] = useState(localhost);

  return (
    <GlobalVariable.Provider value={{ domainName }}>
      {children}
    </GlobalVariable.Provider>
  );
};

export const useGlobalVariable = () => {
  return useContext(GlobalVariable);
};
