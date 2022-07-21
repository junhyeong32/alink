import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetUserDetail(code) {
  const router = useRouter();
  const [user_detail, setUserDetail] = useState([]);
  const [isUserDetailPending, startTransition] = useTransition();

  const getUserDetail = async () => {
    if (router.isReady) {
      const res = (
        await Axios.Get(`member/${code}`, {
          params: {
            token: getAccessToken(),
          },
        })
      )?.data;

      if (res?.code === 200)
        startTransition(() => {
          setUserDetail(res?.data);
        });
    }
  };

  useEffect(() => {
    getUserDetail();
  }, [router.isReady]);

  return { user_detail, getUserDetail, isUserDetailPending };
}
