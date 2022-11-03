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
import { getOrgWithManyUnit } from "../../src/utility/organization/getOrgWithUnit";
import UnderLineInput from "../../src/components/Input";
import OrganizationList from "../../src/components/OrganizationList/List";
import { useSnackbar } from "notistack";
import { OrganizationContext } from "../../src/contexts/OrganizationListContext";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import UnderLineSelectInput from "../../src/components/Input/Select";
import {
  getOrgWithNameGetCount,
  getOrgWithUnit,
} from "../../src/utility/organization/getOrgWithUnit";
import { getTitleOfOrg_name } from "../../src/utility/organization/getTitleOfOrg";
import { getReplaceMonth, getWeek } from "../../src/utility/date";

const moment = extendMoment(originalMoment);

export default function Db() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const el = useRef(null);
  const [user_info] = useState(getCookie("user_info"));

  //data
  const [menu_detail, setMenuDetail] = useState([]);
  const [db_list, setDbList] = useState([]);
  const { sales } = useGetOrganization("sales");
  const [rank] = useState(getCookie("user_info")?.grade);
  const [area, setArea] = useState([]);

  //change state
  const [is_search, setIsSearch] = useState(false);

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
  const [tableCount, setTableCount] = useState();
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("전체");
  const [org_code, setOrgCode] = useState("전체");
  const [head_coop, setHeadCoop] = useState("전체");
  const [sub_coop, setSubCoop] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [org_status, setOrgStatus] = useState("전체");
  const [allocated_user, setAllocatedUser] = useState("");
  const [showMyDb, setShowMyDb] = useState(true);
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

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [orgMenuList, setOrgMenuList] = useState({ 전체: "전체" });
  const [headCoopMenuList, setHeadCoopMenuList] = useState({ 전체: "전체" });
  const [subCoopMenuList, setSubCoopMenuList] = useState({ 전체: "전체" });
  const [uploaderMenuList, setUploaderMenuList] = useState({ 전체: "전체" });
  const [areaParentMenuList, setAreaParentMenuList] = useState({
    전체: "전체",
  });
  const [deninedMenuList, setDeninedMenuList] = useState({});

  const [areaChildMenuList, setAreaChildMenuList] = useState({ 전체: "전체" });

  const { openModal, closeModal } = useContext(ModalContext);
  const { organization, addOrganizationData, org_info, addOrganizationInfo } =
    useContext(OrganizationContext);

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
              page: _page ? _page : router.query.page,
              count: router.query.count,
              db_pk: router.query.menu,
              head_office_org_code:
                (rank === "협력사" || rank === "부협력사") &&
                head_coop === "전체"
                  ? undefined
                  : (rank === "협력사" || rank === "부협력사") &&
                    head_coop !== "전체"
                  ? head_coop
                  : head_office_org_code === "전체" ||
                    head_office_org_code === "미소속"
                  ? undefined
                  : router.query.head_office_org_code,
              org_code:
                router.query.org_code === "전체"
                  ? undefined
                  : router.query.org_code,
              for_me:
                user_info?.grade !== "관리자" &&
                user_info?.grade !== "부관리자" &&
                user_info?.grade !== "협력사" &&
                user_info?.grade !== "부협력사" &&
                showMyDb
                  ? showMyDb
                  : undefined,
              status:
                router.query.status === "전체"
                  ? undefined
                  : router.query.status,
              org_status:
                router.query.org_status === "전체"
                  ? undefined
                  : router.query.org_status,
              allocated_user: router.query.allocated_user
                ? router.query.allocated_user
                : undefined,
              uploader_organization_code:
                rank === "협력사" && sub_coop === "전체"
                  ? undefined
                  : rank === "협력사" && sub_coop !== "전체"
                  ? sub_coop
                  : uploader_organization_code === "전체"
                  ? undefined
                  : router.query.uploader_organization_code,
              without_afg:
                router.query.head_office_org_code === "미소속"
                  ? true
                  : undefined,
              geo_parent_name:
                router.query.geo_parent_name === "전체"
                  ? undefined
                  : router.query.geo_parent_name,
              geo_name:
                router.query.geo_name === "전체"
                  ? undefined
                  : router.query.geo_name,
              values: router.query.values,
              created_date_start:
                (rank === "협력사" || rank === "부협력사") && start_date
                  ? new Date(Number(router.query.created_date_start)).getTime()
                  : undefined,
              created_date_end:
                (rank === "협력사" || rank === "부협력사") && end_date
                  ? new Date(Number(router.query.created_date_end)).getTime()
                  : undefined,
              allocated_date_start:
                rank !== "협력사" && rank !== "부협력사" && start_date
                  ? new Date(
                      Number(router.query.allocated_date_start)
                    ).getTime()
                  : undefined,
              allocated_date_end:
                rank !== "협력사" && rank !== "부협력사" && end_date
                  ? new Date(Number(router.query.allocated_date_end)).getTime()
                  : undefined,
            },
          })
    )?.data;

    if (res?.code === 200) {
      setTotalCount(Math.ceil(res?.data.total_count / 20));
      setDbList(res?.data?.result);
      setTableCount(res?.data.total_count);
    }
    setIsSearch(false);
    setLoading(false);
  };

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

  useEffect(() => {
    if (!router.isReady) return;
    setOpen(false);
    setCheckData([]);

    //필터 초기화

    router.push(`db?menu=${router.query.menu}`);

    setPage(1);
    setOrgCode("전체");
    setHeadOfficeOrgCode("전체");
    setSubCoop("전체");
    setOrgStatus("전체");
    setHeadCoop("전체");
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

    [...document.querySelectorAll("#dynamic_input")].map((d) => (d.value = ""));

    const getDbMenu = async () => {
      const res = (
        await Axios.Get(
          `db/menu/${router.query.menu}?token=${getAccessToken()}`
        )
      )?.data;

      if (res?.code === 200) {
        setMenuDetail(res?.data);
        const head_org = { 전체: "전체", 미소속: "미소속" };
        const coop_org = { 전체: "전체" };
        const denined_org = {};

        res?.data?.organizations?.map((org) =>
          Object.assign(head_org, { [org?.code]: org?.name })
        );

        res?.data?.organizations?.map((org) =>
          Object.assign(denined_org, { [org?.code]: org?.name })
        );

        res?.data?.cooperation_organizations?.map((org) =>
          Object.assign(coop_org, { [org?.code]: org?.name })
        );

        setHeadOfficeMenuList(head_org);
        setUploaderMenuList(coop_org);
        setHeadCoopMenuList(coop_org);
        setDeninedMenuList(denined_org);

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

  // db 필터 목록
  useEffect(() => {
    if (head_office_org_code === "전체") return;
    const org = { 전체: "전체" };
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
        getOrgWithManyUnit(res?.data, "region", "team", org);

        setOrgMenuList(org);
      }
    };

    headOfficeBySales();
  }, [head_office_org_code]);

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

    setOrgMenuList(head_office);
  }, [sales]);

  //영업진 조직
  useEffect(() => {
    if (
      rank === "관리자" ||
      rank === "부관리자" ||
      rank === "본부장" ||
      rank === "지점장" ||
      rank === "협력사" ||
      rank === "부협력사"
    )
      return;
    if (!router.isReady) return;
    const org = { 전체: "전체" };
    const headOfficeBySales = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code: rank?.code,
          },
        })
      )?.data;

      if (res?.code === 200) {
        getOrgWithManyUnit(res?.data, "region", "team", org);

        setOrgMenuList(org);
      }
    };

    headOfficeBySales();
  }, [router.isReady]);

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

    router.push(`db?menu=${router.query.menu}`);

    setOrgCode("전체");
    setHeadOfficeOrgCode("전체");
    setSubCoop("전체");
    setOrgStatus("전체");
    setHeadCoop("전체");
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
    const getCooperation = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "cooperation",
            head_office_org_code: user_info?.head_office_org_code,
          },
        })
      )?.data;

      if (res?.code === 200) {
        const sub_org = { 전체: "전체" };

        getOrgWithUnit(res?.data, "region", sub_org);

        setSubCoopMenuList(sub_org);
      }
    };

    getCooperation();
  }, []);

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
    if (!open) return;
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
  }, [denied_org_code, open]);

  useEffect(() => {
    getDbDetail();
  }, [router.query]);

  useEffect(() => {
    if (!is_search) return;

    // console.log("start");
    // window.localStorage.removeItem("query");

    router.push(`db?menu=${
      router.query.menu
    }&page=${page}&count=${count}&head_office_org_code=${head_office_org_code}&org_code=${org_code}&status=${status}&without_afg=${
      head_office_org_code === "미소속" ? true : undefined
    }&org_status=${org_status}&allocated_user=${allocated_user}&uploader_organization_code=${uploader_organization_code}&geo_parent_name=${parent_area}&geo_name=${child_area}&values=${JSON.stringify(
      [...values].filter((v) => v?.value !== "")
    )}&created_date_start=${
      (rank === "협력사" || rank === "부협력사") && start_date
        ? new Date(start_date).getTime()
        : undefined
    }&created_date_end=${
      (rank === "협력사" || rank === "부협력사") && end_date
        ? new Date(end_date).getTime()
        : undefined
    }&allocated_date_start=${
      rank !== "협력사" && rank !== "부협력사" && start_date
        ? new Date(start_date).getTime()
        : undefined
    }&allocated_date_end=${
      rank !== "협력사" && rank !== "부협력사" && end_date
        ? new Date(end_date).getTime()
        : undefined
    }
      `);
  }, [page, is_search, showMyDb]);

  useEffect(() => {
    if (!router.query.page) return;
    window.localStorage.setItem("path", router.asPath);
  }, [router.query]);

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
              menuItems={deninedMenuList}
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
          <Row alignItems={"center"} justifyContent={"end"} sx={{ gap: 1 }}>
            <Button
              bgColor="secondary"
              text="필터 돌리기"
              color="primary.white"
              fs="h6"
              // w={110}
              h={28}
              action={() => {
                if (router.asPath === window.localStorage.path) return;
                setPage(router.query.page);
                router.push(window.localStorage.path);
              }}
            />
            <Button
              variant="contained"
              bgColor="primary"
              text="검색"
              color="primary.white"
              fs="h6"
              w={60}
              h={28}
              sx={{ zIndex: open ? -1 : 0 }}
              action={() => setIsSearch(true)}
            />
            <Button
              variant="contained"
              bgColor="gray"
              text="초기화"
              color="primary.white"
              fs="h6"
              w={60}
              h={28}
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
              rank !== "본부장" &&
              rank !== "협력사" &&
              rank !== "부협력사" && (
                <SelectInput
                  w="100%"
                  title="조직명"
                  menuItems={headOfficeMenuList}
                  value={head_office_org_code}
                  setValue={setHeadOfficeOrgCode}
                />
              )}
            {rank !== "협력사" &&
              rank !== "부협력사" &&
              rank !== "팀장" &&
              rank !== "담당자" && (
                <SelectInput
                  w="100%"
                  title="소속명"
                  menuItems={orgMenuList}
                  value={org_code}
                  setValue={setOrgCode}
                />
              )}

            {/* {(rank === "협력사" || rank === "부협력사") && (
              <SelectInput
                w="100%"
                title="협력사명"
                menuItems={headCoopMenuList}
                value={head_coop}
                setValue={setHeadCoop}
              />
            )} */}
            {rank === "협력사" && (
              <SelectInput
                w="100%"
                title="부협력사명"
                menuItems={subCoopMenuList}
                value={sub_coop}
                setValue={setSubCoop}
              />
            )}
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
            {rank !== "협력사" &&
              rank !== "부협력사" &&
              rank !== "부관리자" && (
                <SelectInput
                  w="100%"
                  title="등록처"
                  menuItems={uploaderMenuList}
                  value={uploader_organization_code}
                  setValue={setUploaderOrganizationCode}
                />
              )}

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
            {rank !== "협력사" && rank !== "부협력사" && (
              <LabelUnderLineInput
                w={"100%"}
                title={"담당자"}
                placeholder={"담당자명으로 검색하실 수 있습니다."}
                value={allocated_user}
                onChange={(e) => setAllocatedUser(e.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    setIsSearch(true);
                  }
                }}
              />
            )}
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
                    onBlur={(e) => {
                      setValues((prev) => {
                        const newData = [...prev];
                        const fieldObj = newData.filter(
                          (field) => field.field_pk === filter?.pk
                        );

                        if (filter?.property?.name === "연락처") {
                          fieldObj[0].value = e.target.value
                            ?.split("-")
                            ?.join("");
                        } else {
                          fieldObj[0].value = e.target.value;
                        }

                        return newData;
                      });
                    }}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") {
                        setValues((prev) => {
                          const newData = [...prev];
                          const fieldObj = newData.filter(
                            (field) => field.field_pk === filter?.pk
                          );

                          if (filter?.property?.name === "연락처") {
                            fieldObj[0].value = ev.target.value
                              ?.split("-")
                              ?.join("");
                          } else {
                            fieldObj[0].value = ev.target.value;
                          }

                          return newData;
                        });
                        setIsSearch(true);
                      }
                    }}
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
                      {rank === "협력사" || rank === "부협력사"
                        ? "등록일"
                        : "분배일"}
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
                              endDate: new Date().setDate(
                                new Date().getDate() + 1
                              ),
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
                              startDate: getWeek().weekStartDate,
                              endDate: getWeek().weekEndDate,
                            },
                          ])
                        }
                      />
                      <Button
                        text="이번달"
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
                                new Date(
                                  new Date().getFullYear(),
                                  new Date().getMonth(),
                                  1
                                )
                              ),
                              endDate: new Date(
                                new Date(
                                  new Date().getFullYear(),
                                  new Date().getMonth() + 1,
                                  1
                                )
                              ),
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
                                new Date().getFullYear(),
                                getReplaceMonth().getMonth(),
                                1
                              ),
                              endDate: new Date(
                                new Date().getFullYear(),
                                getReplaceMonth().getMonth() + 1,
                                1
                              ),
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
            sx={{ mb: "10px", gap: 1 }}
          >
            <Row alignItems={"center"} wrap={"wrap"} sx={{ gap: "5px" }}>
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
                      data: deninedMenuList,
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
                      rank === "협력사" ||
                      rank === "부협력사" ||
                      rank === "부관리자"
                        ? openModal({
                            modal: "upload",
                            content: {
                              title: "DB 대량 등록",
                              is_sample: true,
                              uploadUrl: `db/menu/excelupload/${router.query.menu}`,
                              // data: user_info?.org_code
                              reload: getDbDetail,
                            },
                            data: deninedMenuList,
                          })
                        : openModal({
                            modal: "change",
                            content: {
                              title: "DB 조직 선택",
                              contents: "DB를 선택하시겠습니까?",
                              buttonName: "선택",
                              type: "dbUpload",
                              reload: getDbDetail,
                            },
                            data: deninedMenuList,
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
                    rank === "부관리자"
                      ? openModal({
                          modal: "needconfirm",
                          content: {
                            contents: `자동분배를 진행하시겠습니까?`,
                            action: async () => {
                              const res = await Axios.Post(
                                "db/menu/distribute",
                                {
                                  token: getAccessToken(),
                                  db_pk: router.query.menu,
                                  org_code: user_info?.head_office_org_code,
                                }
                              );

                              if (res?.code === 200) {
                                closeModal();
                                enqueueSnackbar(
                                  "DB 자동분배가 완료되었습니다.",
                                  {
                                    variant: "success",
                                    autoHideDuration: 2000,
                                  }
                                );
                                getDbDetail();
                              }
                            },
                          },
                        })
                      : openModal({
                          modal: "change",
                          content: {
                            type: "changedb",
                            title: "DB 조직 선택",
                            contents: "DB를 선택하시겠습니까?",
                            buttonName: "선택",
                            buttonAction: async (select) => {
                              const res = await Axios.Post(
                                "db/menu/distribute",
                                {
                                  token: getAccessToken(),
                                  db_pk: router.query.menu,
                                  org_code: select,
                                }
                              );

                              if (res?.code === 200) {
                                enqueueSnackbar(
                                  "DB 자동분배가 완료되었습니다.",
                                  {
                                    variant: "success",
                                    autoHideDuration: 2000,
                                  }
                                );
                                closeModal();
                                getDbDetail();
                              }
                            },
                            reload: getDbDetail,
                          },
                          data: deninedMenuList,
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
                    if (checkData?.length === 0)
                      return enqueueSnackbar("선물할 DB를 선택해주세요", {
                        variant: "error",
                        autoHideDuration: 2000,
                      });

                    if (
                      !checkData
                        ?.map((c) =>
                          db_list?.find(
                            (db) =>
                              db?.pk === c &&
                              db?.allocated_user?.pk === user_info?.pk
                          )
                        )
                        .some((e) => e !== undefined)
                    ) {
                      return enqueueSnackbar("본인 DB가 아닙니다.", {
                        variant: "error",
                        autoHideDuration: 2000,
                      });
                    }

                    openModal({
                      modal: "gift",
                      data: checkData,
                    });
                  }}
                />
              )}
            </Row>
            <Row alignItems={"center"} sx={{ gap: 1 }}>
              {user_info?.grade !== "관리자" &&
                user_info?.grade !== "부관리자" &&
                user_info?.grade !== "협력사" &&
                user_info?.grade !== "부협력사" && (
                  <FormControlLabel
                    sx={{ mr: 0 }}
                    control={
                      <Checkbox
                        sx={{ width: 30 }}
                        checked={showMyDb}
                        onClick={() => {
                          setShowMyDb(!showMyDb);
                          setIsSearch(true);
                        }}
                      />
                    }
                    label={<Typography variant="h5">내 DB 조회 </Typography>}
                  />
                )}

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
                        geo_name:
                          child_area === "전체" ? undefined : child_area,
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
          </Row>
          <BojangTable
            openModal={openModal}
            closeModal={closeModal}
            header={menu_detail}
            data={db_list}
            page={page}
            checkData={checkData}
            setCheckData={setCheckData}
            count={tableCount}
          />
        </Column>
        <Row
          alignItems="center"
          justifyContent="center"
          sx={{ width: "100%", mt: 5, mb: 2 }}
        >
          <Pagination
            component="div"
            page={Number(router.query.page) || page}
            count={totalCount}
            onChange={(subject, newPage) => {
              setIsSearch(true);
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
