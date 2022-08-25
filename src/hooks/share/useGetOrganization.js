import { useState, useTransition, useEffect } from "react";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetOrganization(type, head_office, name, id) {
  const [sales, setSales] = useState([]);
  const [cooperation, setCooperation] = useState([]);
  const [office_by_org, setOfficeByOrg] = useState([]);
  const [org_pending, setOrgPending] = useState(true);

  const getOrganization = async (_type, _head_office) => {
    const res = (
      await Axios.Get("organization", {
        params: {
          token: getAccessToken(),
          type: type || _type,
          head_office_org_code:
            _head_office || head_office === "전체" ? undefined : head_office,
        },
      })
    )?.data;

    if (res?.data.length !== 0) {
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

  return { org_pending, sales, cooperation, office_by_org, getOrganization };
}
