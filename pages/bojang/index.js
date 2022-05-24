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
import { LabelUnderLineInput, DateInput } from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import { styles } from "../../src/styles/bojang";

export default function User() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  const [date_range, setDateRange] = useState(new Date());

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
          <Row justifyContent={"end"}>
            <Button
              variant="contained"
              bgColor="gray"
              text="초기화"
              color="primary.white"
              fs="h6"
              w={60}
              h={20}
              sx={styles.init_button}
            />
          </Row>
          <Row justifyContent={"between"} sx={styles.input_row}>
            <Column sx={styles.first_input_column}>
              <SelectInput title="조직명" menuItems={{}} />
              <SelectInput title="업체승인" menuItems={{}} />
              <SelectInput title="지역" menuItems={{}} />
            </Column>

            <Column sx={styles.second_input_column}>
              <SelectInput title="소속명" menuItems={{}} />
              <SelectInput title="등록처" menuItems={{}} />
              <SelectInput title="등록일" menuItems={{}} />
            </Column>

            <Box
              sx={{
                width: { lg: "25%", md: "100%", sm: "100%", xs: "100%" },
                gap: { lg: 2.6, xs: 1 },
                display: "flex",
                flexWrap: "wrap",
                flexDirection: {
                  lg: "column",
                  sm: "column",
                  md: "row",
                  xs: "row",
                },
                justifyContent: "space-between",
              }}
            >
              <SelectInput
                title="담당자"
                w={{
                  lg: "100%",
                  sm: "100%",
                  md: "45%",
                  xs: "100%",
                }}
                menuItems={{}}
              />
              <LabelUnderLineInput
                title="고객명"
                placeholder={"고객명으로 검색하실 수 있습니다."}
                w={{
                  lg: "100%",
                  sm: "100%",
                  md: "45%",
                  xs: "100%",
                }}
              />
              <SelectInput
                title="지역"
                menuItems={{}}
                w={{
                  lg: "100%",
                  sm: "100%",
                  md: "45%",
                  xs: "100%",
                }}
              />
              <LabelUnderLineInput
                title="연락처"
                placeholder={"연락처로 검색하실 수 있습니다."}
                w={{
                  lg: "100%",
                  sm: "100%",
                  md: "45%",
                  xs: "100%",
                }}
                sx={{
                  display: {
                    lg: "none",
                    sm: "none",
                    md: "flex",
                    xs: "flex",
                  },
                }}
              />
            </Box>

            <Column
              alignItems={"end"}
              sx={{
                width: { lg: "25%", md: "100%", sm: "100%", xs: "100%" },
                gap: { lg: 2.6, xs: 1 },
                display: {
                  lg: "flex",
                  sm: "flex",
                  md: "none",
                  xs: "none",
                },
              }}
            >
              <Button
                variant="contained"
                bgColor="gray"
                text="초기화"
                color="primary.white"
                fs="h6"
                w={60}
                h={20}
                sx={{
                  display: {
                    lg: "flex",
                    md: "none",
                    sm: "none",
                    xs: "none",
                  },
                }}
              />
              <LabelUnderLineInput
                w={"100%"}
                title="연락처"
                placeholder={"연락처로 검색하실 수 있습니다."}
                sx={{
                  mt: {
                    lg: 4,
                    md: 0,
                    sm: 0,
                    xs: 0,
                  },
                }}
              />
            </Column>
          </Row>
        </Column>

        <Column sx={{ mt: "15px" }}>
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Row sx={{ gap: "5px" }}>
              <OutLineSelectInput menuItems={{}} placeholder={"조직변경"} />
              <Button
                variant="contained"
                bgColor="primary"
                text="자동분배"
                color="primary.white"
                fs="h6"
                w={120}
                h={28}
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
