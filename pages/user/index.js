import { useState, useContext, useEffect, memo } from "react";
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
  FormControlLabel,
  Pagination,
} from "@mui/material";

import UserTable from "../../src/components/Table/user";

import TopLabelContents from "../../src/components/Box/TopLableContents";
import RoundColorBox from "../../src/components/Box/RoundColorBox";

import {
  status_list,
  rank_list,
  argument_status,
} from "../../src/data/share/MenuByTextList";
import ExcelButton from "../../src/components/Button/Excel";
import Input, { LabelUnderLineInput } from "../../src/components/Input";
import SelectInput from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import { ModalContext } from "../../src/contexts/ModalContext";
import useGetUsers from "../../src/hooks/user/useGetUsers";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import useGetArea from "../../src/hooks/setting/useGetArea";
import {
  getOrgHeadOffice,
  getOrgWithManyUnit,
} from "../../src/utility/organization/getOrgWithUnit";
import Axios from "../../src/utility/api";
import { getAccessToken, getCookie } from "../../src/utility/getCookie";
import { useSnackbar } from "notistack";

export default memo(function User() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  //menuItems
  const [areaMenuItems, setAreaMenuItems] = useState([]);
  const [salesMenuItems, setSalesMenuItems] = useState({});
  const [headOfficeMenuItems, setHeadOfficeMenuItems] = useState({});

  //filter
  const [rank] = useState(getCookie("user_info")?.grade);

  const [org_code_by_sales, setOrgCodeBySales] = useState([]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [status, setStatus] = useState("전체");
  const [grade, setGrade] = useState("전체");
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("전체");
  const [org_code, setOrgCode] = useState("전체");
  const [geo, setGeo] = useState(0);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [excel, setExcel] = useState();
  const [is_search, setIsSearch] = useState(false);

  const [loading, setLoading] = useState(true);

  const { org_pending, sales } = useGetOrganization("sales");
  // const { cooperation } = useGetOrganization("cooperation");

  const { users, allocation_total, getUsers, isUsersPending, totalCouunt } =
    useGetUsers({
      page,
      count,
      status,
      grade,
      head_office_org_code,
      org_code,
      geo,
      email,
      id,
      name,
      phone,
      excel,
      is_search,
      setExcel,
      areaMenuItems,
    });

  //data

  // const { openModal, closeModal, modalContent } = useContext(ModalContext);

  const handleInit = () => {
    setStatus("전체");
    setGrade("전체");
    setHeadOfficeOrgCode("");
    setOrgCode("");
    setGeo("");
    setEmail("");
    setId("");
    setName("");
    setPhone("");
    setExcel("");

    getUsers(true);
  };

  useEffect(() => {
    const getParentArea = async () => {
      const res = (
        await Axios.Get(`db/geomap_parent?token=${getAccessToken()}`)
      )?.data;
      if (res?.code === 200) {
        setAreaMenuItems(["전체", ...res?.data]);
      }
    };

    getParentArea();
  }, []);

  useEffect(() => {
    if (org_code === "전체") return;
    const getOrgCodeByData = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code: org_code !== "전체" ? org_code : undefined,
          },
        })
      )?.data;

      if (res?.code === 200) {
        setOrgCodeBySales(res?.data);
      }
    };

    getOrgCodeByData();
  }, [org_code]);

  useEffect(() => {
    const head_org = { 전체: "전체" };
    if (sales?.length !== 0) {
      getOrgHeadOffice(sales, head_org);
    }

    setSalesMenuItems(head_org);
  }, [sales]);

  useEffect(() => {
    const head_result = { 전체: "전체" };
    if (org_code !== "전체") {
      getOrgWithManyUnit(org_code_by_sales, "region", "team", head_result);
    }
    setHeadOfficeMenuItems(head_result);
  }, [org_code_by_sales, org_code]);

  useEffect(() => {
    if (!org_pending && !isUsersPending) {
      setLoading(false);
    }
  }, [org_pending, isUsersPending]);

  // useEffect(() => {
  //   router.

  // },[head_office_org_code])

  console.log("areaMenuItems", areaMenuItems);

  return (
    <Layout loading={loading}>
      <Column>
        <Column sx={{ rowGap: "15px" }}>
          <TopLabelContents
            title="상태"
            sx={{
              pl: {
                lg: 10,
                md: 3,
                sm: 3,
                xs: 1,
              },
            }}
          >
            {Object.entries(status_list).map(([list, color], key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={list === status}
                    onClick={() => setStatus(list)}
                  />
                }
                label={
                  <RoundColorBox background={color}>
                    <Typography variant="h6">{list}</Typography>
                  </RoundColorBox>
                }
              />
            ))}
          </TopLabelContents>
          <TopLabelContents
            title="등급"
            sx={{
              pl: {
                lg: 10,
                md: 3,
                sm: 3,
                xs: 1,
              },
            }}
          >
            {Object.entries(rank_list).map(([list, color], key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={list === grade}
                    onClick={() => setGrade(list)}
                  />
                }
                label={
                  <RoundColorBox background={color}>
                    <Typography variant="h6">{list}</Typography>
                  </RoundColorBox>
                }
              />
            ))}
          </TopLabelContents>
          <Row
            justifyContent={"end"}
            sx={{
              width: "100%",
              gap: 1,
              display: {
                lg: "none",
                md: "flex",
                sm: "flex",
                xs: "flex",
              },
            }}
          >
            <Button
              text="검색"
              bgColor={"primary"}
              fs={"h6"}
              color="primary.white"
              w={60}
              h={28}
              action={getUsers}
            />
            <Button
              text="초기화"
              bgColor={"gray"}
              fs={"h6"}
              color="primary.white"
              w={60}
              h={28}
              action={handleInit}
            />
          </Row>
          <Row wrap={"wrap"} justifyContent={"between"} sx={{ gap: 3 }}>
            <Column
              sx={{
                width: { lg: "23%", md: "45%", sm: "45%", xs: "100%" },
                gap: 1.5,
              }}
            >
              <SelectInput
                title="조직명"
                menuItems={salesMenuItems}
                w="100%"
                value={org_code}
                setValue={setOrgCode}
              />
              <LabelUnderLineInput
                title="이메일"
                placeholder={"이메일로 검색하실 수 있습니다."}
                w="100%"
                value={email}
                setValue={setEmail}
              />
            </Column>
            <Column
              sx={{
                width: { lg: "23%", md: "45%", sm: "45%", xs: "100%" },
                gap: 1.5,
              }}
            >
              <SelectInput
                title="소속명"
                menuItems={headOfficeMenuItems}
                w="100%"
                value={head_office_org_code}
                setValue={setHeadOfficeOrgCode}
              />

              <LabelUnderLineInput
                title="아이디"
                placeholder={"아이디로 검색하실 수 있습니다."}
                w="100%"
                value={id}
                setValue={setId}
              />
            </Column>
            <Column
              sx={{
                width: { lg: "23%", md: "45%", sm: "45%", xs: "100%" },
                gap: 1.5,
              }}
            >
              <SelectInput
                title="지역"
                menuItems={areaMenuItems}
                w="100%"
                value={geo}
                setValue={setGeo}
              />
              <LabelUnderLineInput
                title="이용자명"
                placeholder={"성명으로 검색하실 수 있습니다."}
                w="100%"
                value={name}
                setValue={setName}
              />
            </Column>
            <Column
              alignItems={"end"}
              sx={{
                width: { lg: "23%", md: "45%", sm: "45%", xs: "100%" },
                gap: 1.5,
              }}
            >
              <Row sx={{ gap: 1 }}>
                <Button
                  text="검색"
                  bgColor={"primary"}
                  fs={"h6"}
                  color="primary.white"
                  w={60}
                  h={28}
                  action={() => setIsSearch(!is_search)}
                  sx={{
                    display: {
                      lg: "flex",
                      md: "none",
                      sm: "none",
                      xs: "none",
                    },
                  }}
                />
                <Button
                  text="초기화"
                  bgColor={"gray"}
                  fs={"h6"}
                  color="primary.white"
                  w={60}
                  h={28}
                  sx={{
                    display: {
                      lg: "flex",
                      md: "none",
                      sm: "none",
                      xs: "none",
                    },
                  }}
                  action={handleInit}
                />
              </Row>
              <LabelUnderLineInput
                title="연락처"
                placeholder={"연락처로 검색하실 수 있습니다."}
                w="100%"
                sx={{ mt: { lg: 4 } }}
                value={phone}
                setValue={setPhone}
              />
            </Column>
          </Row>

          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "15px" }}
          >
            {rank === "관리자" && (
              <Button
                text="신규 아이디 생성"
                bgColor={"skyblue"}
                fs={"h6"}
                color="primary.white"
                h={28}
                action={() => router.push("user/new-id")}
              />
            )}

            {rank === "부관리자" && (
              <Button
                text="DB수량 초기화"
                bgColor={"skyblue"}
                fs={"h6"}
                color="primary.white"
                h={28}
                action={async () => {
                  const res = await Axios.Post("member/reset", {
                    token: getAccessToken(),
                  });

                  if (res?.code === 200) {
                    getUsers();
                    enqueueSnackbar("삭제되었습니다.", {
                      variant: "success",
                      autoHideDuration: 2000,
                    });
                  }
                }}
              />
            )}

            <ExcelButton sx={{ zIndex: 0 }} action={() => setExcel("1")} />
          </Row>
        </Column>

        <UserTable
          data={users}
          allocation_total={allocation_total}
          getUsers={getUsers}
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
    </Layout>
  );
});
