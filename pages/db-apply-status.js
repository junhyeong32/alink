import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Pagination } from "@mui/material";
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
  const [status_list, setStatusList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getDbHistory = async () => {
      const res = (await Axios.Get(`user/db/history?token=${getAccessToken()}`))
        ?.data;
      if (res?.code === 200) {
        setTotalCount(Math.ceil(res?.data.total_count / 20));
        setStatusList(res?.data?.result);
      }
    };

    getDbHistory();
    setLoading(false);
  }, [page]);

  return (
    <Layout loading={loading}>
      <Column>
        <Typography variant="h1" sx={{ mb: 6 }}>
          DB 신청현황
        </Typography>
        <DbApplyStatusTable data={status_list} page={page} />
        <Row justifyContent={"center"} sx={{ width: "100%", mt: 5 }}>
          <Pagination
            component="div"
            page={page}
            count={totalCount}
            onChange={(subject, newPage) => {
              setPage(newPage);
            }}
            color="primary"
            // hidePrevButton
            // hideNextButton
          />
        </Row>
      </Column>
    </Layout>
  );
}
