import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetMenuDetail(menu_id) {
  const router = useRouter();
  const [menu_detail, setMenuDetail] = useState([]);
  const [menuDetailPending, startTransition] = useTransition();

  const getMenuDetail = async () => {
    if (router.isReady) {
      const res = (
        await Axios.Get(`db/menu/${menu_id}`, {
          params: {
            token: getAccessToken(),
          },
        })
      )?.data;
      console.log(res);
      if (res?.code === 200)
        startTransition(() => {
          setMenuDetail(res?.data);
        });
    }
  };

  useEffect(() => {
    getMenuDetail();
  }, [router.isReady]);

  return { menuDetailPending, menu_detail, getMenuDetail };
}

