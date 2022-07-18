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
import RowLabel from "../../src/components/Box/RowLabel";

export default function Dna() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState([null, null]);

  return (
    <Layout>
      <Column>
        <Typography variant="h1">인수상태</Typography>
        <Row justifyContent={"between"}>
          <Typography variant="h6" sx={{ color: "#3532C7" }}>
            월 DB 지원 대상자입니다.
          </Typography>
          <Button
            variant="contained"
            bgColor="primary"
            text="담당 지역 변경"
            color="primary.white"
            fs="h6"
            h={25}
          />
        </Row>
        <Column sx={{ gap: 3 }}>
          <RowLabel label="보장할당"></RowLabel>
          <RowLabel label="재무 할당"></RowLabel>
          <RowLabel label="유전자 할당"></RowLabel>
        </Column>
        <Row justifyContent={"center"} sx={{ mt: 18 }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="신청"
            color="primary.white"
            fs="h5"
            w={160}
            h={30}
          />
        </Row>
      </Column>
    </Layout>
  );
}
