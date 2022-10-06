import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import Button from "../src/components/Button";
import AuthorityTable from "../src/components/Table/authority";
import useGetUsers from "../src/hooks/user/useGetUsers";
import {
  Pagination,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Axios from "../src/utility/api";
import { getAccessToken } from "../src/utility/getCookie";
import { useSnackbar } from "notistack";
import useGetOrganization from "../src/hooks/share/useGetOrganization";
import OrganizationList from "../src/components/OrganizationList/List";
import { useContext } from "react";
import { OrganizationContext } from "../src/contexts/OrganizationListContext";
import UnderLineInput, { LabelUnderLineInput } from "../src/components/Input";
import UnderLineSelectInput from "../src/components/Input/Select";
import { getOrgHeadOffice } from "../src/utility/organization/getOrgWithUnit";
import Image from "next/image";

export default function Authority() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { sales } = useGetOrganization("sales");

  const [checkList, setCheckList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [users, setUsers] = useState([]);
  const [isUsersPending, setIsUsersPending] = useState(true);
  const [totalCouunt, setTotalCount] = useState();
  const [search, setSearch] = useState("");
  const [searchNum, setSearchNum] = useState("");
  const [deposit_status, setDepositStatus] = useState("전체");
  const [pay_amount, setPayAmount] = useState("전체");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [org_code, setOrgCode] = useState("전체");
  const [org_sales, setOrgSales] = useState([]);
  const [search_list, setSearchList] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [retiree, setRetiree] = useState("");

  const [orgMenuList, setOrgMenuList] = useState();

  const { organization, addOrganizationData } = useContext(OrganizationContext);

  useEffect(() => {
    if (org_code === "전체") return;

    const getOrganization = async (_type, _head_office) => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code: org_code === "전체" ? undefined : org_code,
          },
        })
      )?.data;

      if (res?.code === 200) setOrgSales(res?.data);
    };

    getOrganization();
  }, [org_code]);

  useEffect(() => {
    if (sales?.length === 0) return;
    const head_org = { 전체: "전체" };

    getOrgHeadOffice(sales, head_org);

    setOrgMenuList(head_org);
  }, [sales]);

  const getUsers = async (is_init) => {
    setLoading(true);
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
              status: retiree ? retiree : undefined,
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
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [page, organization, retiree]);

  return (
    <Layout loading={isUsersPending}>
      <Row sx={{ width: "100%", overflowY: "hidden" }}>
        <Column
          alignItems={"center"}
          sx={{
            minWidth: 246,
            display: {
              lg: "flex",
              md: orgOpen ? "flex" : "none",
              sm: orgOpen ? "flex" : "none",
              xs: orgOpen ? "flex" : "none",
            },
            position: {
              md: orgOpen ? "absolute" : "none",
              sm: orgOpen ? "absolute" : "none",
              xs: orgOpen ? "absolute" : "none",
            },
            zIndex: 1,
            background: "white",
            height: "100%",
            overflowY: "scroll",
            gap: 2,
            border: "1px solid #EFEFEF",
            pb: 5,
          }}
        >
          <Column sx={{ width: "100%", p: 1, mt: 1 }}>
            <Row
              justifyContent={"end"}
              sx={{
                display: {
                  lg: "none",
                  md: orgOpen ? "flex" : "none",
                  sm: orgOpen ? "flex" : "none",
                  xs: orgOpen ? "flex" : "none",
                },
              }}
            >
              <Image
                src="/black_x.png"
                width={15}
                height={15}
                alt=""
                onClick={() => setOrgOpen(false)}
              />
            </Row>
            <UnderLineSelectInput
              w={"100%"}
              title="조직명"
              menuItems={orgMenuList}
              value={org_code}
              setValue={setOrgCode}
            />
          </Column>
          <OrganizationList
            group_list={org_code === "전체" ? sales : org_sales}
            open
          />
        </Column>
        <Column sx={{ width: "100%", pl: 2 }}>
          <Row justifyContent={"end"} sx={{ width: "100%", mb: 2, gap: 1 }}>
            <Button
              text={"조직도 보기"}
              h={28}
              fs={"h5"}
              action={() => setOrgOpen(!orgOpen)}
              sx={{
                display: {
                  lg: "none",
                  md: "flex",
                  sm: "flex",
                  xs: "flex",
                },
              }}
            />
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
          <Row
            alignItems={"end"}
            sx={{
              widht: "100%",
              gap: 2,
              flexWrap: {
                lg: "nowrap",
                md: "nowrap",
                sm: "wrap",
                xs: "wrap",
              },
            }}
          >
            <LabelUnderLineInput
              id="name"
              title={"사원명"}
              w={{
                lg: "25%",
                md: "25%",
                sm: "100%",
                xs: "100%",
              }}
              placeholder="사원명으로 검색"
              onBlur={(e) => setName(e.target.value)}
            />
            <LabelUnderLineInput
              id="id"
              title={"아이디"}
              w={{
                lg: "25%",
                md: "25%",
                sm: "100%",
                xs: "100%",
              }}
              placeholder="아이디로 검색"
              onBlur={(e) => setId(e.target.value)}
            />
            <UnderLineSelectInput
              title={"전월 급여액"}
              w={{
                lg: "25%",
                md: "25%",
                sm: "100%",
                xs: "100%",
              }}
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
              w={{
                lg: "25%",
                md: "25%",
                sm: "100%",
                xs: "100%",
              }}
              menuItems={{
                전체: "전체",
                "입금 완료": "입금 완료",
                "입금 미완료": "입금 미완료",
              }}
              value={deposit_status}
              setValue={setDepositStatus}
            />
          </Row>
          <Row sx={{ mt: 2 }}>
            <UnderLineSelectInput
              title={"승인내역"}
              w={{
                lg: "25%",
                md: "25%",
                sm: "100%",
                xs: "100%",
              }}
              menuItems={{
                전체: "전체",
                승인: "승인",
                미승인: "미승인",
              }}
              value={deposit_status}
              setValue={setDepositStatus}
            />
          </Row>

          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ width: "100%", mb: 1, mt: 2 }}
          >
            <Row alignItems={"center"} sx={{ gap: 0.2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={(e) =>
                      e.target.checked ? setRetiree("퇴사자") : setRetiree("")
                    }
                  />
                }
                label={<Typography variant="h6">퇴사자만 보기</Typography>}
              />
            </Row>
            <Row sx={{ gap: 1 }}>
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
          </Row>
          {loading ? (
            <Row
              justifyContent="center"
              alignItems="center"
              sx={{
                width: "100%",
                height: "500px",
              }}
            >
              <CircularProgress size="40px" thickness={5} color="primary" />
            </Row>
          ) : (
            <AuthorityTable
              data={users}
              checkList={checkList}
              setCheckList={setCheckList}
            />
          )}
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
