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
  OutlinedInput,
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
import Input, { DateInput, OutLineInput } from "../../src/components/Input";
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
      <Column justifyContent={"between"} sx={{ gap: 2.8 }}>
        <Row
          justifyContent={"center"}
          flexDirection={{
            lg: "row",
            md: "row",
            sm: "row",
            xs: "column",
          }}
          sx={{ columnGap: "100px", rowGap: 3 }}
        >
          <Column sx={{ width: { lg: "50%", xs: "100%" }, gap: 2.8 }}>
            <Typography variant="h1">고객 정보</Typography>
            <RowLabel label="분배일시">
              <Typography>1</Typography>
            </RowLabel>
            <RowLabel label="DB 유입일">
              <OutLineInput />
            </RowLabel>
            <RowLabel label="연락처">
              <OutLineInput />
            </RowLabel>
            <RowLabel label="연락처">
              <OutLineInput />
            </RowLabel>
            <RowLabel label="연락처">
              <OutLineInput />
            </RowLabel>
            <RowLabel label="상담분야"></RowLabel>
            <RowLabel label="상담가능시간"></RowLabel>
            <RowLabel label="특이사항"></RowLabel>
            <RowLabel label="지역"></RowLabel>
          </Column>
          <Column sx={{ width: { lg: "50%", xs: "100%" }, gap: 2.8 }}>
            <Typography variant="h1">담당자 정보</Typography>
            <RowLabel label="소속명"></RowLabel>
            <RowLabel label="팀명/성명"></RowLabel>
            <RowLabel label="조직"></RowLabel>
            <RowLabel label="소속/성명">
              <OutLineSelectInput menuItems={{}} />
              <OutLineSelectInput menuItems={{}} />
            </RowLabel>
          </Column>
        </Row>
        <Typography variant="h4" color="primary.red">
          녹취파일 및 메모는 등록 후 삭제가 불가하며, 업로드 하지 않을 시 저장이
          되지 않습니다.
        </Typography>
        <Column sx={{ gap: 1 }}>
          <Row alignItems={"center"} sx={{ gap: 2 }}>
            <Typography variant="h1">메모관리</Typography>
            <Button
              variant="contained"
              bgColor="primary"
              text="메모추가"
              color="primary.white"
              fs="h6"
              h={20}
            />
          </Row>
          <OutlinedInput
            placeholder="메모를 입력해주세요."
            rows={4}
            multiline
          />
          <Row>
            <Column
              sx={{ border: "1px solid black", borderRadius: "5px", p: 1 }}
            >
              <Typography variant="h6">text</Typography>
              <Box sx={{ background: "#E6E6E6", p: 0.5 }}>
                <Typography>text</Typography>
              </Box>
            </Column>
          </Row>
        </Column>
        <Row justifyContent={"between"} sx={{ gap: "12px" }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="인쇄"
            color="primary.white"
            fs="h6"
            h={20}
          />
          <Row sx={{ gap: 1 }}>
            <Button
              variant="contained"
              bgColor="primary"
              text="수정"
              color="primary.white"
              fs="h6"
              h={20}
            />

            <Button
              variant="contained"
              bgColor="gray"
              text="목록보기"
              color="primary.white"
              fs="h6"
              h={20}
            />
          </Row>
          <Button
            variant="contained"
            bgColor="gray"
            text="선택"
            color="primary.white"
            fs="h6"
            h={20}
          />
        </Row>
      </Column>
    </Layout>
  );
}
