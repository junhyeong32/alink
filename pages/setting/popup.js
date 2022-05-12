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
import RoundColorBox from "../../src/components/Box/RoundColorBox";
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
import RowLabel from "../../src/components/Box/RowLabel";

export default function Popup() {
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
        <RowLabel label="조직"></RowLabel>
        <RowLabel label="유형"></RowLabel>
        <RowLabel label="제목"></RowLabel>
        <RowLabel label="위치"></RowLabel>
        <RowLabel label="크기"></RowLabel>
        <RowLabel label="활성화"></RowLabel>
        <Row sx={{ mt: "70px" }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="등록"
            color="primary.white"
            fs="h6"
            w={100}
            h={20}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w={100}
            h={20}
            action={() => router.push("/setting")}
          />
        </Row>
      </Column>
    </Layout>
  );
}
