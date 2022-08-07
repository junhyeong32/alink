import Layout from "../src/components/Layout";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { ModalContext } from "../src/contexts/ModalContext";
import Axios from "../src/utility/api";
import {
  getAccessToken,
  getCookie,
  setCookie,
  rem,
  removeCookie,
} from "../src/utility/getCookie";

export default function Home({ getCookies }) {
  const router = useRouter();
  const [cookie_list, setCookieList] = useState([]);
  const [cookieAction, setCookieAction] = useState(false);
  console.log(cookie_list);
  useEffect(() => {
    !getCookies && router.replace("/login");
  }, []);

  const { openModal } = useContext(ModalContext);

  const getPopupList = async () => {
    const res = (
      await Axios.Get("popup", {
        params: {
          token: getAccessToken(),
        },
      })
    )?.data;

    if (res?.code === 200) {
      // TODO
      // 팝업 기간 설정
      res?.data?.result?.map(
        (popup, key) =>
          popup.activate === "활성화(매일)" &&
          (!getCookie(["popup"])
            ? true
            : getCookie(["popup"])?.indexOf(popup?.pk) === -1) &&
          openModal({
            modal: "popup",
            data: popup,
            content: {
              action: setCookieList,
              setCookieAction: setCookieAction,
              key: key,
            },
          })
      );
    }
  };

  useEffect(() => {
    getPopupList();
  }, []);

  useEffect(() => {
    console.log("start");
    if (cookie_list.length === 0) return;
    setCookie(["popup"], cookie_list, {
      maxAge: 436000,
    });
  }, [cookieAction]);

  console.log(cookie_list, "cookie_list", getCookie(["popup"]));

  return <Layout />;
}

export async function getServerSideProps(context) {
  return {
    props: {
      getCookies: context.req.cookies.user_info || null,
    },
  };
}
