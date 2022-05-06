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

export default function getContractGalleryList(
  params,
  mode,
  setGalleryPageCount,
  setGalleryPageTotalCount,
  setGalleryPage
) {
  const [contract_gallery, setContractGallery] = useState([]);
  const [filter_contract, setFilterContract] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [status_arr, setStatusArr] = useState([]);
  const [status, setStatus] = useState([]);
  const [type, setType] = useState([]);

  useEffect(async () => {
    if (mode === "gallery") {
      setFilterContract([]);
    }
  }, [
    params.type,
    params.contractor_name,
    params.user_name_or_code,
    params.stock_number,
    params.subscription_number,
    params.created_date_range,
    params.contract_date_range,
    params.status,
    params.org_code,
  ]);

  // useEffect(() => {
  //   setStatus([...status, params.status]);
  // }, [params.status]);

  // useEffect(() => {
  //   setType([...type, params.type]);
  // }, [params.type]);

  useEffect(async () => {
    if (mode === "gallery") {
      await scrollFetchData();
    }
  }, [
    mode,
    params.type,
    params.contractor_name,
    params.user_name_or_code,
    params.stock_number,
    params.subscription_number,
    params.created_date_range,
    params.contract_date_range,
    params.status,
    params.org_code,
  ]);

  const scrollFetchData = useCallback(
    async (is_next) => {
      setLoading(true);
      const res = (
        await Axios.Get("document", {
          params: {
            platform: "web",
            token: cookies.access_token,
            page: is_next ? Number(params.page || 1) + 1 : 1,
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
          },
        })
      )?.data;

      if (
        res?.code === 200 &&
        (params.contractor_name ||
          params.user_name_or_code ||
          params.stock_number ||
          params.subscription_number ||
          params.created_date_range[0] !== null ||
          params.contract_date_range[0] !== null ||
          params.status ||
          params.org_cod)
      ) {
        setFilterContract((prev) => {
          const new_filter_contract = [...prev];
          if (res?.data.result.length === 0) {
            return ["none"];
          } else {
            new_filter_contract.push(...res?.data.result);
          }

          return new_filter_contract;
        });
        setGalleryPageTotalCount(res?.data.total_count);
      } else {
        setContractGallery([...contract_gallery, ...res?.data.result]);
        setGalleryPageTotalCount(res?.data.total_count);
      }
      return setLoading(false);
    },
    [params, contract_gallery]
  );

  return { contract_gallery, loading, filter_contract, scrollFetchData };
}
