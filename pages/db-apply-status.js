import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";
import { OutLineSelectInput } from "../src/components/Input/Select";
import Button from "../src/components/Button";
import DbApplyStatusTable from "../src/components/Table/db-apply-status";
import getUser from "../src/hooks/user/useGetUser";
import { getAccessToken } from "../src/utility/getCookie";
import Axios from "../src/utility/api";

export default function DbStatus() {
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");

  const { user } = getUser();

  useEffect(() => {
    const getDbApplyStatus = async () => {
      const res = (await Axios.Get(`user/db/count?token=${getAccessToken()}`))
        ?.data;

      console.log(res);
    };

    getDbApplyStatus();
  }, []);

  return (
    <Layout>
      <Column>
        <Typography variant="h1" sx={{ mb: 6 }}>
          DB 신청현황
        </Typography>
        <DbApplyStatusTable data={user} />
      </Column>
    </Layout>
  );
}
