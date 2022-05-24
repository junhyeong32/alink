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
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
import Input from "../../src/components/Input";
import SelectInput from "../../src/components/Input/Select";
import RowLabel from "../../src/components/Box/RowLabel";
import Button from "../../src/components/Button";

const CustomSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 49,
  height: 20,
  padding: 0,
  position: "relative",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#FFFFFF",
      right: "1px",
      "& + .MuiSwitch-track": {
        backgroundColor: "#0D1D41",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#F8C4C6",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: "white",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 15,
    height: 15,
  },
  "& .MuiSwitch-track": {
    borderRadius: 15,
    backgroundColor: "#909090",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function Info() {
  const router = useRouter();
  const [bojang, setBojang] = useState(false);
  const [db, setDb] = useState(false);
  const [dna, setDna] = useState(false);

  return (
    <Layout>
      <Column>
        <Column sx={{ rowGap: "17px" }}>
          <Typography variant="h1" sx={{ fontSize: "25px", fontWeight: 700 }}>
            이용자 정보
          </Typography>

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
          <TopLabelContents title="등급">
            {status_list.map((list, key) => (
              <Row key={key}>
                <Checkbox />
                <RoundColorBox background={status_bgcolor[key]}>
                  <Typography variant="h6">{Object.values(list)[0]}</Typography>
                </RoundColorBox>
              </Row>
            ))}
          </TopLabelContents>
          <RowLabel label="조직명"></RowLabel>
          <RowLabel label="직급"></RowLabel>
          <RowLabel label="소속"></RowLabel>
          <RowLabel label="성명"></RowLabel>
          <RowLabel label="아이디"></RowLabel>
          <RowLabel label="신규 비밀번호"></RowLabel>
          <RowLabel label="비밀번호 확인"></RowLabel>
          <RowLabel label="이메일"></RowLabel>
          <RowLabel label="연락처"></RowLabel>
          <RowLabel label="생년월일"></RowLabel>
        </Column>

        <Column>
          <Typography variant="h1" sx={{ fontSize: "25px", fontWeight: 700 }}>
            DB 관리
          </Typography>
          <RowLabel label="보장할당">
            <CustomSwitch
              value={bojang}
              onClick={(e) => {
                setBojang(e.target.checked);
              }}
            ></CustomSwitch>
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                color: "#FFFFFF",
                left: bojang ? "124px" : "145px",
              }}
            >
              {bojang ? "ON" : "OFF"}
            </Typography>
          </RowLabel>
          <RowLabel label="재무할당"></RowLabel>
          <RowLabel label="유전자할당"></RowLabel>
        </Column>
        <Row justifyContent={"center"} sx={{ gap: "12px", mt: 5 }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="수정"
            fs="h6"
            w="158px"
            h="25px"
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w="158px"
            h="25px"
          />
        </Row>
      </Column>
    </Layout>
  );
}
