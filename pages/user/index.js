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
  FormControlLabel,
} from "@mui/material";

import ReceptionStatusTable from "../../src/components/Table/data-status/ReceptionStatusTable";

import TopLabelContents from "../../src/components/Box/TopLableContents";
import RoundColorBox from "../../src/components/Box/RoundColorBox";

import {
  status,
  rank_list,
  argument_status,
} from "../../src/data/share/MenuByTextList";
import ExcelButton from "../../src/components/Button/Excel";
import Input, { LabelUnderLineInput } from "../../src/components/Input";
import SelectInput from "../../src/components/Input/Select";
import Button from "../../src/components/Button";

export default function User() {
  const router = useRouter();
  const [rank, setRank] = useState();

  return (
    <Layout>
      <Column>
        <Column sx={{ rowGap: "15px" }}>
          <TopLabelContents title="상태" sx={{ pl: 10 }}>
            {Object.entries(status).map(
              ([list, color], key) =>
                (key === 1 || key === 2) && (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox />}
                    label={
                      <RoundColorBox background={color}>
                        <Typography variant="h6">{list}</Typography>
                      </RoundColorBox>
                    }
                  />
                )
            )}
          </TopLabelContents>
          <TopLabelContents title="등급" sx={{ pl: 10 }}>
            {Object.entries(rank_list).map(([list, color], key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox />}
                label={
                  <RoundColorBox background={color}>
                    <Typography variant="h6">{list}</Typography>
                  </RoundColorBox>
                }
              />
            ))}
          </TopLabelContents>
          <Row wrap={"wrap"} justifyContent={"between"} sx={{ gap: 3 }}>
            <Column sx={{ width: "23%", gap: 1.5 }}>
              <SelectInput title="조직명" menuItems={{}} w="100%" />
              <LabelUnderLineInput
                title="이메일"
                placeholder={"이메일로 검색하실 수 있습니다."}
                w="100%"
              />
            </Column>
            <Column sx={{ width: "23%", gap: 1.5 }}>
              <SelectInput title="조직명" menuItems={{}} w="100%" />
              <LabelUnderLineInput
                title="아이디"
                placeholder={"아이디로 검색하실 수 있습니다."}
                w="100%"
              />
            </Column>
            <Column sx={{ width: "23%", gap: 1.5 }}>
              <SelectInput title="조직명" menuItems={{}} w="100%" />
              <LabelUnderLineInput
                title="이용자명"
                placeholder={"성명으로 검색하실 수 있습니다."}
                w="100%"
              />
            </Column>
            <Column alignItems={"end"} sx={{ width: "23%", gap: 1.5 }}>
              <Button
                text="초기화"
                bgColor={"gray"}
                fs={"h6"}
                color="primary.white"
                w={60}
                h={20}
              />
              <LabelUnderLineInput
                title="연락처"
                placeholder={"연락처로 검색하실 수 있습니다."}
                w="100%"
                sx={{ mt: 4 }}
              />
            </Column>
          </Row>

          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "15px" }}
          >
            <Button
              text="신규 아이디 생성"
              bgColor={"skyblue"}
              fs={"h6"}
              color="primary.white"
              h={20}
              action={() => router.push("user/new-id")}
            />

            <ExcelButton action={() => setExcel("1")} />
          </Row>
        </Column>

        <ReceptionStatusTable />
      </Column>
    </Layout>
  );
}
