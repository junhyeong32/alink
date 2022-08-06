import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import Button from "../../src/components/Button";
import MenuTable from "../../src/components/Table/setting/menu";
import PopupTable from "../../src/components/Table/setting/popup";
import useGetMenus from "../../src/hooks/setting/useGetMenus";

export default function Dna() {
  const router = useRouter();
  console.log(router);
  const [menu, setMenu] = useState(router.query.menu || "popup");
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const { menus, getMenus } = useGetMenus();

  return (
    <Layout>
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
            h={20}
            action={() =>
              menu === "popup"
                ? router.push("setting/popup")
                : router.push("setting/menu")
            }
          />
          {menu === "popup" ? (
            <PopupTable />
          ) : (
            <MenuTable data={menus} getMenus={getMenus} />
          )}
        </Column>
      </Column>
    </Layout>
  );
}
