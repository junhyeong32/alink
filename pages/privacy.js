import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  Box,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../src/components/Box/TopLableContents";
import RoundColorBox from "../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../src/data/user";
import ExcelButton from "../src/components/Button/Excel";
import Input, { DateInput } from "../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../src/components/Input/Select";
import Button from "../src/components/Button";
import RowLabel from "../src/components/Box/RowLabel";

import Image from "next/image";
import SmsTable from "../src/components/Table/sms";

export default function Privacy() {
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
      <Column alignItems="center" sx={{ gap: "25px" }}>
        <Row>
          <TopLabelContents title="상태">
            <Button text="상태" />
          </TopLabelContents>
        </Row>
        <Row>
          <TopLabelContents title="아이디">id</TopLabelContents>
          <TopLabelContents title="이용자명">id</TopLabelContents>
        </Row>

        <Button text="수정" />
      </Column>
    </Layout>
  );
}
