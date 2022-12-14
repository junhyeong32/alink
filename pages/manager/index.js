import { useState, memo, useEffect } from "react";
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
  Pagination,
} from "@mui/material";

import { LabelUnderLineInput } from "../../src/components/Input";
import SelectInput from "../../src/components/Input/Select";
import ManagerTable from "../../src/components/Table/manager";
import Button from "../../src/components/Button";
import Axios from "../../src/utility/api";
import useGetUsers from "../../src/hooks/user/useGetUsers";
import { useTransition } from "react";
import { getCookie } from "../../src/utility/getCookie";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import {
  getOrgByOfficeNameWithUnit,
  getOrgWithManyUnit,
} from "../../src/utility/organization/getOrgWithUnit";
import { getTitleOfOrg_name } from "../../src/utility/organization/getTitleOfOrg";
import useGetMenus from "../../src/hooks/setting/useGetMenus";

export default memo(function User() {
  const router = useRouter();
  const [user_info] = useState(getCookie("user_info"));
  const [rank] = useState(getCookie("user_info")?.grade);

  const [checkList, setCheckList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [org_code, setOrgCode] = useState("전체");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [headOfficeMenuItems, setHeadOfficeMenuItems] = useState({});

  const { sales } = useGetOrganization("sales");
  const { users, allocation_total, getUsers, isUsersPending, totalCouunt } =
    useGetUsers({ page, count, org_code, email, id, name, phone });
  const { menus } = useGetMenus();

  const handleInit = () => {
    // const doucument.
    // console.log()

    setOrgCode("전체");
    setEmail("");
    setId("");
    setName("");
    setPhone("");

    getUsers("전체", true);
  };

  useEffect(() => {
    const head_office = { 전체: "전체" };
    if (sales?.length !== 0 && rank === "지점장") {
      const getOrg = (orgs, unit1, unit2, result) => {
        for (let org of orgs) {
          getOrg(org.children, unit1, unit2, result);

          if (
            org?.branch_name === user_info?.branch &&
            (org.unit === unit1 || org.unit === unit2)
          ) {
            Object.assign(result, {
              [org.code]: getTitleOfOrg_name(org),
            });
          }
        }
      };
      getOrg(sales, "branch", "team", head_office);
    } else if (sales?.length !== 0 && rank === "본부장") {
      const getOrg = (orgs, unit1, unit2, result) => {
        for (let org of orgs) {
          getOrg(org.children, unit1, unit2, result);

          if (
            org?.region_name === user_info?.region &&
            (org.unit === unit1 || org.unit === unit2)
          ) {
            Object.assign(result, {
              [org.code]: getTitleOfOrg_name(org),
            });
          }
        }
      };
      getOrg(sales, "branch", "team", head_office);
    }

    setHeadOfficeMenuItems(head_office);
  }, [sales]);

  return (
    <Layout loading={isUsersPending}>
      <Column>
        <Column sx={{ rowGap: "15px" }}>
          <Row
            justifyContent={"end"}
            sx={{
              display: { lg: "none", md: "none", sm: "none", xs: "flex" },
            }}
          >
            <Button
              text="검색"
              variant="contained"
              bgColor={"primary"}
              color="primary.white"
              fs="h6"
              w={60}
              h={28}
              action={() => getUsers()}
            />
            <Button
              text="초기화"
              variant="contained"
              bgColor={"gray"}
              color="primary.white"
              fs="h6"
              w={60}
              h={28}
              action={handleInit}
            />
          </Row>
          <Row justifyContent={"between"}>
            <Row
              sx={{
                gap: "35px",
                width: {
                  lg: "74.5%",
                  md: "74.5%",
                  sm: "74.5%",
                  xs: "100%",
                },
              }}
            >
              {rank !== "팀장" && rank !== "담당자" && (
                <SelectInput
                  title="소속명"
                  menuItems={headOfficeMenuItems}
                  value={org_code}
                  setValue={setOrgCode}
                  w={{
                    lg: "31.2%",
                    md: "60.5%",
                    sm: "60.5%",
                    xs: "100%",
                  }}
                />
              )}
            </Row>
            <Row sx={{ gap: 1 }}>
              <Button
                text="검색"
                variant="contained"
                bgColor={"primary"}
                color="primary.white"
                fs="h6"
                w={60}
                h={28}
                sx={{
                  display: { lg: "flex", md: "flex", sm: "flex", xs: "none" },
                }}
                action={() => getUsers()}
              />
              <Button
                text="초기화"
                variant="contained"
                bgColor={"gray"}
                color="primary.white"
                fs="h6"
                w={60}
                h={28}
                sx={{
                  display: { lg: "flex", md: "flex", sm: "flex", xs: "none" },
                }}
                action={handleInit}
              />
            </Row>
          </Row>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: {
                lg: "nowrap",
                md: "wrap",
                sm: "wrap",
                xs: "wrap",
              },
              gap: "35px",
            }}
          >
            <LabelUnderLineInput
              title="이메일"
              placeholder={"이메일로 검색하실 수 있습니다."}
              value={email}
              setValue={setEmail}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getUsers();
                }
              }}
            />
            <LabelUnderLineInput
              title="아이디"
              placeholder={"아이디로 검색하실 수 있습니다."}
              value={id}
              setValue={setId}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getUsers();
                }
              }}
            />
            <LabelUnderLineInput
              title="이용자명"
              placeholder={"성명으로 검색하실 수 있습니다."}
              value={name}
              setValue={setName}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getUsers();
                }
              }}
            />
            <LabelUnderLineInput
              title="연락처"
              placeholder={"연락처로 검색하실 수 있습니다."}
              value={phone}
              setValue={setPhone}
              w={{
                lg: "25%",
                md: "45%",
                sm: "45%",
                xs: "100%",
              }}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getUsers();
                }
              }}
            />
          </Box>
          <Row alignItems={"center"} justifyContent={"end"} sx={{ mb: "15px" }}>
            {/* <ExcelButton action={() => setExcel("1")} /> */}
          </Row>
        </Column>

        <ManagerTable
          data={users}
          allocation_total={allocation_total}
          menus={menus}
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
