import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, option) => {
  return cookies.set(name, value, { ...option });
};

export const removeCookie = (name, value, option) => {
  return cookies.remove(name, value, { ...option });
};

export const getCookie = (name) => {
  return cookies.get(name);
};

export const getAccessToken = () => {
  return cookies.get("access_token");
};
