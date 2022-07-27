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

export default memo(function User() {
  const router = useRouter();
  //menuItems
  const [areaMenuItems, setAreaMenuItems] = useState({});
  const [salesMenuItems, setSalesMenuItems] = useState({});
  const [coopMenuItems, setCoopMenuItems] = useState({});

  //filter

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [status, setStatus] = useState("전체");
  const [grade, setGrade] = useState("전체");
  const [head_office_org_code, setHead_office_org_code] = useState("");
  const [org_code, setOrgCode] = useState("");
  const [geo, setGeo] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [excel, setExcel] = useState();

  const { org_pending, sales } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");
  const { area } = useGetArea();

  const { users, allocation_total, getUsers, isUsersPending, totalCouunt } =
    useGetUsers(
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
      excel
    );

  //data

  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  const handleInit = () => {
    setStatus("전체");
    setGrade("전체");
    setHead_office_org_code("");
    setOrgCode("");
    setGeo("");
    setEmail("");
    setId("");
    setName("");
    setPhone("");
    setExcel("");
  };

  useEffect(() => {
    setAreaMenuItems(() => {
      const obj = {};
      area?.map((d, key) => {
        Object.assign(obj, { [d.parent]: d.parent });
      });
      return obj;
    });
  }, [area]);

  useEffect(() => {
    setSalesMenuItems(() => {
      const obj = {};
      sales?.map((org, key) => {
        Object.assign(obj, { [org.code]: org.name });
      });
      return obj;
    });
  }, [sales]);

  useEffect(() => {
    const result = {};
    const getOrganiztionList = (el) => {
      if (!el) {
        cooperation?.[0]?.children.map((child) => {
          Object.assign(result, { [child.code]: child.name });
          return getOrganiztionList((el = child));
        });
      } else {
        el.children.map((child_el) => {
          Object.assign(result, { [child_el.code]: child_el.name });

          return getOrganiztionList((el = child_el));
        });
      }
    };
    getOrganiztionList();
    setCoopMenuItems(result);
  }, [org_pending]);

  return (
    <Layout loading={coopMenuItems.length === 0 || isUsersPending}>
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
              h={20}
              action={getUsers}
            />
            <Button
              text="초기화"
              bgColor={"gray"}
              fs={"h6"}
              color="primary.white"
              w={60}
              h={20}
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
              <SelectInput title="조직명" menuItems={salesMenuItems} w="100%" />
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
              <SelectInput title="소속명" menuItems={coopMenuItems} w="100%" />
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
                  h={20}
                  action={getUsers}
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
                  h={20}
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
            <Button
              text="신규 아이디 생성"
              bgColor={"skyblue"}
              fs={"h6"}
              color="primary.white"
              h={20}
              action={() => router.push("user/new-id")}
            />

            <ExcelButton action={() => setExcel("1")} />
          </Row>
        </Column>

        <UserTable data={users} allocation_total={allocation_total} />
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
