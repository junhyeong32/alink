import { useCallback, useEffect, useState } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

export default function getDetailInfo(addModalList) {
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [cookies.user_info]);

  const receiveMessage = (e) => {
    if (e.data.message === "openUserModal") {
      (async () => {
        const res = (
          await Axios.Get(`document/${e.data.value?.code}`, {
            params: {
              platform: "web",
              token: cookies.access_token,
            },
          })
        )?.data;

        if (res?.data) {
          addModalList({
            name: e.data.message,
            is_open: true,
            detail_info: res?.data,
            code: e.data.value?.code,
            params: e.data.value?.params,
          });
        } else {
          enqueueSnackbar(res?.message, {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
      })();
    } else if (e.data.message === "openApModal") {
      (async () => {
        const res = (
          await Axios.Get(`ap/${e.data.value}`, {
            params: {
              platform: "web",
              token: cookies.access_token,
            },
          })
        )?.data;

        if (res?.data) {
          addModalList({
            name: e.data.message,
            is_open: true,
            detail_info: res?.data,
          });
        } else {
          enqueueSnackbar(res?.message, {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
      })();
    } else if (e.data.message === "openMessageModal") {
      addModalList({
        name: e.data.message,
        is_open: true,
        detail_info: e.data.value,
      });
    } else if (e.data.message === "openImageModal") {
      addModalList({
        name: e.data.message,
        is_open: true,
        image: e.data.value,
      });
    } else if (e.data.message === "openApproveModal") {
      addModalList({
        name: e.data.message,
        is_open: true,
        pk: e.data.value,
      });
    } else if (e.data.message === "openCompanionModal") {
      addModalList({
        name: e.data.message,
        is_open: true,
        pk: e.data.value,
      });
    } else if (e.data.message === "openImproveModal") {
      addModalList({
        name: e.data.message,
        is_open: true,
        document_codes: e.data.value,
      });
    }
  };
}
