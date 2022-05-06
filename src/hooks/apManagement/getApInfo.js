import { useCallback, useEffect, useState } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";

export default function getApInfo(params, setCount, setExcel) {
  const [ap_list, setApList] = useState();
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(async () => {
    if (params.excel === 1) {
      window.open(
        "https://api.afg.kr/admin/v1/ap?" +
          Object.entries({
            platform: "web",
            token: cookies.access_token,
            page: params.page,
            user_name_or_code: params.user_name_or_code,
            excel: params.excel,
          })
            ?.map((e) => e.join("="))
            .join("&"),
        "_blank"
      );

      return setExcel("");
    }
    await fetchData();
  }, [params.page, params.user_name_or_code, params.excel, params.org_code]);

  const fetchData = async () => {
    setLoading(true);
    const res = (
      await Axios.Get("ap", {
        params: {
          platform: "web",
          token: cookies.access_token,
          page: params.page,
          user_name_or_code: params.user_name_or_code,
          org_code: params.org_code,
        },
      })
    )?.data;

    setApList(res?.data.result);
    setCount(Math.ceil(res?.data.total_count / 20));

    return setLoading(false);
  };

  return { ap_list: ap_list, loading: loading };
}
