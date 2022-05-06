import { useCallback, useEffect, useState } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";

const dateConversion = (date) => {
  if (date.length === 2 && date[0] && date[1]) {
    const conversionData = date?.map((c_date) => {
      const year = c_date?.getFullYear();
      const month = c_date?.getMonth() + 1;
      const date = c_date?.getDate();

      return year + "-" + month + "-" + date;
    });
    return conversionData.join(",");
  } else {
    return [];
  }
};

export default function getContractList(
  params,
  mode,
  setCount,
  setPageTotalCount,
  setPage,
  setExcel
) {
  const [contract_list, setContractList] = useState([]);
  const [contract_gallery, setContractGallery] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [gallery_page, setGalleryPage] = useState(1);

  // useEffect(() => {
  //   window.addEventListener("message", receiveMessage, false);

  //   return () => {
  //     window.removeEventListener("message", receiveMessage);
  //   };
  // }, [cookies.user_info]);

  // const receiveMessage = (e) => {
  //   if (e.data.message === "next") fetchData();
  // };

  useEffect(async () => {
    if (mode === "list") {
      if (params.excel === 1) {
        window.open(
          "https://api.afg.kr/admin/v1/document?" +
            Object.entries({
              platform: "web",
              token: cookies.access_token,
              page: mode === "list" ? params.page : gallery_page,
              count: params.count,
              type: params.type === "전체" ? undefined : params.type,
              contractor_name: params.contractor_name,
              user_name_or_code: params.user_name_or_code,
              stock_number: params.stock_number,
              subscription_number: params.subscription_number,
              created_date_range: dateConversion(params.created_date_range),
              contract_date_range: dateConversion(params.contract_date_range),
              status: params.status === "전체" ? undefined : params.status,
              org_code: params.org_code,
              excel: params.excel,
            })
              ?.map((e) => e.join("="))
              .join("&"),
          "_blank"
        );

        return setExcel("");
      }
      await fetchData();
    }
  }, [
    params.page,
    params.count,
    params.type,
    params.contractor_name,
    params.user_name_or_code,
    params.stock_number,
    params.subscription_number,
    params.created_date_range,
    params.contract_date_range,
    params.status,
    params.org_code,
    params.excel,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const res = (
      await Axios.Get("document", {
        params: {
          platform: "web",
          token: cookies.access_token,
          page: mode === "list" ? params.page : gallery_page,
          count: params.count,
          type: params.type === "전체" ? undefined : params.type,
          contractor_name: params.contractor_name,
          user_name_or_code: params.user_name_or_code,
          stock_number: params.stock_number,
          subscription_number: params.subscription_number,
          created_date_range: dateConversion(params.created_date_range),
          contract_date_range: dateConversion(params.contract_date_range),
          status: params.status === "전체" ? undefined : params.status,
          org_code: params.org_code,
          excel: params.excel,
        },
      })
    )?.data;

    if (res?.code === 200 && mode === "list") {
      setContractList(res?.data.result);
      setCount(Math.ceil(res?.data.total_count / params.count));
      setPageTotalCount(res?.data.total_count);
    }
    return setLoading(false);
  }, [params, contract_list, contract_gallery]);

  return { contract_list, loading, fetchData };
}
