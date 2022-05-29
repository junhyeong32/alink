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
import { LabelUnderLineInput } from "../../src/components/Input";
import SelectInput from "../../src/components/Input/Select";
import ManagerTable from "../../src/components/Table/manager";
import Button from "../../src/components/Button";

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
          <Row
            justifyContent={"end"}
            sx={{
              display: { lg: "none", md: "none", sm: "none", xs: "flex" },
            }}
          >
            <Button
              text="초기화"
              variant="contained"
              bgColor={"gray"}
              color="primary.white"
              fs="h6"
              w={60}
              h={20}
            />
          </Row>
          <Row justifyContent={"between"}>
            <Row
              sx={{
                gap: "35px",
                width: {
                  lg: "74.5%",
                  md: "74.5%",
                  sm: "74.5%",
                  xs: "100%",
                },
              }}
            >
              <SelectInput
                title="소속명"
                menuItems={{}}
                w={{
                  lg: "31.2%",
                  md: "60.5%",
                  sm: "60.5%",
                  xs: "100%",
                }}
              />
            </Row>
            <Button
              text="초기화"
              variant="contained"
              bgColor={"gray"}
              color="primary.white"
              fs="h6"
              w={60}
              h={20}
              sx={{
                display: { lg: "flex", md: "flex", sm: "flex", xs: "none" },
              }}
            />
          </Row>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: {
                lg: "nowrap",
                md: "wrap",
                sm: "wrap",
                xs: "wrap",
              },
              gap: "35px",
            }}
          >
            <LabelUnderLineInput
              title="이메일"
              placeholder={"이메일로 검색하실 수 있습니다."}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
            />
            <LabelUnderLineInput
              title="아이디"
              placeholder={"아이디로 검색하실 수 있습니다."}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
            />
            <LabelUnderLineInput
              title="이용자명"
              placeholder={"성명으로 검색하실 수 있습니다."}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
            />
            <LabelUnderLineInput
              title="연락처"
              placeholder={"연락처로 검색하실 수 있습니다."}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
            />
          </Box>
          <Row alignItems={"center"} justifyContent={"end"} sx={{ mb: "15px" }}>
            <ExcelButton action={() => setExcel("1")} />
          </Row>
        </Column>

        <ManagerTable />
      </Column>
    </Layout>
  );
}
