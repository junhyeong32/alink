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
  Input,
  TextField,
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

export default function User() {
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  return (
    <Layout>
      <Column sx={{ p: "40px" }}>
        <Typography>신규 생성</Typography>
        <TopLabelContents title="상태"></TopLabelContents>
        <TopLabelContents title="등급"></TopLabelContents>
        <RowLabel label="성명">
          <TextField
            inputProps={{
              style: {
                padding: "6px 0 0 12px",
                fontSize: "12px",
                width: "231px",
                height: "24px",
              },
            }}
          />
        </RowLabel>
        <RowLabel label="아이디">
          <TextField />
          <Button variant="contained" color="gray">
            중복체크
          </Button>
        </RowLabel>
        <RowLabel label="신규 비밀번호">
          <TextField />
        </RowLabel>
        <RowLabel label="비밀번호 확인">
          <TextField />
        </RowLabel>
        <RowLabel label="이메일 ">
          <TextField />
        </RowLabel>
        <RowLabel label="연락처">
          <TextField />
        </RowLabel>
        <RowLabel label="생년월일">
          <TextField />
        </RowLabel>
        <Row>
          <Button variant="contained" color="primary">
            생성
          </Button>
          <Button variant="contained" color="gray">
            취소
          </Button>
        </Row>
      </Column>
    </Layout>
  );
}
