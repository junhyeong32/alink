import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import Button from "../src/components/Button";
import AuthorityTable from "../src/components/Table/authority";
import useGetUsers from "../src/hooks/user/useGetUsers";
import { Pagination } from "@mui/material";
import Axios from "../src/utility/api";
import { getAccessToken } from "../src/utility/getCookie";
import { useSnackbar } from "notistack";
import useGetOrganization from "../src/hooks/share/useGetOrganization";
import OrganizationList from "../src/components/OrganizationList/List";
import { useContext } from "react";
import { OrganizationContext } from "../src/contexts/OrganizationListContext";
import UnderLineInput from "../src/components/Input";
import UnderLineSelectInput from "../src/components/Input/Select";

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
  const [deposit_status, setDepositStatus] = useState("전체");
  const [pay_amount, setPayAmount] = useState("전체");

  const { sales, getOrganization } = useGetOrganization("sales");

  const { organization } = useContext(OrganizationContext);

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
  }, [page, organization, deposit_status, pay_amount]);

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
          }}
        >
          검색어는 상의 후 적용
          <UnderLineInput
            w={"80%"}
            placeholder="검색어를 입력해주세요"
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                getOrganization();
              }
            }}
          />
          <OrganizationList group_list={sales} />
        </Column>
        <Column sx={{ width: "80%", pl: 2 }}>
          <Row sx={{ widht: "100%", gap: 2 }}>
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
