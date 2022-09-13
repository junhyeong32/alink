import { Get } from "../../utility/api";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "../../utility/api";
import { getAccessToken } from "../../utility/getCookie";

export default function useGetUsers({
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
  excel,
  is_search,
  setExcel,
  areaMenuItems,
}) {
  const [users, setUsers] = useState([]);
  const [allocation_total, setTotal] = useState([]);
  const [isUsersPending, setIsUsersPending] = useState(true);
  const [totalCouunt, setTotalCount] = useState();

  const getUsers = async (orgCode, is_init) => {
    if (Number(excel) === 1) {
      window.open(
        "https://alinkapi.afg.kr/api/v1/member?" +
          Object.entries({
            token: getAccessToken(),
            page: page,
            count: count,
            status: status === "전체" ? undefined : status,
            grade: grade === "전체" ? undefined : grade,
            head_office_org_code:
              head_office_org_code === "전체"
                ? undefined
                : head_office_org_code,
            org_code: org_code === "전체" ? undefined : org_code,
            geo: geo === "전체" ? undefined : geo,
            email: email,
            id: id,
            name: name,
            phone: phone,
            excel: excel,
          })
            ?.map((e) => e.join("="))
            .join("&"),
        "_blank"
      );

      return setExcel("");
    }

    const res = is_init
      ? await Axios.Get(`member`, {
          params: {
            token: getAccessToken(),
            page: 1,
          },
        })
      : (
          await Axios.Get(`member`, {
            params: {
              token: getAccessToken(),
              page: page,
              count: count,
              status: status === "전체" ? undefined : status,
              grade: grade === "전체" ? undefined : grade,
              head_office_org_code:
                head_office_org_code === "전체"
                  ? undefined
                  : head_office_org_code,
              org_code:
                org_code === "전체" || orgCode === "전체"
                  ? undefined
                  : org_code || orgCode,
              geo:
                geo === "전체" || geo === 0
                  ? undefined
                  : areaMenuItems?.[geo] || geo,
              email: email,
              id: id,
              name: name,
              phone: phone,
              excel: excel,
            },
          })
        )?.data;

    if (res?.code === 200) {
      setUsers(res?.data.result);
      setTotal(res?.data.allocation_total);
      setTotalCount(Math.ceil(res?.data.total_count / 20));
      setIsUsersPending(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [page, excel, is_search]);

  return { users, allocation_total, getUsers, isUsersPending, totalCouunt };
}
