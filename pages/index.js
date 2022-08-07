import Layout from "../src/components/Layout";
import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { ModalContext } from "../src/contexts/ModalContext";
import Axios from "../src/utility/api";
import { getAccessToken, getCookie } from "../src/utility/getCookie";

export default function Home({ getCookies }) {
  const router = useRouter();
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
        (popup) =>
          popup.activate === "활성화(매일)" &&
          (!getCookie(["popup"])
            ? true
            : getCookie(["popup"])?.indexOf(popup?.pk) === -1) &&
          openModal({
            modal: "popup",
            data: popup,
          })
      );
    }
  };

  useEffect(() => {
    getPopupList();
  }, []);

  return <Layout />;
}

export async function getServerSideProps(context) {
  return {
    props: {
      getCookies: context.req.cookies.user_info || null,
    },
  };
}
