import { useCallback, useEffect, useState } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";

export default function checkLogin() {
  const [is_loggedin, setIsLoggedIn] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    if (cookies.user_info) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [cookies.user_info]);

  return is_loggedin;
}
