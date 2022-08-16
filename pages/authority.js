import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import Button from "../src/components/Button";
import AuthorityTable from "../src/components/Table/authority";
import useGetUsers from "../src/hooks/user/useGetUsers";
import { Pagination, Typography, CircularProgress } from "@mui/material";
import Axios from "../src/utility/api";
import { getAccessToken } from "../src/utility/getCookie";
import { useSnackbar } from "notistack";
import useGetOrganization from "../src/hooks/share/useGetOrganization";
import OrganizationList from "../src/components/OrganizationList/List";
import { useContext } from "react";
import { OrganizationContext } from "../src/contexts/OrganizationListContext";
import UnderLineInput, { LabelUnderLineInput } from "../src/components/Input";
import UnderLineSelectInput from "../src/components/Input/Select";
import {
  getOrgWithName,
  getOrgWithId,
} from "../src/utility/organization/getOrgWithUnit";

export default function Authority() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [checkList, setCheckList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [org_code, setOrgCode] = useState("");
  const [users, setUsers] = useState([]);
  const [isUsersPending, setIsUsersPending] = useState(true);
  const [totalCouunt, setTotalCount] = useState();
  const [search, setSearch] = useState("");
  const [searchNum, setSearchNum] = useState("");
  const [deposit_status, setDepositStatus] = useState("전체");
  const [pay_amount, setPayAmount] = useState("전체");
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const { sales, getOrganization } = useGetOrganization("sales");
  const [search_list, setSearchList] = useState(1);

  const { organization, addOrganizationData } = useContext(OrganizationContext);

  const getUsers = async (is_init) => {
    const res = is_init
      ? (
          await Axios.Get(`member`, {
            params: {
              token: getAccessToken(),
            },
          })
        )?.data
      : (
          await Axios.Get(`member`, {
            params: {
              token: getAccessToken(),
              page: page,
              count: count,
              id: id,
              name: name,
              org_code: organization,
              deposit_status:
                deposit_status === "전체" ? undefined : deposit_status,
              pay_amount:
                pay_amount === "전체"
                  ? undefined
                  : pay_amount === "+1"
                  ? 1
                  : pay_amount,
            },
          })
        )?.data;

    if (res?.code === 200) {
      setUsers(res?.data.result);
      setTotalCount(Math.ceil(res?.data.total_count / 20));
      setIsUsersPending(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [page, organization]);

  return (
    <Layout loading={isUsersPending}>
      <Row sx={{ width: "100%", overflowY: "hidden" }}>
        <Column
          alignItems={"center"}
          sx={{
            width: 246,
            height: "100%",
            overflowY: "scroll",
            gap: 2,
            border: "1px solid #EFEFEF",
            pb: 5,
          }}
        >
          <Column sx={{ width: "100%", p: 1, mt: 1 }}>
            <UnderLineSelectInput w={"100%"} title="조직명" menuItems={{}} />
          </Column>
          <OrganizationList group_list={sales} open />
        </Column>
        <Column sx={{ width: "100%", pl: 2 }}>
          <Row justifyContent={"end"} sx={{ width: "100%", mb: 2, gap: 1 }}>
            <Button
              text={"검색"}
              w={56}
              h={28}
              fs={"h5"}
              action={() => getUsers()}
            />
            <Button
              text={"초기화"}
              bgColor="gray"
              w={56}
              h={28}
              fs={"h5"}
              action={() => {
                setPayAmount("전체");
                setDepositStatus("전체");
                document.querySelector("id").value = "";
                document.querySelector("name").value = "";
              }}
            />
          </Row>
          <Row alignItems={"end"} sx={{ widht: "100%", gap: 2 }}>
            <LabelUnderLineInput
              id="name"
              title={"사원명"}
              w={"25%"}
              placeholder="사원명으로 검색"
              onBlur={(e) => setName(e.target.value)}
            />
            <LabelUnderLineInput
              id="id"
              title={"아이디"}
              w={"25%"}
              placeholder="아이디로 검색"
              onBlur={(e) => setId(e.target.value)}
            />
            <UnderLineSelectInput
              title={"전월 급여액"}
              w={"25%"}
              menuItems={{
                전체: "전체",
                "+1": "+",
                "-1": "-",
              }}
              value={pay_amount}
              setValue={setPayAmount}
            />
            <UnderLineSelectInput
              title={"입금내역"}
              w={"25%"}
              menuItems={{
                전체: "전체",
                "입금 완료": "입금 완료",
                "입금 미완료": "입금 미완료",
              }}
              value={deposit_status}
              setValue={setDepositStatus}
            />
          </Row>
          <Row
            justifyContent={"end"}
            sx={{ width: "100%", gap: 1, mb: 1, mt: 2 }}
          >
            <Button
              text="입금 완료"
              variant={"contained"}
              color={"primary.white"}
              bgColor={"primary"}
              fs={"h6"}
              action={async () => {
                if (checkList.length === 0)
                  return enqueueSnackbar("사원이 선택되지 않았습니다", {
                    variant: "error",
                    autoHideDuration: 2000,
                  });
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
                if (checkList.length === 0)
                  return enqueueSnackbar("사원이 선택되지 않았습니다", {
                    variant: "error",
                    autoHideDuration: 2000,
                  });
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
                if (checkList.length === 0)
                  return enqueueSnackbar("사원이 선택되지 않았습니다", {
                    variant: "error",
                    autoHideDuration: 2000,
                  });
                const res = await Axios.Post("member/status", {
                  token: getAccessToken(),
                  user_pks: checkList.join(","),
                  status: "승인",
                });
                console.log(res);
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
                if (checkList.length === 0)
                  return enqueueSnackbar("사원이 선택되지 않았습니다", {
                    variant: "error",
                    autoHideDuration: 2000,
                  });
                const res = await Axios.Post("member/status", {
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
