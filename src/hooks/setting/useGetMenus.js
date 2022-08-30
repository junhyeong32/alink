import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetMenus() {
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  const [isPending, startTransition] = useTransition();

  const getMenus = async () => {
    const res = (
      await Axios.Get(`db/menu`, {
        params: {
          token: getAccessToken(),
        },
      })
    )?.data;
    
    if (res?.code === 200)
      startTransition(() => {
        setMenus(res?.data);
      });
  };

  useEffect(() => {
    getMenus();
  }, []);

  return { isPending, menus, getMenus };
}
