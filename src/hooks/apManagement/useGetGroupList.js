import { useEffect, useState } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";

export default function useGetGroupList(cookies) {
  const [group_list, setGroupList] = useState();
  useEffect(async () => {
    const res = (
      await Axios.Get("organization", {
        params: {
          platform: "web",
          token: cookies.access_token,
        },
      })
    )?.data;
    if (res?.data.length !== 0) {
      return setGroupList(res?.data);
    }
  }, []);

  return group_list;
}
