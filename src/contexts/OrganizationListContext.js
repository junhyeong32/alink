import { useEffect, useState, createContext } from "react";

export const OrganizationContext = createContext({
  open: false,
  setOpenVisible: () => {},
  organization: "",
  setOrganization: () => {},
  org_info: "",
  addOrganizationInfo: () => {},
});

export function OrganizationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [organization, setOrganization] = useState();
  const [org_info, setOrgInfo] = useState("");

  const setOpenVisible = (visible) => {
    setOpen(visible);
  };

  const addOrganizationData = (data) => {
    setOrganization(data);
  };

  const addOrganizationInfo = (data) => {
    setOrgInfo(data);
  };

  return (
    <OrganizationContext.Provider
      value={{
        open,
        setOpenVisible,
        organization,
        addOrganizationData,
        org_info,
        addOrganizationInfo,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
