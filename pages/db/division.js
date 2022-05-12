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

export default function Db() {
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
        <Row justifyContent={"center"} sx={{ gap: "100px" }}>
          <Column>
            <Typography variant="h1">고객 정보</Typography>
            <RowLabel label="분배일시"></RowLabel>
            <RowLabel label="DB 유입일"></RowLabel>
            <RowLabel></RowLabel>
            <RowLabel></RowLabel>
            <RowLabel></RowLabel>
            <RowLabel label="상담분야"></RowLabel>
            <RowLabel label="상담가능시간"></RowLabel>
            <RowLabel label="특이사항"></RowLabel>
            <RowLabel label="지역"></RowLabel>
          </Column>
          <Column>
            <Typography variant="h1">담당자 정보</Typography>
            <RowLabel label="소속명"></RowLabel>
            <RowLabel label="팅명/성명"></RowLabel>
          </Column>
        </Row>
        <Row justifyContent={"center"} sx={{ mt: "100px", gap: "12px" }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="등록"
            color="primary.white"
            fs="h6"
            w={158}
            h={20}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w={158}
            h={20}
          />
        </Row>
      </Column>
    </Layout>
  );
}
