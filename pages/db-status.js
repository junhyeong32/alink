import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";
import { OutLineSelectInput } from "../src/components/Input/Select";
import Button from "../src/components/Button";

export default function DbStatus() {
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");

  return (
    <Layout>
      <Column>
        <Row justifyContent={"end"}>
          <Button
            h={20}
            variant="contained"
            bgColor={"gray"}
            fs="h6"
            color="primary.white"
            text="초기화"
          />
        </Row>
        <Row justifyContent={"between"} alignItems={"center"}>
          <Typography sx={{ fontSize: "30px" }}>분배 가능 DB</Typography>

          <Row sx={{ gap: "21px" }}>
            {select_title.map((title, key) => (
              <OutLineSelectInput
                key={key}
                title={title}
                value={
                  title === "지역"
                    ? area
                    : title === "본부"
                    ? headquarters
                    : branch
                }
                menuItems={
                  title === "지역"
                    ? area_input[0]
                    : title === "본부"
                    ? headquarters_input[0]
                    : branch_input[0]
                }
              />
            ))}
          </Row>
        </Row>

        <Row>
          <Column>
            <Typography>보장</Typography>
          </Column>
          <Column>
            <Typography>재무</Typography>
          </Column>
          <Column>
            <Typography>유전자</Typography>
          </Column>
        </Row>

        <Column sx={{ mt: 10 }}>
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Typography sx={{ fontSize: "30px" }}>접수 현황</Typography>
            <OutLineSelectInput menuItems={{}}></OutLineSelectInput>
          </Row>

          <ReceptionStatusTable />
        </Column>
      </Column>
    </Layout>
  );
}
