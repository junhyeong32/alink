import { useCallback, useEffect, useState, useContext } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";
import { OrganizationContext } from "../../contexts/OrganizationListContext";

export default function getSummaryInfo() {
  const [summary_info, setSummaryInfo] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const { organization } = useContext(OrganizationContext);

  useEffect(async () => {
    setLoading(true);

    const res = (
      await Axios.Get("document/summary", {
        params: {
          platform: "web",
          token: cookies.access_token,
          org_code: organization,
        },
      })
    )?.data;

    if (res?.data) {
      setSummaryInfo(res?.data);
    }

    return setLoading(false);
  }, [organization]);

  return { summary_data: summary_info, loading, loading };
}
