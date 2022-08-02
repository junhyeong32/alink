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
  FormLabel,
  FormControlLabel,
  Radio,
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
import Input, {
  DateInput,
  LabelUnderLineInput,
} from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import {
  list_filter,
  list_detail,
  additionsal_func,
} from "../../src/data/setting/menu";
import Image from "next/image";
import SmsTable from "../../src/components/Table/sms";
import { styles } from "../../src/styles/sms";

export default function Sms() {
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
      <Column sx={{ gap: "25px" }}>
        <Row
          justifyContent={"between"}
          alignItems={"end"}
          wrap={"wrap"}
          sx={styles.filter_row}
        >
          <SelectInput title="발송일" menuItems={{}} w={styles.input} />
          <LabelUnderLineInput
            title="담당자"
            placeholder={"담당자로 검색하실 수 있습니다"}
            w={styles.input}
          />
          <LabelUnderLineInput
            title="연락처"
            placeholder={"연락처로 검색하실 수 있습니다"}
            w={styles.input}
          />
          <Button
            text="초기화"
            bgColor={"gray"}
            variant={"contained"}
            color="primary.white"
            w={60}
            h={20}
            fs="h6"
          />
          {/* <Typography variant="h6">보유 포인트 : </Typography> */}
        </Row>
        <SmsTable />
      </Column>
    </Layout>
  );
}
