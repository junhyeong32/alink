import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import Button from "../../src/components/Button";
import MenuTable from "../../src/components/Table/setting/menu";
import PopupTable from "../../src/components/Table/setting/popup";
import useGetMenus from "../../src/hooks/setting/useGetMenus";
import { Pagination } from "@mui/material";
import { useEffect } from "react";
import { useTransition } from "react";
import Axios from "../../src/utility/api";
import { getAccessToken } from "../../src/utility/getCookie";

export default function Setting() {
  const router = useRouter();
  const [menu, setMenu] = useState(router.query.menu || "popup");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [totalCouunt, setTotalCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const getMenuByList = async () => {
    const res = (
      await Axios.Get(menu === "popup" ? "popup" : "db/menu", {
        params: {
          token: getAccessToken(),
          page: page,
        },
      })
    )?.data;

    if (res?.code === 200) {
      setList(res?.data?.result || res?.data);
      setTotalCount(Math.ceil(res?.data.total_count / 20));
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getMenuByList();
  }, [menu, page]);

  return (
    <Layout loading={loading}>
      <Column>
        <Row alignItems={"end"} sx={{ gap: "11px" }}>
          <Button
            variant="contained"
            bgColor={menu === "popup" ? "primary" : "light_gray"}
            text="팝업 관리"
            fs="h4"
            h={38}
            action={() => setMenu("popup")}
          />
          <Button
            variant="contained"
            bgColor={menu === "menu" ? "primary" : "light_gray"}
            text="메뉴 관리"
            fs="h4"
            h={38}
            action={() => setMenu("menu")}
          />
        </Row>
        <Column sx={{ mt: "70px", rowGap: 1 }}>
          <Button
            variant="contained"
            bgColor="skyblue"
            text={menu === "popup" ? "팝업등록" : "DB 메뉴 등록"}
            color="primary.white"
            fs="h6"
            w={100}
            h={28}
            action={() =>
              menu === "popup"
                ? router.push("setting/popup")
                : router.push("setting/menu")
            }
          />
          {menu === "popup" ? (
            <PopupTable data={list} getList={getMenuByList} />
          ) : (
            <MenuTable data={list} getMenus={getMenuByList} />
          )}
        </Column>
        <Row
          alignItems="center"
          justifyContent="center"
          sx={{ width: "100%", mt: "86px", pb: 4 }}
        >
          <Pagination
            component="div"
            page={page}
            count={totalCouunt}
            onChange={(subject, newPage) => {
              setPage(newPage);
            }}
            color="primary"
          />
        </Row>
      </Column>
    </Layout>
  );
}
