import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";
import {
  LabelOutLineSelectInput,
  OutLineSelectInput,
} from "../src/components/Input/Select";
import Button from "../src/components/Button";
import Image from "next/image";
import Axios from "../src/utility/api";
import { getAccessToken, getCookie } from "../src/utility/getCookie";
import useGetOrganization from "../src/hooks/share/useGetOrganization";
import {
  getOrgByParentRank,
  getOrgHeadOffice,
  getOrgWithUnit,
  getOrgWithTeam,
  getOrgByOfficeNameWithUnit,
  getOrgWithUnitName,
} from "../src/utility/organization/getOrgWithUnit";
import useGetArea from "../src/hooks/setting/useGetArea";
import Carousel from "nuka-carousel";
import CooperationTable from "../src/components/Table/data-status/CooperationTable";
import { useTransition } from "react";
import { ModalContext } from "../src/contexts/ModalContext";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function Index({ getCookies }) {
  const router = useRouter();
  const [user_info] = useState(getCookie("user_info"));
  const [cookies, setCookie] = useCookies();

  //data
  const [dashboard_list, setDashBoardList] = useState([]);
  const [dashboard_coop_list, setDashBoardCoopList] = useState([]);
  const { sales } = useGetOrganization("sales");
  const { area } = useGetArea();

  //state
  const [org_code_by_sales, setOrgCodeBySales] = useState([]);
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("전체");
  const [loading, startTransition] = useTransition();
  const [cookieAction, setCookieAction] = useState("");
  const [cookie_list, setCookieList] = useState([]);
  //TODO
  //이거 기본값 안넣어주면 오류남
  // 물어보기
  const [org_code, setOrgCode] = useState("전체");
  const [branch, setBranch] = useState("전체");

  const [geo_name, setGeoName] = useState("전체");
  const [date, setDate] = useState(0);
  const [send_date, setSendDate] = useState(new Date().getMonth + 1);
  const [rank] = useState(getCookie("user_info")?.grade);
  const [reset, setReset] = useState(false);

  const [orgMenuList, setOrgMenuList] = useState({ 전체: "전체" }); //조직
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({
    전체: "전체",
  }); //본부
  const [branchMenuList, setBranchMenuList] = useState({ 전체: "전체" }); //지점
  const [areaMenuItems, setAreaMenuItems] = useState({ 전체: "전체" });

  useEffect(() => {
    !getCookies && router.replace("/login");
  }, []);

  const { openModal } = useContext(ModalContext);

  const getPopupList = async () => {
    const res = (
      await Axios.Get("popup", {
        params: {
          token: getAccessToken(),
        },
      })
    )?.data;

    if (res?.code === 200) {
      // TODO
      // 팝업 기간 설정
      console.log(res?.data?.result);
      res?.data?.result?.map(
        (popup, key) =>
          (popup.activate === "활성화(매일)" ||
            new Date(popup.activate.split("~")[0]) - new Date() < 0 ||
            new Date(popup.activate.split("~")[1]) - new Date() > 0) &&
          user_info?.head_office === popup.organization_name &&
          (!getCookie(["popup"])
            ? true
            : getCookie(["popup"])?.indexOf(popup?.pk) === -1) &&
          openModal({
            modal: "popup",
            data: popup,
            content: {
              action: setCookieList,
              setCookieAction: setCookieAction,
              key: key,
            },
          })
      );
    }
  };

  useEffect(() => {
    getPopupList();
  }, []);

  useEffect(() => {
    if (cookie_list.length === 0) return;
    setCookie(["popup"], cookie_list, {
      maxAge: 436000,
    });
  }, [cookieAction]);

  const getDbDashBoard = async () => {
    const res = (
      await Axios.Get(`db/dashboard`, {
        params: {
          token: getAccessToken(),
          head_office_org_code:
            rank === "협력사" || rank === "부협력사"
              ? undefined
              : org_code === "전체"
              ? undefined
              : org_code,
          org_code:
            rank === "협력사" || rank === "부협력사"
              ? undefined
              : rank === "본부장" ||
                rank === "지점장" ||
                rank === "팀장" ||
                rank === "담당자"
              ? user_info?.org_code
              : branch !== "전체"
              ? branch
              : head_office_org_code !== "전체"
              ? head_office_org_code
              : rank === "부관리자"
              ? user_info?.org_code
              : undefined,
          geo_name: geo_name === "전체" ? undefined : geo_name,
          date: send_date,
        },
      })
    )?.data;

    if (res?.code === 200) {
      setDashBoardList(res?.data);
    }
  };

  const getCooperationDashBoard = async () => {
    const res = (
      await Axios.Get(`db/dashboard_cooperation`, {
        params: {
          token: getAccessToken(),
          geo_name: geo_name === "전체" ? undefined : geo_name,
          date: send_date,
        },
      })
    )?.data;

    if (res?.code === 200) {
      setDashBoardCoopList(res?.data);
    }
  };

  useEffect(() => {
    if (send_date.length !== 6) return;
    startTransition(() => {
      getDbDashBoard();
      getCooperationDashBoard();
    });
  }, [send_date]);

  useEffect(() => {
    setAreaMenuItems(() => {
      const obj = {};
      area?.map((d, key) => {
        Object.assign(obj, { 전체: "전체" });
        Object.assign(obj, { [d.parent]: d.parent });
      });
      return obj;
    });
  }, [area]);

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

  //조직
  useEffect(() => {
    const head_org = { 전체: "전체" };
    if (sales?.length !== 0) {
      getOrgHeadOffice(sales, head_org);
    }

    setOrgMenuList(head_org);
  }, [sales]);

  //본부 관리자
  useEffect(() => {
    const head_office = { 전체: "전체" };
    if (org_code !== "전체") {
      getOrgWithUnit(org_code_by_sales, "region", head_office);
    }

    setHeadOfficeMenuList(head_office);
  }, [org_code_by_sales]);

  //본부 부관리자
  useEffect(() => {
    const head_office = { 전체: "전체" };
    if (sales?.length !== 0 && rank === "부관리자") {
      getOrgWithUnit(sales, "region", head_office);
    }

    setHeadOfficeMenuList(head_office);
  }, [sales]);

  useEffect(() => {
    if (rank !== "부관리자") return;
    const branch = { 전체: "전체" };

    if (sales?.length !== 0 && head_office_org_code !== "전체") {
      getOrgByOfficeNameWithUnit(
        sales,
        headOfficeMenuList[head_office_org_code],
        "branch",
        branch
      );
      setBranchMenuList(branch);
    }
  }, [head_office_org_code]);

  useEffect(() => {
    if (rank !== "관리자") return;
    const branch = { 전체: "전체" };
    if (sales?.length !== 0 && head_office_org_code !== "전체") {
      getOrgByOfficeNameWithUnit(
        org_code_by_sales,
        headOfficeMenuList[head_office_org_code],
        "branch",
        branch
      );
    }

    setBranchMenuList(branch);
  }, [head_office_org_code]);

  useEffect(() => {
    let d = new Date();
    d.setMonth(d.getMonth() - date);
    setSendDate(d.toISOString().substring(0, 8).replace(/-/g, ""));
  }, [date]);

  if (!getCookies) return <></>;

  return (
    <Layout loading={loading}>
      <Column>
        {rank !== "본부장" &&
          rank !== "지점장" &&
          rank !== "팀장" &&
          rank !== "담당자" && (
            <>
              <Row justifyContent={"end"} sx={{ gap: 1 }}>
                <Button
                  variant="contained"
                  bgColor={"primary"}
                  fs="h6"
                  color="primary.white"
                  text="검색"
                  h={28}
                  action={() => {
                    if (geo_name !== "전체") {
                      getDbDashBoard();
                      getCooperationDashBoard;
                    } else {
                      getDbDashBoard();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  bgColor={"gray"}
                  fs="h6"
                  color="primary.white"
                  text="초기화"
                  h={28}
                  action={() => setReset(!reset)}
                />
              </Row>

              <Row
                justifyContent={"between"}
                alignItems={"center"}
                sx={{
                  mt: 1,
                  borderBottom: "1px solid black",
                  pb: 1,
                  gap: 2,
                  flexDirection: {
                    lg: "row",
                    md: "row",
                    sm: "column",
                    xs: "column",
                  },
                }}
              >
                <Typography sx={{ fontSize: "30px", whiteSpace: "nowrap" }}>
                  분배 가능 DB
                </Typography>

                <Row wrap="wrap" sx={{ columnGap: "21px", rowGap: 1, mt: 1 }}>
                  <LabelOutLineSelectInput
                    title={"지역"}
                    menuItems={areaMenuItems}
                    value={geo_name}
                    setValue={setGeoName}
                  />
                  {rank !== "부관리자" && (
                    <LabelOutLineSelectInput
                      title={"조직"}
                      menuItems={orgMenuList}
                      value={org_code}
                      setValue={setOrgCode}
                    />
                  )}
                  {rank !== "협력사" && rank !== "부협력사" && (
                    <>
                      <LabelOutLineSelectInput
                        title={"본부"}
                        menuItems={headOfficeMenuList}
                        value={head_office_org_code}
                        setValue={setHeadOfficeOrgCode}
                      />

                      <LabelOutLineSelectInput
                        title={"지점"}
                        menuItems={branchMenuList}
                        value={branch}
                        setValue={setBranch}
                      />
                    </>
                  )}
                </Row>
              </Row>

              <Row
                alignItems={"center"}
                justifyContent={
                  dashboard_list?.length < 4 ? "around" : "center"
                }
                sx={{ mt: 2, width: "100%" }}
              >
                {dashboard_list?.length > 3 ? (
                  <Carousel
                    cellAlign="center"
                    wrapAround
                    defaultControlsConfig={{
                      pagingDotsStyle: {
                        display: "none",
                      },
                    }}
                    slidesToShow={3}
                    renderCenterLeftControls={({
                      previousSlide,
                      goToSlide,
                    }) => (
                      <Row
                        sx={{
                          width: {
                            lg: 31,
                            md: 31,
                            sm: 18,
                            xs: 18,
                          },
                          height: {
                            lg: 35,
                            md: 35,
                            sm: 25,
                            xs: 25,
                          },
                        }}
                      >
                        <Image
                          src="/left_arrow.png"
                          width={31}
                          height={35}
                          // layout="fixed"
                          alt="left"
                          className="prev_button cursor"
                          style={{
                            top: "50%",
                            // left: "-610px",
                          }}
                          onClick={(e) => {
                            previousSlide();
                          }}
                        />
                      </Row>
                    )}
                    renderCenterRightControls={({ nextSlide, goToSlide }) => (
                      <Row
                        sx={{
                          width: {
                            lg: 31,
                            md: 31,
                            sm: 18,
                            xs: 18,
                          },
                          height: {
                            lg: 35,
                            md: 35,
                            sm: 25,
                            xs: 25,
                          },
                        }}
                      >
                        <Image
                          src="/right_arrow.png"
                          width={31}
                          height={35}
                          // layout="intrinsic"
                          alt="right"
                          className="next_button cursor"
                          style={{
                            top: "50%",
                            // right: "-105px",
                          }}
                          onClick={() => {
                            nextSlide();
                          }}
                        />
                      </Row>
                    )}
                  >
                    {dashboard_list?.map((dashboard, key) => (
                      <Column alignItems={"center"} key={key}>
                        <Typography
                          sx={{
                            fontSize: {
                              lg: 25,
                              md: 25,
                              sm: 18,
                              xs: 12,
                            },
                            fontWeight: 350,
                          }}
                        >
                          {dashboard?.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: {
                              lg: 25,
                              md: 18,
                              sm: 18,
                              xs: 12,
                            },
                            fontWeight: 350,
                          }}
                        >
                          {dashboard?.allocation_available}
                        </Typography>
                      </Column>
                    ))}
                  </Carousel>
                ) : (
                  dashboard_list?.map((dashboard, key) => (
                    <Column alignItems={"center"} key={key}>
                      <Typography sx={{ fontSize: 25, fontWeight: 350 }}>
                        {dashboard?.title}
                      </Typography>
                      <Typography sx={{ fontSize: 30, fontWeight: 350 }}>
                        {dashboard?.allocation_available}
                      </Typography>
                    </Column>
                  ))
                )}
              </Row>
            </>
          )}

        <Column
          sx={{
            gap: 5,
            mt:
              rank !== "본부장" &&
              rank !== "지점장" &&
              rank !== "팀장" &&
              rank !== "담당자"
                ? 10
                : 0,
            mb: 5,
          }}
        >
          {(rank === "관리자" || rank === "부관리자") && (
            <Column sx={{ gap: 2 }}>
              <Row alignItems={"center"} justifyContent={"between"}>
                <Typography sx={{ fontSize: "30px" }}>협력사 DB</Typography>

                <OutLineSelectInput
                  // menuItems={dateMenuItems}
                  menuItems={Array(12)
                    .fill(0)
                    .map((_, n) => {
                      let d = new Date();
                      d.setMonth(new Date().getMonth() - n);
                      return `${d
                        .toISOString()
                        .substring(0, 8)
                        .replace(/-/g, "")
                        .slice(0, 4)}년 ${d
                        .toISOString()
                        .substring(0, 8)
                        .replace(/-/g, "")
                        .slice(4)}월`;
                    })}
                  value={date}
                  setValue={setDate}
                />
              </Row>

              <CooperationTable data={dashboard_coop_list} />
            </Column>
          )}

          <Row alignItems={"center"} justifyContent={"between"}>
            <Typography sx={{ fontSize: "30px" }}>접수 현황</Typography>
            {(rank === "협력사" || rank === "부협력사") && (
              <OutLineSelectInput
                // menuItems={dateMenuItems}
                menuItems={Array(12)
                  .fill(0)
                  .map((_, n) => {
                    let d = new Date();
                    d.setMonth(new Date().getMonth() - n);
                    return `${d
                      .toISOString()
                      .substring(0, 8)
                      .replace(/-/g, "")
                      .slice(0, 4)}년 ${d
                      .toISOString()
                      .substring(0, 8)
                      .replace(/-/g, "")
                      .slice(4)}월`;
                  })}
                value={date}
                setValue={setDate}
              />
            )}
          </Row>

          <ReceptionStatusTable data={dashboard_list} date={date} />
        </Column>
      </Column>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      getCookies: context.req.cookies.user_info || null,
    },
  };
}
