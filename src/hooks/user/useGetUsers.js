import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetUsers(
  page,
  count,
  status,
  grade,
  head_office_org_code,
  org_code,
  geo,
  email,
  id,
  name,
  phone,
  excel
) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [allocation_total, setTotal] = useState([]);
  const [isUsersPending, startTransition] = useTransition();

  const getUsers = async () => {
    const res = (
      await Axios.Get(`member`, {
        params: {
          token: getAccessToken(),
          page: page,
          count: count,
          status: status,
          grade: grade,
          head_office_org_code: head_office_org_code,
          org_code: org_code,
          geo: geo,
          email: email,
          id: id,
          name: name,
          phone: phone,
          excel: excel,
        },
      })
    )?.data;

    console.log("res", res);
    if (res?.code === 200)
      startTransition(() => {
        setUsers(res?.data.result);
        setTotal(res?.data.allocation_total);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return { users, allocation_total, getUsers, isUsersPending };
}
