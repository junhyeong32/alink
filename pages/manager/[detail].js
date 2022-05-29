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
import RowLabel from "../../src/components/Box/RowLabel";
import { userListLabel } from "../../src/data/manager/detail";
import Button from "../../src/components/Button";

export default function Detail() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [excel, setExcel] = useState("");

  return (
    <Layout>
      <Column sx={{ gap: 2.8 }}>
        <Typography variant="h1">이용자 정보</Typography>
        <Column sx={{ rowGap: "15px" }}>
          {userListLabel.map((label, key) => (
            <RowLabel
              label={label}
              fs={"h4"}
              key={key}
              sx={{
                width: { lg: 481, md: 481, sm: 481, xs: "100%" },
              }}
            >
              <Typography variant="h6">text</Typography>
            </RowLabel>
          ))}
        </Column>
        <Column sx={{ gap: 1 }}>
          <Typography variant="h1">DB관리</Typography>
          <RowLabel label="보장할당">
            <Button
              text="OFF"
              variant={"contained"}
              bgColor="gray"
              color="primary.white"
              fs={"h6"}
              w={48}
              h={18}
            />
            {/* <Typography
              variant="h6"
              sx={{
                position: "absolute",
                color: "#FFFFFF",
                left: bojang ? "124px" : "145px",
              }}
            >
              {bojang ? "ON" : "OFF"}
            </Typography> */}
          </RowLabel>
          <RowLabel label="재무할당"></RowLabel>
          <RowLabel label="유전자할당"></RowLabel>
        </Column>

        <Row justifyContent={"center"}>
          <Button
            text="목록보기"
            variant={"contained"}
            bgColor="gray"
            color="primary.white"
            fs={"h6"}
            w={65}
            h={25}
          />
        </Row>
      </Column>
    </Layout>
  );
}
