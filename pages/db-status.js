import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Button, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";

export default function DbStatus() {
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");

  return (
    <Layout>
      <Column>
        <Button>초기화</Button>
        <Row>
          <Typography sx={{ fontSize: "30px" }}>분배 가능 DB</Typography>
        </Row>
        <Row>
          {select_title.map((title, key) => (
            <Column key={key}>
              <Typography>{title}</Typography>
              <Select
                value={
                  title === "지역"
                    ? area
                    : title === "본부"
                    ? headquarters
                    : branch
                }
              >
                {(title === "지역"
                  ? area_input
                  : title === "본부"
                  ? headquarters_input
                  : branch_input
                ).map((menu, key) => (
                  <MenuItem value={Object.keys(menu)[0]} key={key}>
                    {Object.values(menu)[0]}
                  </MenuItem>
                ))}
              </Select>
            </Column>
          ))}
        </Row>

        <Column>
          <Row justifyContent={"between"}>
            <Typography>접수 현황</Typography>
            <Select></Select>
          </Row>

          <ReceptionStatusTable />
        </Column>
      </Column>
    </Layout>
  );
}
