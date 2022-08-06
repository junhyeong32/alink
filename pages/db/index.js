import { useState, useContext } from "react";
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
  Radio,
} from "@mui/material";

import BojangTable from "../../src/components/Table/bojang";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../../src/components/Box/TopLableContents";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../../src/data/user";
import { argument_status } from "../../src/data/share/MenuByTextList";
import ExcelButton from "../../src/components/Button/Excel";
import {
  LabelUnderLineInput,
  DateInput,
  Date1,
} from "../../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import { styles } from "../../src/styles/bojang";
import { ModalContext } from "../../src/contexts/ModalContext";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import { useEffect } from "react";
import Axios from "../../src/utility/api";
import { getAccessToken, getCookie } from "../../src/utility/getCookie";
import GridBox from "../../src/components/Box/Grid";
import useGetArea from "../../src/hooks/setting/useGetArea";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import {
  getOrgWithUnit,
  getOrgHeadOffice,
} from "../../src/utility/organization/getOrgWithUnit";

const moment = extendMoment(originalMoment);

export default function Db() {
  const router = useRouter();

  //data
  const [menu_detail, setMenuDetail] = useState([]);
  const [db_list, setDbList] = useState([]);
  const { area } = useGetArea();
  const { sales } = useGetOrganization("sales");
  const [rank] = useState(getCookie("user_info")?.grade);

  //change state
  const [date_range, setDateRange] = useState(
    moment.range(moment().clone().subtract(7, "days"), moment().clone())
  );
  const [date, setDate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("전체");
  const [org_code, setOrgCode] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [org_status, setOrgStatus] = useState("전체");
  const [allocated_user, setAllocatedUser] = useState("");
  const [uploader_organization_code, setUploaderOrganizationCode] =
    useState("전체");
  const [parent_area, setParentArea] = useState("전체");
  const [child_area, setChildArea] = useState("전체");
  const [values, setValues] = useState([]);

  const [init, setInit] = useState(false);

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [orgMenuList, setOrgMenuList] = useState({ 전체: "전체" });
  const [uploaderMenuList, setUploaderMenuList] = useState({ 전체: "전체" });
  const [areaParentMenuList, setAreaParentMenuList] = useState({
    전체: "전체",
  });
  const [areaChildMenuList, setAreaChildMenuList] = useState({ 전체: "전체" });

  const { openModal, closeModal } = useContext(ModalContext);

  const getDbDetail = async (is_init) => {
    const newValues = values?.map(
      (v) =>
        v.value && Object.assign({}, { field_pk: v.field_pk, value: v.value })
    );
    const res = (
      is_init
        ? await Axios.Get(`db/list`, {
            params: {
              token: getAccessToken(),
            },
          })
        : await Axios.Get(`db/list`, {
            params: {
              token: getAccessToken(),
              page: page,
              count: count,
              head_office_org_code:
                head_office_org_code === "전체"
                  ? undefined
                  : head_office_org_code,
              org_code: org_code === "전체" ? undefined : org_code,
              status: status === "전체" ? undefined : status,
              org_status: org_status === "전체" ? undefined : org_status,
              allocated_user: allocated_user,
              uploader_organization_code:
                uploader_organization_code === "전체"
                  ? undefined
                  : uploader_organization_code,
              geo_parent_name: parent_area === "전체" ? undefined : parent_area,
              geo_name: child_area === "전체" ? undefined : child_area,
              values: newValues,
              created_date: date,
            },
          })
    )?.data;

    if (res?.code === 200) setDbList(res?.data?.result);
    setLoading(false);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const getDbMenu = async () => {
      const res = (
        await Axios.Get(
          `db/menu/${router.query.menu}?token=${getAccessToken()}`
        )
      )?.data;

      if (res?.code === 200) setMenuDetail(res?.data);
    };

    getDbDetail(true);
    getDbMenu();
  }, [router.isReady, router.query.menu]);

  useEffect(() => {
    if (menu_detail?.length === 0) return;

    setValues((prev) => {
      const newData = [...prev];

      menu_detail?.fields?.map((menu) =>
        newData.push({
          field_pk: menu?.property?.pk,
          value: "",
        })
      );

      return newData;
    });
  }, [menu_detail]);

  //지역구분
  useEffect(() => {
    setAreaParentMenuList((prev) => {
      const parent = { ...prev };

      area?.map((d, key) => {
        Object.assign(parent, { [d.parent]: d.parent });
      });
      return parent;
    });
  }, [area]);

  //소속
  useEffect(() => {
    if (sales?.length === 0) return;
    const head_org = {};
    const org = {};

    getOrgHeadOffice(sales, head_org);
    getOrgWithUnit(sales, "team", org);

    setHeadOfficeMenuList(head_org);
    setOrgMenuList(org);
  }, [sales]);

  // db 필터 목록
  useEffect(() => {
    if (head_office_org_code === "전체") return;
    const org = {};
    const headOfficeBySales = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code: head_office_org_code,
          },
        })
      )?.data;

      console.log("res", res);

      if (res?.code === 200) {
        console.log("res?.", res);
        getOrgWithUnit(res?.data, "region", org);

        setOrgMenuList(org);
      }
    };

    headOfficeBySales();
  }, [head_office_org_code]);

  //상세지역구분
  useEffect(() => {
    if (!parent_area) return;

    setAreaChildMenuList((prev) => {
      const child = { ...prev };

      area
        ?.filter((geomap) => geomap.parent === parent_area && geomap.name)
        ?.map((filter_area) => {
          filter_area?.children?.map((d) => {
            Object.assign(child, { [d]: d });
          });
        });

      return child;
    });
  }, [parent_area]);

  useEffect(() => {
    if (!init) return;
    Object.entries(document.querySelectorAll("#dynamic_input"))?.map(
      ([d, k]) => (k.value = "")
    );

    setOrgCode("전체");
    setHeadOfficeOrgCode("전체");
    setOrgStatus("전체");
    setUploaderOrganizationCode("전체");
    setAllocatedUser("");
    setParentArea("전체");
    setChildArea("전체");

    setInit(false);
  }, [init]);

  return (
    <Layout loading={loading}>
      <Column>
        {/* <Button variant="outlined" text="신청권한" fs="h6" w={80} h={20} /> */}
        <Column sx={{ rowGap: "15px", p: "40px 40px 0 40px" }}>
          <TopLabelContents
            title="인수상태"
            sx={styles.argument_status_contents}
          >
            {Object.entries(argument_status).map(
              ([list, color], key) =>
                key !== 6 && (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={status === list}
                        onClick={() => setStatus(list)}
                      />
                    }
                    label={
                      <RoundColorBox background={color}>
                        <Typography variant="h6">{list}</Typography>
                      </RoundColorBox>
                    }
                  />
                )
            )}
          </TopLabelContents>
          <Row justifyContent={"end"} sx={{ gap: 1 }}>
            <Button
              variant="contained"
              bgColor="primary"
              text="검색"
              color="primary.white"
              fs="h6"
              w={60}
              h={25}
              action={() => getDbDetail()}
            />
            <Button
              variant="contained"
              bgColor="gray"
              text="초기화"
              color="primary.white"
              fs="h6"
              w={60}
              h={25}
              action={() => {
                setInit(true);
                getDbDetail(true);
              }}
            />
          </Row>
          <GridBox
            itemCount={4}
            alignItems={"end"}
            sx={{ width: "100%", gap: 1 }}
          >
            <SelectInput
              w="100%"
              title="조직명"
              menuItems={headOfficeMenuList}
              value={head_office_org_code}
              setValue={setHeadOfficeOrgCode}
            />
            <SelectInput
              w="100%"
              title="소속명"
              menuItems={orgMenuList}
              value={org_code}
              setValue={setOrgCode}
            />
            <SelectInput
              w="100%"
              title="업체승인"
              menuItems={{
                전체: "전체",
                AS승인: "AS 승인",
                AS반려: "AS 반려",
              }}
              value={org_status}
              setValue={setOrgStatus}
            />
            <SelectInput
              w="100%"
              title="등록처"
              menuItems={uploaderMenuList}
              value={uploader_organization_code}
              setValue={setUploaderOrganizationCode}
            />
            <Row alignItems={"end"} sx={{ width: "100%" }}>
              <SelectInput
                title="지역"
                placeholder={"시도"}
                w={"50%"}
                menuItems={areaParentMenuList}
                value={parent_area}
                setValue={setParentArea}
              />
              <SelectInput
                w={"50%"}
                placeholder={"지역상세"}
                menuItems={areaChildMenuList}
                value={child_area}
                setValue={setChildArea}
              />
            </Row>
            <LabelUnderLineInput
              w={"100%"}
              title={"담당자"}
              placeholder={"담당자명(으)로 검색하실 수 있습니다."}
              value={allocated_user}
              onChange={(e) => setAllocatedUser(e.target.value)}
            />

            {menu_detail?.fields
              ?.filter((d) => d?.is_filter_shown === 1)
              ?.map((filter, key) => {
                return (
                  <LabelUnderLineInput
                    id="dynamic_input"
                    key={key}
                    w={"100%"}
                    title={filter?.property?.name}
                    placeholder={`${filter?.property?.name}(으)로 검색하실 수 있습니다.`}
                    // value={values?.[0]?.[key]?.value}
                    onBlur={(e) =>
                      setValues((prev) => {
                        const newData = [...prev];
                        const fieldObj = newData.filter(
                          (field) => field.field_pk === filter?.property?.pk
                        );
                        fieldObj[0].value = e.target.value;
                        return newData;
                      })
                    }
                  />
                );
              })}
            <DateInput
              value={date_range}
              setValue={setDateRange}
              textValue={date}
              w="100%"
              title={
                <>
                  <Row
                    alignItems={"center"}
                    wrap={"wrap"}
                    sx={{ gap: 1, whiteSpace: "nowrap" }}
                  >
                    등록일
                    <Button
                      text="금일"
                      bgColor={"gray"}
                      fs={"h6"}
                      color={"primary.white"}
                      h={14}
                      action={() => setDate(moment().format("YYYY-MM-DD"))}
                    />
                    <Button
                      text="어제"
                      bgColor={"gray"}
                      fs={"h6"}
                      color={"primary.white"}
                      h={14}
                      action={() =>
                        setDate(
                          moment().subtract(1, "days").format("YYYY-MM-DD")
                        )
                      }
                    />
                    <Button
                      text="이번주"
                      bgColor={"gray"}
                      fs={"h6"}
                      color={"primary.white"}
                      h={14}
                      action={() =>
                        setDate(
                          moment().subtract(7, "days").format("YYYY-MM-DD")
                        )
                      }
                    />
                    <Button
                      text="지난달"
                      bgColor={"gray"}
                      fs={"h6"}
                      color={"primary.white"}
                      h={14}
                      // action={() =>
                      //   setDate(
                      //     moment().subtract(7, "days").format("YYYY-MM-DD")
                      //   )
                      // }
                    />
                  </Row>
                </>
              }
            />
          </GridBox>
        </Column>

        <Column sx={{ mt: "15px" }}>
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Row sx={{ gap: "5px" }}>
              <Button
                text="조직변경"
                color="primary.white"
                fs="h6"
                w={90}
                h={28}
                action={() =>
                  openModal({
                    modal: "change",
                    content: {
                      contents: "자동분배를 진행하시겠습니까?",
                      data: {},
                    },
                  })
                }
              />
              {(rank === "관리자" ||
                rank === "협력사" ||
                rank === "부협력사") && (
                <>
                  <Button
                    bgColor="skyblue"
                    text="DB 등록"
                    color="primary.white"
                    fs="h6"
                    w={90}
                    h={28}
                    action={() =>
                      router.push(`/db/new-db?menu=${router.query.menu}`)
                    }
                  />
                  <Button
                    bgColor="excel"
                    text="DB 대량 등록"
                    color="primary.white"
                    fs="h6"
                    w={90}
                    h={28}
                    action={() => router.push("/new-db")}
                  />
                  <Button
                    text="DB 자동분배"
                    color="primary.white"
                    fs="h6"
                    w={90}
                    h={28}
                    action={() =>
                      openModal({
                        modal: "needConfirm",
                        content: {
                          contents: "자동분배를 진행하시겠습니까?",
                        },
                      })
                    }
                  />
                </>
              )}
            </Row>
            <ExcelButton
              action={async () =>
                window.open(
                  "https://alinkapi.afg.kr/api/v1/db/list?" +
                    Object.entries({
                      token: getAccessToken(),
                      page: page,
                      count: count,
                      head_office_org_code:
                        head_office_org_code === "전체"
                          ? undefined
                          : head_office_org_code,
                      org_code: org_code === "전체" ? undefined : org_code,
                      status: status,
                      org_status: org_status,
                      allocated_user: allocated_user,
                      uploader_organization_code: uploader_organization_code,
                      geo_parent_name:
                        parent_area === "전체" ? undefined : parent_area,
                      geo_name: child_area === "전체" ? undefined : child_area,
                      values: values,
                      created_date: date,
                    })
                      ?.map((e) => e.join("="))
                      .join("&"),
                  "_blank"
                )
              }
            />
          </Row>
          <BojangTable
            openModal={openModal}
            closeModal={closeModal}
            header={menu_detail}
            data={db_list?.filter((db) => db?.db_pk === router.query.menu)}
          />
        </Column>
      </Column>
    </Layout>
  );
}
