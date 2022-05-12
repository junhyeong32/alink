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
        <Button variant="outlined" text="신청권한" fs="h6" w={80} h={20} />
        <Column sx={{ rowGap: "15px", p: "40px 40px 0 40px" }}>
          <Typography variant="h4">인수상태</Typography>
          <TopLabelContents sx={{ pl: 10 }}>
            {status_list.map((list, key) => (
              <Row key={key}>
                <Checkbox />
                <RoundColorBox background={status_bgcolor[key]}>
                  <Typography variant="h6">{Object.values(list)[0]}</Typography>
                </RoundColorBox>
              </Row>
            ))}
          </TopLabelContents>

          <Row justifyContent={"between"}>
            <Row sx={{ gap: "35px", width: "74.5%" }}>
              <SelectInput title="조직명" w={"33%"} menuItems={{}} />
              <SelectInput title="소속명" w={"33%"} menuItems={{}} />
              <SelectInput title="담당자" w={"33%"} menuItems={{}} />
            </Row>

            <Button
              variant="contained"
              bgColor="gray"
              text="초기화"
              color="primary.white"
              fs="h6"
              h="20px"
            />
          </Row>

          <Row sx={{ gap: "35px" }}>
            <SelectInput title="업체승인" w={"25%"} menuItems={{}} />
            <SelectInput title="등록처" w={"25%"} menuItems={{}} />
            <Input
              title="고객명"
              placeholder={"고객명으로 검색하실 수 있습니다."}
            />
            <Input
              title="연락처"
              placeholder={"연락처로 검색하실 수 있습니다."}
            />
          </Row>
          <Row sx={{ gap: "35px", width: "50%" }}>
            <SelectInput title="지역" w={"50%"} menuItems={{}} />
            <DateInput
              title="등록일"
              placeholder={"성명으로 검색하실 수 있습니다."}
              w="50%"
              value={date_range}
              setValue={setDateRange}
            />
          </Row>
        </Column>

        <Column sx={{ mt: "15px" }}>
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Row sx={{ gap: "5px" }}>
              <Button
                variant="contained"
                bgColor="skyblue"
                text="수동 분배"
                color="primary.white"
                fs="h6"
                w={120}
                h={20}
                action={() => router.push("db/division")}
              />
              <Button
                variant="contained"
                bgColor="excel"
                text="엑셀 분배"
                color="primary.white"
                fs="h6"
                w={120}
                h={20}
              />
            </Row>
            <ExcelButton action={() => setExcel("1")} />
          </Row>
          <ReceptionStatusTable />
        </Column>
      </Column>
    </Layout>
  );
}
