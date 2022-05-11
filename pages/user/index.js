import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import {
  Container,
  Typography,
  Button,
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
import Input from "../../src/components/Input";
import SelectInput from "../../src/components/Input/Select";

export default function User() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  return (
    <Layout>
      <Column>
        <Column sx={{ rowGap: "15px" }}>
          <TopLabelContents title="상태">
            {status_list.map((list, key) => (
              <Row key={key}>
                <Checkbox />
                <RoundColorBox background={status_bgcolor[key]}>
                  <Typography variant="h6">{Object.values(list)[0]}</Typography>
                </RoundColorBox>
              </Row>
            ))}
          </TopLabelContents>
          <TopLabelContents title="등급"></TopLabelContents>
          <Row justifyContent={"between"}>
            <Row sx={{ gap: "35px", width: "74.5%" }}>
              <SelectInput title="조직명" menuItems={{}} />
              <SelectInput title="소속명" menuItems={{}} />
              <SelectInput title="지역" menuItems={{}} />
            </Row>
            <Button variant="contained" color="gray" sx={{ height: "20px" }}>
              <Typography variant="h6" color="primary.white">
                초기화
              </Typography>
            </Button>
          </Row>

          <Row sx={{ gap: "35px" }}>
            <Input
              title="이메일"
              placeholder={"이메일로 검색하실 수 있습니다."}
            />
            <Input
              title="아이디"
              placeholder={"아이디로 검색하실 수 있습니다."}
            />
            <Input
              title="이용자명"
              placeholder={"성명으로 검색하실 수 있습니다."}
            />
            <Input
              title="연락처"
              placeholder={"연락처로 검색하실 수 있습니다."}
            />
          </Row>
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "15px" }}
          >
            <Button
              sx={{
                background: "#52809A",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "12px",
                height: "20px",
              }}
              onClick={() => router.push("user/new-id")}
            >
              신규 아이디 생성
            </Button>
            <ExcelButton action={() => setExcel("1")} />
          </Row>
        </Column>

        <ReceptionStatusTable />
      </Column>
    </Layout>
  );
}
