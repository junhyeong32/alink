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
  Input,
} from "@mui/material";
import { useState } from "react";
import ReceptionStatusTable from "../../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../../src/components/Box/TopLableContents";
import RowLabel from "../../src/components/Box/RowLabel";
import UnderLineInput, { OutLineInput } from "../../src/components/Input";
import Button from "../../src/components/Button";
import { OutLineSelectInput } from "../../src/components/Input/Select";

const rowLabelWidth = {
  width: {
    lg: "40%",
    md: "60%",
    sm: "60%",
    xs: "100%",
  },
};

export default function User() {
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  return (
    <Layout>
      <Column sx={{ p: "40px", gap: "20px" }}>
        <Typography variant="h1">신규 생성</Typography>
        <TopLabelContents title="상태" fs="h4"></TopLabelContents>
        <TopLabelContents
          title="등급"
          fs="h4"
          sx={{ width: { lg: "80%", xs: "100%" } }}
        ></TopLabelContents>
        <RowLabel label="조직명" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="본부명" sx={rowLabelWidth}>
          <OutLineSelectInput w="50%" menuItems={{}} />
        </RowLabel>
        <RowLabel label="지점명" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="이용자명" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>

        <RowLabel label="아이디" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
          <Button
            text="중복체크"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            h={20}
            fs="h6"
          />
        </RowLabel>
        <RowLabel label="신규 비밀번호" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="비밀번호 확인" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="이메일" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="연락처" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>
        <RowLabel label="생년월일" sx={rowLabelWidth}>
          <OutLineInput w="50%" />
        </RowLabel>
        <Row justifyContent={"center"} sx={{ width: "40%", gap: "15px" }}>
          <Button
            text="생성"
            variant="contained"
            bgColor="primary"
            color="primary.white"
            w={158}
            h={25}
            fs="h6"
          />
          <Button
            text="취소"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            w={158}
            h={25}
            fs="h6"
          />
        </Row>
      </Column>
      <Column sx={{ p: "40px", gap: "20px" }}>
        <Typography variant="h1">DB 관리</Typography>
        <RowLabel label="보장할당" fs="h4">
          <Row alignItems={"center"}>
            <OutLineInput w={90} />
            <Typography variant="h6" pl={1}>
              개
            </Typography>
          </Row>
        </RowLabel>
        <RowLabel label="재무할당" fs="h4">
          <Row alignItems={"center"}>
            <OutLineInput w={90} />
            <Typography variant="h6" pl={1}>
              개
            </Typography>
          </Row>
        </RowLabel>
        <RowLabel label="유전자할당" fs="h4">
          <Row alignItems={"center"}>
            <OutLineInput w={90} />
            <Typography variant="h6" pl={1}>
              개
            </Typography>
          </Row>
        </RowLabel>
        <Row justifyContent={"center"} sx={{ gap: "15px" }}>
          <Button
            text="생성"
            variant="contained"
            bgColor="primary"
            color="primary.white"
            w={158}
            h={25}
            fs="h6"
          />
          <Button
            text="취소"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            w={158}
            h={25}
            fs="h6"
          />
        </Row>
      </Column>
    </Layout>
  );
}
