import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const SelectedProjectContext = createContext();
export const SelectedProjectProvider = ({ children }) => {
  //inbox is the default selected project
  const [selectedProject, setSelectedProject] = useState("INBOX");

  return (
    <SelectedProjectContext.Provider
      value={{ selectedProject, setSelectedProject }}
    >
      {children}
    </SelectedProjectContext.Provider>
  );
};

export const useSelectedProjectValue = () => useContext(SelectedProjectContext);

SelectedProjectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
