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

import Input, { DateInput, OutLineInput } from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import DisableBox from "../../src/components/Box/DisableBox";

export default function Division() {
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
          justifyContent={"start"}
          flexDirection={{
            lg: "row",
            md: "row",
            sm: "row",
            xs: "column",
          }}
          sx={{ columnGap: "100px", rowGap: 3 }}
        >
          <Column sx={{ width: "100%", maxWidth: 463, gap: 2.8 }}>
            <Typography variant="h1">고객 정보</Typography>
            <RowLabel label="분배일시" label_w={80}>
              <Typography>1</Typography>
            </RowLabel>
            <RowLabel label="DB 유입일" label_w={80}>
              <OutLineInput />
            </RowLabel>
            <RowLabel label_w={80}>
              <OutLineInput />
            </RowLabel>
            <RowLabel label_w={80}>
              <OutLineInput />
            </RowLabel>
            <RowLabel label_w={80}>
              <OutLineInput />
            </RowLabel>

            <RowLabel label="상담분야" label_w={80}>
              <DisableBox />
            </RowLabel>
            <RowLabel label="상담가능시간" label_w={80}>
              <DisableBox />
            </RowLabel>
            <RowLabel label="특이사항" label_w={80}>
              <DisableBox />
            </RowLabel>

            <RowLabel label="지역" label_w={80}>
              <OutLineSelectInput menuItems={{}} />
              <OutLineSelectInput menuItems={{}} />
            </RowLabel>
          </Column>
          <Column sx={{ width: "100%", maxWidth: 463, gap: 2.8 }}>
            <Typography variant="h1">담당자 정보</Typography>
            <RowLabel label="소속명" label_w={60}>
              <OutLineSelectInput menuItems={{}} />
            </RowLabel>
            <RowLabel label="소속/성명" label_w={60}>
              <OutLineSelectInput menuItems={{}} />
              <OutLineSelectInput menuItems={{}} />
            </RowLabel>
          </Column>
        </Row>
        <Row
          justifyContent={"center"}
          sx={{ gap: "12px", maxWidth: 1020, mt: 10 }}
        >
          <Row sx={{ gap: 1 }}>
            <Button text="등록" fs="h6" w={150} h={25} />

            <Button
              variant="contained"
              bgColor="gray"
              text="취소"
              color="primary.white"
              fs="h6"
              w={150}
              h={25}
            />
          </Row>
        </Row>
      </Column>
    </Layout>
  );
}
