import { useCallback, useEffect, useState, useContext } from "react";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";
import { ModalContext } from "../../contexts/ModalContext";

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

export default function getProductList(params, setCount, setExcel) {
  const [product, setProduct] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);

  const { modal_list, modal_data, addModalList, addModalData } =
    useContext(ModalContext);

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [cookies.user_info]);

  const receiveMessage = async (e) => {
    if (e.data === "product_reload") {
      await fetchData();
    }
  };

  useEffect(async () => {
    await fetchData();
  }, [
    params.page,
    params.status,
    params.user_name_or_code,
    params.created_date_range,
    params.product_name,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const res = (
      await Axios.Get("insurance/apply", {
        params: {
          platform: "web",
          token: cookies.access_token,
          page: params.page,
          status: params.status === "전체" ? undefined : params.status,
          user_name_or_code: params.user_name_or_code,
          created_date_range: dateConversion(params.created_date_range),
          product_name: params.product_name,
        },
      })
    )?.data;

    if (res?.code === 200) {
      setProduct(res?.data.result);
      setCount(Math.ceil(res?.data.total_count / 20));
    }
    setLoading(false);
  }, [params]);

  return { product, loading, fetchData };
}
