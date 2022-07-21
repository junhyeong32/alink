import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetfields() {
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [isPending, startTransition] = useTransition();

  const getfields = async () => {
    const res = (
      await Axios.Get(`db/property`, {
        params: {
          token: getAccessToken(),
        },
      })
    )?.data;

    console.log(res);

    if (res?.code === 200)
      startTransition(() => {
        setFields(res?.data);
      });
  };

  useEffect(() => {
    getfields();
  }, []);

  return { isPending, fields, getfields };
}
