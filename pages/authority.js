import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import Button from "../src/components/Button";
import AuthorityTable from "../src/components/Table/authority";
import useGetGroupList from "../src/hooks/share/useGetGroupList";
import useGetUsers from "../src/hooks/user/useGetUsers";
import { Pagination } from "@mui/material";
import Axios from "../src/utility/api";
import { getAccessToken } from "../src/utility/getCookie";
import { useSnackbar } from "notistack";

export default function Authority() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [checkList, setCheckList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [org_code, setOrgCode] = useState("");

  const { users, allocation_total, getUsers, isUsersPending, totalCouunt } =
    useGetUsers({ page, count, org_code });

  return (
    <Layout loading={isUsersPending}>
      <Row sx={{ width: "100%" }}>
        {/* <OrganizationList /> */}
        {/* group_list={group_list} */}
        <Column sx={{ width: "80%" }}>
          <Row justifyContent={"end"} sx={{ width: "100%", gap: 1, mb: 1 }}>
            <Button
              text="입금 완료"
              variant={"contained"}
              color={"primary.white"}
              bgColor={"primary"}
              fs={"h6"}
              action={async () => {
                const res = await Axios.Post("member/deposit_status", {
                  token: getAccessToken(),
                  user_pks: checkList.join(","),
                  deposit_status: "입금 완료",
                });
                if (res?.code === 200)
                  enqueueSnackbar("입금 완료처리 되었습니다.", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                setCheckList([]);
                getUsers();
              }}
            />
            <Button
              text="입금 미완료"
              variant="contained"
              color={"primary.white"}
              bgColor={"orange"}
              fs={"h6"}
              action={async () => {
                const res = await Axios.Post("member/deposit_status", {
                  token: getAccessToken(),
                  user_pks: checkList.join(","),
                  deposit_status: "입금 미완료",
                });
                if (res?.code === 200)
                  enqueueSnackbar("입금 미완료처리 되었습니다.", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                setCheckList([]);
                getUsers();
              }}
            />
            <Button
              text="승인"
              variant="contained"
              color={"primary.white"}
              bgColor={"primary"}
              fs={"h6"}
              action={async () => {
                const res = Axios.Post("member/USER_PK/status", {
                  token: getAccessToken(),
                  user_pks: checkList.join(","),
                  status: "승인",
                });
                if (res?.code === 200)
                  enqueueSnackbar("승인 처리 되었습니다.", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                setCheckList([]);
                getUsers();
              }}
            />
            <Button
              text="미승인"
              variant="contained"
              color={"primary.white"}
              bgColor={"orange"}
              fs={"h6"}
              action={async () => {
                const res = Axios.Post("member/USER_PK/status", {
                  token: getAccessToken(),
                  user_pks: checkList.join(","),
                  status: "미승인",
                });
                if (res?.code === 200)
                  enqueueSnackbar("미승인 처리 되었습니다.", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                setCheckList([]);
                getUsers();
              }}
            />
          </Row>
          <AuthorityTable
            data={users}
            checkList={checkList}
            setCheckList={setCheckList}
          />
          <Row
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", mt: "86px", pb: 4 }}
          >
            <Pagination
              component="div"
              page={page}
              count={totalCouunt}
              onChange={(subject, newPage) => {
                setPage(newPage);
              }}
              color="primary"
              // hidePrevButton
              // hideNextButton
            />
          </Row>
        </Column>
      </Row>
    </Layout>
  );
}
