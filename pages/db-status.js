import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Button, Select } from "@mui/material";
import { useState } from "react";
import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";

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
          <Column>
            <Typography>보장</Typography>
          </Column>
          <Column>
            <Typography>재무</Typography>
          </Column>
          <Column>
            <Typography>듀전자</Typography>
          </Column>
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
