import { useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
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
  CircularProgress,
  Pagination,
} from "@mui/material";

import BojangTable from "../../src/components/Table/bojang";
import TopLabelContents from "../../src/components/Box/TopLableContents";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import { argument_status } from "../../src/data/share/MenuByTextList";
import ExcelButton from "../../src/components/Button/Excel";
import { LabelUnderLineInput, DateInput } from "../../src/components/Input";
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
import UnderLineInput from "../../src/components/Input";
import OrganizationList from "../../src/components/OrganizationList/List";
import { useSnackbar } from "notistack";
import { OrganizationContext } from "../../src/contexts/OrganizationListContext";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import UnderLineSelectInput from "../../src/components/Input/Select";
import { getOrgWithNameGetCount } from "../../src/utility/organization/getOrgWithUnit";
import { useTransition } from "react";

const moment = extendMoment(originalMoment);

export default function Db() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const el = useRef(null);

  //data
  const [menu_detail, setMenuDetail] = useState([]);
  const [db_list, setDbList] = useState([]);
  const { sales } = useGetOrganization("sales");
  const [rank] = useState(getCookie("user_info")?.grade);
  const [area, setArea] = useState([]);

  //change state
  const [date_range, setDateRange] = useState(
    moment.range(moment().clone().subtract(7, "days"), moment().clone())
  );
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [totalCount, setTotalCount] = useState();
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();

  const [denied_list_el, setDeniedListEl] = useState([]);
  const [denied_list, setDeniedList] = useState([]);
  const [init_denied_list, setInitDeniedList] = useState([]);
  const [denied_org_code, setDeniedOrgCode] = useState("T0000");

  const [checkData, setCheckData] = useState([]);
  const [search_list, setSearchList] = useState(1);

  const [denined_sales, setDeninedSales] = useState([]);
  const [deninedLoading, setDeniedLoading] = useState(false);

  //db 대량 등록 select org_code
  const [dbUploadOrgCode, setDbUploadOrgCode] = useState("");

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [orgMenuList, setOrgMenuList] = useState({ 전체: "전체" });
  const [uploaderMenuList, setUploaderMenuList] = useState({ 전체: "전체" });
  const [areaParentMenuList, setAreaParentMenuList] = useState({
    전체: "전체",
  });
  const [deninedHeadOfficeMenuList, setDeninedHeadOfficeMenuList] = useState(
    {}
  );
  const [areaChildMenuList, setAreaChildMenuList] = useState({ 전체: "전체" });

  const { openModal, closeModal } = useContext(ModalContext);
  const { organization, addOrganizationData, org_info, addOrganizationInfo } =
    useContext(OrganizationContext);

  const handleClose = (e) => {
    if (el.current && !el.current.contains(e.target)) {
      document.querySelector(".rdrCalendarWrapper").style.display = "none";
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [el]);

  useEffect(() => {
    if (date[0].startDate && !date[0].endDate) return;
    if (date[0].startDate)
      setStartDate(moment(date[0].startDate).format("YYYY-MM-DD"));
    if (date[0].endDate && String(date[0].endDate) !== "Invalid date")
      setEndDate(moment(date[0].endDate).format("YYYY-MM-DD"));
  }, [date]);

  const getDbDetail = async (is_init, _page) => {
    const res = (
      is_init
        ? await Axios.Get(`db/list`, {
            params: {
              token: getAccessToken(),
              db_pk: router.query.menu,
            },
          })
        : await Axios.Get(`db/list`, {
            params: {
              token: getAccessToken(),
              page: _page ? _page : page,
              count: count,
              db_pk: router.query.menu,
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
              values: JSON.stringify(
                [...values].filter((v) => v?.value !== "")
              ),
              created_date_start: start_date,
              created_date_end: end_date,
            },
          })
    )?.data;

    if (res?.code === 200) {
      setTotalCount(Math.ceil(res?.data.total_count / 20));
      setDbList(res?.data?.result);
    }

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

      if (res?.code === 200) {
        setMenuDetail(res?.data);
        setArea(res?.data?.geomap);
        setAreaParentMenuList(() => {
          const parent = { 전체: "전체" };
          res?.data?.geomap?.map((d, key) => {
            Object.assign(parent, { [d.name]: d.name });
          });
          return parent;
        });
      }
    };

    //필터 초기화
    [...document.querySelectorAll("#dynamic_input")].map((d) => (d.value = ""));

    getDbDetail(true);
    getDbMenu();
  }, [router.isReady, router.query.menu]);

  useEffect(() => {
    if (menu_detail?.length === 0) return;

    setValues((prev) => {
      const newData = [];

      menu_detail?.fields?.map((menu) =>
        newData.push({
          field_pk: menu?.pk,
          value: "",
        })
      );

      return newData;
    });
  }, [menu_detail]);

  //소속
  useEffect(() => {
    if (sales?.length === 0) return;
    const head_org = { 전체: "전체" };
    const denined_head_org = {};
    const org = { 전체: "전체" };

    getOrgHeadOffice(sales, head_org);
    getOrgHeadOffice(sales, denined_head_org);
    getOrgWithUnit(sales, "team", org);

    setHeadOfficeMenuList(head_org);
    setDeninedHeadOfficeMenuList(denined_head_org);
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

      if (res?.code === 200) {
        getOrgWithUnit(res?.data, "region", org);

        setOrgMenuList(org);
      }
    };

    headOfficeBySales();
  }, [head_office_org_code]);

  //상세지역구분
  useEffect(() => {
    if (!parent_area) return;

    setAreaChildMenuList(() => {
      const child = { 전체: "전체" };

      area
        ?.filter((geomap) => geomap.name === parent_area)
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
    setStartDate("");
    setEndDate("");
    setDate([
      {
        ...date.key,
        startDate: new Date(),
        endDate: null,
      },
    ]);

    setInit(false);
  }, [init]);

  useEffect(() => {
    const searchObj = {};
    if (search) {
      getOrgWithNameGetCount(sales, search, searchObj);
      if (JSON.stringify(searchObj) !== "{}") return setSearchList([searchObj]);
      setSearchList("검색결과가 없습니다.");
    }
  }, [search]);

  useEffect(() => {
    setDeniedLoading(true);
    setDeniedList([]);
    setInitDeniedList([]);
    const headOfficeBySales = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code: denied_org_code,
          },
        })
      )?.data;

      if (res?.code === 200) {
        setDeninedSales(res?.data);
      }
    };

    headOfficeBySales();

    setTimeout(() => setDeniedLoading(false), 1000);
  }, [denied_org_code]);

  useEffect(() => {
    const getDbDeniedList = async () => {
      const res = (
        await Axios.Get("db/denied", {
          params: {
            token: getAccessToken(),
            db_pk: router.query.menu,
            head_office_org_code: denied_org_code,
          },
        })
      )?.data;

      if (res?.code === 200) {
        setDeniedListEl((prev) => {
          const newData = [];
          res?.data.map((d) => newData.push(d?.name));

          return newData;
        });
        setDeniedList((prev) => {
          const newData = [];
          res?.data.map((d) => newData.push(d?.code));

          return newData;
        });
      }
    };

    getDbDeniedList();
  }, [denied_org_code]);

  return (
    <Layout
      loading={loading}
      sx={{ background: open ? "rgba(0, 0, 0, 0.5)" : "none" }}
    >
      <Column>
        {rank === "관리자" && (
          <Button
            w={80}
            h={28}
            variant={"outlined"}
            color="primary"
            fs="h5"
            text="DB제한"
            action={() => {
              setOpen(true);
            }}
          />
        )}
        <Row
          sx={{
            display: open ? "flex" : "none",
            position: "absolute",
            background: "#FFFFFF",
            zIndex: 1,
            ml: "-13px",
            top: 0,
          }}
        >
          <Column alignItems={"end"} sx={{ p: 1, gap: 2, minWidth: 201 }}>
            <UnderLineSelectInput
              w={"100%"}
              title="조직명"
              menuItems={deninedHeadOfficeMenuList}
              value={denied_org_code}
              setValue={setDeniedOrgCode}
            />
            <Button
              text="추가"
              w={52}
              h={28}
              fs="h5"
              action={() => {
                if (!org_info || !organization) {
                  return enqueueSnackbar("DB를 선택해주세요", {
                    variant: "error",
                    autoHideDuration: 2000,
                  });
                }
                setDeniedListEl((prev) => {
                  const newData = [...prev];
                  newData.push(org_info);

                  return newData;
                });
                setDeniedList((prev) => {
                  const newData = [...prev];
                  newData.push(organization);

                  return newData;
                });
              }}
            />
            <UnderLineInput
              w={"100%"}
              id="search"
              placeholder="검색"
              value={search}
              setValue={setSearch}
            />

            {deninedLoading || (search && search_list === 1) ? (
              <Row
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: "100%",
                  height: "100px",
                }}
              >
                <CircularProgress size="40px" thickness={5} color="primary" />
              </Row>
            ) : typeof search_list === "string" ? (
              <Row justifyContent={"center"} sx={{ width: "100%" }}>
                <Typography variant="h6" align="center">
                  {search_list}
                </Typography>
              </Row>
            ) : search && search_list !== 1 ? (
              <Column
                justifyContent={"start"}
                sx={{ gap: 1, width: "100%", p: 2 }}
              >
                {search_list?.map((result, key) => (
                  <>
                    <Typography
                      component={"span"}
                      variant="h6"
                      className="cursor"
                      sx={{
                        "&:hover": {
                          background: "#F0EFEF",
                        },
                      }}
                      onClick={() => {
                        addOrganizationData(result?.code);
                        addOrganizationInfo(result?.name);
                      }}
                      key={key}
                    >
                      - {result?.title}
                    </Typography>
                  </>
                ))}
              </Column>
            ) : (
              <OrganizationList
                group_list={denined_sales}
                open={open}
                absolute
              />
            )}
          </Column>

          <Column
            alignItems={"center"}
            sx={{ width: "300px", height: 900, p: "0 20px 77px 20px" }}
          >
            <Row justifyContent={"end"} sx={{ width: "100%", mt: 1 }}>
              <Image
                src="/black_x.png"
                width={15}
                height={15}
                alt="x"
                layout="fixed"
                className="cursor"
                onClick={() => setOpen(false)}
              />
            </Row>

            <Typography variant="h4" mb={2} mt={11.5}>
              {menu_detail?.title} 제한
            </Typography>
            <Column
              sx={{
                width: "100%",
                height: "90%",
                border: "3px solid #E2E2E2",
                borderㄲadius: "5px",
                p: 2,
              }}
            >
              {denied_list_el?.map((list, key) => (
                <Row
                  key={key}
                  alignItems={"center"}
                  justifyContent={"between"}
                  sx={{ gap: 1 }}
                >
                  <Typography variant="h6">{list}</Typography>

                  <Image
                    src="/cancel.png"
                    width={15}
                    height={15}
                    alt="x"
                    layout="fixed"
                    style={{ marginTop: "3px", cursor: "pointer" }}
                    onClick={() => {
                      setDeniedListEl((prev) => {
                        const newData = [...prev];
                        newData.splice(key, 1);

                        return newData;
                      });
                      setDeniedList((prev) => {
                        const newData = [...prev];
                        newData.splice(key, 1);

                        return newData;
                      });
                    }}
                  />
                </Row>
              ))}
            </Column>
            <Button
              text="저장"
              w={52}
              h={28}
              sx={{ mt: 2 }}
              fs="h5"
              action={async () => {
                if (!denied_org_code)
                  return enqueueSnackbar("조직을 선택해주세요", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                const res = await Axios.Post("db/denied", {
                  token: getAccessToken(),
                  db_pk: router.query.menu,
                  head_office_org_code: denied_org_code,
                  denied_organization_codes: denied_list.join(","),
                });

                if (res?.code === 200) {
                  enqueueSnackbar("저장되었습니다", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                  setOpen(false);
                }
              }}
            />
          </Column>
        </Row>
        <Column sx={{ rowGap: "15px", p: "40px 40px 0 40px" }}>
          <TopLabelContents
            title="인수상태"
            sx={styles.argument_status_contents}
          >
            {Object.entries(argument_status).map(
              ([list, color], key) =>
                key !== 6 && (
                  <FormControlLabel
                    sx={{ zIndex: open ? -1 : 0 }}
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
              sx={{ zIndex: open ? -1 : 0 }}
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
              sx={{ zIndex: open ? -1 : 0 }}
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
            {rank !== "담당자" &&
              rank !== "팀장" &&
              rank !== "지점장" &&
              rank !== "본부장" && (
                <SelectInput
                  w="100%"
                  title="조직명"
                  menuItems={headOfficeMenuList}
                  value={head_office_org_code}
                  setValue={setHeadOfficeOrgCode}
                />
              )}
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
              placeholder={"담당자명으로 검색하실 수 있습니다."}
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
                    onBlur={(e) =>
                      setValues((prev) => {
                        const newData = [...prev];
                        const fieldObj = newData.filter(
                          (field) => field.field_pk === filter?.pk
                        );
                        fieldObj[0].value = e.target.value;
                        return newData;
                      })
                    }
                  />
                );
              })}
            <div ref={el}>
              <DateInput
                value={date}
                setValue={setDate}
                textValue={date}
                startValue={start_date}
                endValue={end_date}
                w="100%"
                title={
                  <>
                    <Row
                      alignItems={"center"}
                      wrap={"wrap"}
                      sx={{
                        gap: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      등록일
                      <Button
                        text="금일"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        sx={{ zIndex: open ? -1 : 0 }}
                        action={() =>
                          setDate([
                            {
                              ...date.key,
                              startDate: new Date(),
                              endDate: new Date(),
                            },
                          ])
                        }
                      />
                      <Button
                        text="어제"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        sx={{ zIndex: open ? -1 : 0 }}
                        action={() =>
                          setDate([
                            {
                              ...date.key,
                              startDate: new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              ),
                              endDate: new Date(),
                            },
                          ])
                        }
                      />
                      <Button
                        text="이번주"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        sx={{ zIndex: open ? -1 : 0 }}
                        action={() =>
                          setDate([
                            {
                              ...date.key,
                              startDate: new Date(
                                new Date().setDate(new Date().getDate() - 7)
                              ),
                              endDate: new Date(),
                            },
                          ])
                        }
                      />
                      <Button
                        text="지난달"
                        bgColor={"gray"}
                        fs={"h6"}
                        color={"primary.white"}
                        h={14}
                        sx={{ zIndex: open ? -1 : 0 }}
                        action={() =>
                          setDate([
                            {
                              ...date.key,
                              startDate: new Date(
                                new Date().setMonth(new Date().getMonth() - 1)
                              ),
                              endDate: new Date(),
                            },
                          ])
                        }
                      />
                    </Row>
                  </>
                }
              />
            </div>
          </GridBox>
        </Column>
        <Column sx={{ mt: "15px" }}>
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Row sx={{ gap: "5px" }}>
              {rank === "관리자" && (
                <Button
                  variant={"outlined"}
                  text="DB 조직변경"
                  sx={{ border: "2px solid black" }}
                  fs="h6"
                  color="primary"
                  // w={90}
                  h={28}
                  action={() => {
                    if (checkData.length === 0)
                      return enqueueSnackbar("변경할 DB를 선택해주세요", {
                        variant: "error",
                        autoHideDuration: 2000,
                      });

                    openModal({
                      modal: "change",
                      content: {
                        title: "DB 조직 변경",
                        contents: "DB를 변경하시겠습니까?",
                        buttonName: "변경",
                        list: checkData.join(","),
                      },
                      data: headOfficeMenuList,
                    });
                  }}
                />
              )}
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
                    action={() => {
                      openModal({
                        modal: "change",
                        content: {
                          title: "DB 조직 선택",
                          contents: "DB를 선택하시겠습니까?",
                          buttonName: "선택",
                          type: "dbUpload",
                          reload: getDbDetail,
                        },
                        data: headOfficeMenuList,
                      });
                    }}
                  />
                </>
              )}
              {(rank === "관리자" || rank === "부관리자") && (
                <Button
                  text="DB 자동분배"
                  color="primary.white"
                  fs="h6"
                  w={90}
                  h={28}
                  action={() => {
                    openModal({
                      modal: "change",
                      content: {
                        type: "changedb",
                        title: "DB 조직 선택",
                        contents: "DB를 선택하시겠습니까?",
                        buttonName: "선택",
                        buttonAction: async (select) => {
                          const res = await Axios.Post("db/menu/distribute", {
                            token: getAccessToken(),
                            db_pk: router.query.menu,
                            org_code: select,
                          });

                          if (res?.code === 200) {
                            enqueueSnackbar("DB 자동분배가 완료되었습니다.", {
                              variant: "success",
                              autoHideDuration: 2000,
                            });
                            closeModal();
                            getDbDetail();
                          }
                        },
                        reload: getDbDetail,
                      },
                      data: headOfficeMenuList,
                    });
                  }}
                />
              )}

              {(rank === "관리자" ||
                rank === "협력사" ||
                rank === "부협력사") && (
                <Button
                  bgColor="primary"
                  text="녹취 파일 대량 업로드"
                  color="primary.white"
                  fs="h6"
                  // w={110}
                  h={28}
                  action={() =>
                    openModal({
                      modal: "multipleupload",
                      content: {
                        title: "녹음 파일 대량 업로드",
                        is_sample: false,
                        fileType: "audio/*",
                      },
                    })
                  }
                />
              )}
              {(rank === "본부장" ||
                rank === "지점장" ||
                rank === "팀장" ||
                rank === "담당자") && (
                <Button
                  bgColor="primary"
                  text="DB 선물하기"
                  color="primary.white"
                  fs="h6"
                  w={90}
                  h={28}
                  action={() => {
                    //TODO
                    // 태웅이 형, [Aug 12, 2022 2:43:45 PM]:
                    // 그래서 애초에 담당자가 내가 아닌경우에

                    // 선물하기 버튼 누르면 가냥 안된다

                    // 띄워달라는가

                    // if (checkData.length === 0)
                    //   return enqueueSnackbar("선물할 DB를 선택해주세요", {
                    //     variant: "error",
                    //     autoHideDuration: 2000,
                    //   });
                    if (checkData?.length === 0)
                      return enqueueSnackbar("DB를 선택해주세요", {
                        variant: "error",
                        autoHideDuration: 2000,
                      });

                    openModal({
                      modal: "gift",
                      data: checkData,
                    });
                  }}
                />
              )}
            </Row>
            <ExcelButton
              sx={{ zIndex: open ? -1 : 0 }}
              action={async () => {
                window.open(
                  "https://alinkapi.afg.kr/api/v1/db/list?" +
                    Object.entries({
                      token: getAccessToken(),
                      page: page,
                      count: count,
                      db_pk: router.query.menu,
                      head_office_org_code:
                        head_office_org_code === "전체"
                          ? undefined
                          : head_office_org_code,
                      org_code: org_code === "전체" ? undefined : org_code,
                      status: status === "전체" ? undefined : status,
                      org_status:
                        org_status === "전체" ? undefined : org_status,
                      allocated_user: allocated_user,
                      uploader_organization_code:
                        uploader_organization_code === "전체"
                          ? undefined
                          : uploader_organization_code,
                      geo_parent_name:
                        parent_area === "전체" ? undefined : parent_area,
                      geo_name: child_area === "전체" ? undefined : child_area,
                      values: JSON.stringify(
                        [...values].filter((v) => v?.value !== "")
                      ),
                      created_date_start:
                        new Date(start_date).getTime() || undefined,
                      created_date_end:
                        new Date(end_date).getTime() || undefined,
                      excel: 1,
                    })
                      ?.map((e) => e.join("="))
                      .join("&"),
                  "_blank"
                );
              }}
            />
          </Row>
          <BojangTable
            openModal={openModal}
            closeModal={closeModal}
            header={menu_detail}
            data={db_list}
            checkData={checkData}
            setCheckData={setCheckData}
          />
        </Column>
        <Row
          alignItems="center"
          justifyContent="center"
          sx={{ width: "100%", mt: 5, mb: 2 }}
        >
          <Pagination
            component="div"
            page={page}
            count={totalCount}
            onChange={(subject, newPage) => {
              getDbDetail(false, newPage);
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
