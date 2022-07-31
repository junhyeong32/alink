import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default async function useGetUserDetail(code) {
  const res = (
    await Axios.Get(`member/${code}`, {
      params: {
        token: getAccessToken(),
      },
    })
  )?.data;

  return res;
}
