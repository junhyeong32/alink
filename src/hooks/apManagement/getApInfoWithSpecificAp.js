import { useCallback, useEffect, useState } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";

export default function getApInfoWithSpecificAp(params) {
  const [ap_list, setApList] = useState([]);
  const [loading, setLoading] = useState(false);

  //   useEffect(async () => {
  //     await fetchData();
  //   }, [params.code]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = (
      await Axios.Get(`ap/org/${params?.code}`, {
        params: {
          platform: "web",
          token: cookies.access_token,
          page: params?.page,
        },
      })
    )?.data;

    if (res?.code === 200) {
      setApList(res?.data.result);
    }
    return setLoading(false);
  }, [params, ap_list]);

  return { ap_list: ap_list, loading: loading };
}
