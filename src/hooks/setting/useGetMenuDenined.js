import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetMenuDenined(pk) {
  const router = useRouter();
  const [menu_denined, setMenuDenined] = useState([]);
  const [isPending, startTransition] = useTransition();

  const getMenuDenined = async () => {
    const res = (
      await Axios.Get(`db/denied`, {
        params: {
          token: getAccessToken(),
          db_pk: pk,
        },
      })
    )?.data;
    console.log(res);
    if (res?.code === 200)
      startTransition(() => {
        setMenuDenined(res?.data);
      });
  };

  useEffect(() => {
    getMenuDenined();
  }, []);

  return { isPending, menu_denined, getMenuDenined };
}
