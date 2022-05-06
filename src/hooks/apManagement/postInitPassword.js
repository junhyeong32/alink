import { useCallback, useEffect, useState } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";

export default function postInitPassword(cookies, ap_code) {
  const func = async () => {
    const res = await Axios.Post(`ap/password`, {
      platform: "web",
      token: cookies.access_token,
      ap_code: ap_code,
    });

    return res;
  };

  return func();
}
