import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetArea() {
  const router = useRouter();
  const [area, setArea] = useState([]);
  const [isPending, startTransition] = useTransition();

  const getArea = async () => {
    const res = (
      await Axios.Get(`db/geomap`, {
        params: {
          token: getAccessToken(),
        },
      })
    )?.data;
    console.log(res);
    if (res?.code === 200)
      startTransition(() => {
        setArea(res?.data);
      });
  };

  useEffect(() => {
    getArea();
  }, []);

  return { isPending, area, getArea };
}
