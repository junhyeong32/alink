import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  Box,
} from "@mui/material";

import ReceptionStatusTable from "../../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../../src/components/Box/TopLableContents";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../../src/data/user";
import ExcelButton from "../../src/components/Button/Excel";
import Input, { DateInput } from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import MenuTable from "../../src/components/Table/setting/menu";
import PopupTable from "../../src/components/Table/setting/popup";

export default function Dna() {
  const router = useRouter();
  const [menu, setMenu] = useState("popup");
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState([null, null]);

  return (
    <Layout>
      <Column>
        <Row alignItems={"end"} sx={{ gap: "11px" }}>
          <Button
            variant="contained"
            bgColor={menu === "popup" ? "primary" : "light_gray"}
            text="팝업 관리"
            fs="h6"
            h={38}
            action={() => setMenu("popup")}
          />
          <Button
            variant="contained"
            bgColor={menu === "menu" ? "primary" : "light_gray"}
            text="메뉴 관리"
            fs="h6"
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
          {menu === "popup" ? <PopupTable /> : <MenuTable />}
        </Column>
      </Column>
    </Layout>
  );
}
