import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function getUser() {
  const router = useRouter();
  const [user, setUser] = useState([]);
  const [isUserPending, startTransition] = useTransition();

  const getUser = async () => {
    if (router.isReady) {
      const res = (await Axios.Get(`user/db/count?token=${getAccessToken()}`))
        ?.data;

      if (res?.code === 200)
        startTransition(() => {
          setUser(res?.data);
        });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return { user, getUser, isUserPending };
}
