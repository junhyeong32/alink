import { useEffect, useState, createContext } from "react";

export const OrganizationContext = createContext({
  open: false,
  setOpenVisible: () => {},
  organization: "",
  setOrganization: () => {},
  org_search: "",
  setOrgSearch: () => {},
});

export function OrganizationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [organization, setOrganization] = useState();
  const [org_search, setOrgSearch] = useState("");

  const setOpenVisible = (visible) => {
    setOpen(visible);
  };

  const addOrganizationData = (data) => {
    setOrganization(data);
  };

  const addOrganizationSearch = (data) => {
    setOrgSearch(data);
  };

  return (
    <OrganizationContext.Provider
      value={{
        open,
        setOpenVisible,
        organization,
        addOrganizationData,
        org_search,
        addOrganizationSearch,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
