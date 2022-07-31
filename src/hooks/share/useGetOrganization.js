import { useState, useTransition, useEffect } from "react";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetOrganization(type, head_office) {
  const [sales, setSales] = useState([]);
  const [cooperation, setCooperation] = useState([]);
  const [office_by_org, setOfficeByOrg] = useState([]);
  const [org_pending, setOrgPending] = useState(true);

  const getOrganization = async () => {
    const res = (
      await Axios.Get("organization", {
        params: {
          token: getAccessToken(),
          type: type,
          head_office_org_code: head_office,
        },
      })
    )?.data;

    if (res?.data.length !== 0) {
      console.log(res);
      if (type === "sales" && !head_office) {
        setSales(res?.data);
      } else if (type === "cooperation" && !head_office) {
        setCooperation(res?.data);
      } else {
        setOfficeByOrg(res?.data);
      }
    }
    setOrgPending(false);
  };
  useEffect(() => {
    getOrganization();
  }, [head_office]);

  return { org_pending, sales, cooperation, office_by_org };
}
