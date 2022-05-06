import { useEffect, useState, createContext } from "react";

export const OrganizationContext = createContext({
  open: false,
  setOpenVisible: () => {},
  organization: "",
  setOrganization: () => {},
});

export function OrganizationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [organization, setOrganization] = useState();

  const setOpenVisible = (visible) => {
    setOpen(visible);
  };

  const addOrganizationData = (data) => {
    setOrganization(data);
  };

  return (
    <OrganizationContext.Provider
      value={{
        open,
        setOpenVisible,
        organization,
        addOrganizationData,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
