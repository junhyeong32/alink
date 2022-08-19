import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
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
  getOrgHeadOffice,
  getOrgWithUnit,
} from "../src/utility/organization/getOrgWithUnit";
import useGetArea from "../src/hooks/setting/useGetArea";
import Carousel from "nuka-carousel";

export default function DbStatus() {
  const [user_info] = useState(getCookie("user_info"));

  //data
  const [dashboard_list, setDashBoardList] = useState([]);
  const { area } = useGetArea();

  //state
  const [org_code_by_sales, setOrgCodeBySales] = useState([]);
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("전체");
  //TODO
  //이거 기본값 안넣어주면 오류남
  // 물어보기
  const [org_code, setOrgCode] = useState("전체");
  const [branch, setBranch] = useState("전체");
  const [team, setTeam] = useState("전체");
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
  const [teamMenuList, setTeamMenuList] = useState({ 전체: "전체" }); //팀
  const [areaMenuItems, setAreaMenuItems] = useState({ 전체: "전체" });
  const [dateMenuItems, setDateMenuItems] = useState({});

  console.log("user_info", user_info);

  const getDbDashBoard = async () => {
    console.log("date", date.length);
    const res = (
      await Axios.Get(`db/dashboard`, {
        params: {
          token: getAccessToken(),
          head_office_org_code: org_code === "전체" ? undefined : org_code,
          org_code:
            rank === "본부장" ||
            rank === "지점장" ||
            rank === "팀장" ||
            rank === "담당자"
              ? user_info?.org_code
              : team !== "전체"
              ? team
              : branch !== "전체"
              ? branch
              : head_office_org_code !== "전체"
              ? head_office_org_code
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

  useEffect(() => {
    getDbDashBoard();
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
    const getOrgCodeByData = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code:
              team !== "전체"
                ? team
                : branch !== "전체"
                ? branch
                : head_office_org_code !== "전체"
                ? head_office_org_code
                : undefined,
          },
        })
      )?.data;

      if (res?.code === 200) {
        setOrgCodeBySales(res?.data);
        const head_org = {};

        getOrgHeadOffice(res?.data, head_org);

        setOrgMenuList(head_org);
      }
    };

    getOrgCodeByData();
  }, [org_code]);

  useEffect(() => {
    const head_result = {};

    getOrgWithUnit(org_code_by_sales, "region", head_result);

    setHeadOfficeMenuList(head_result);
    if (org_code) {
      const branch_result = {};

      getOrgWithUnit(org_code_by_sales, "branch", branch_result);

      setBranchMenuList(branch_result);
    } else if (branch) {
      console.log("실행");
      const team_result = {};

      getOrgWithUnit(org_code_by_sales, "team", team_result);

      setTeamMenuList(team_result);
    }
  }, [org_code, reset]);

  useEffect(() => {
    let d = new Date();
    d.setMonth(d.getMonth() - date);
    setSendDate(d.toISOString().substring(0, 8).replace(/-/g, ""));
  }, [date]);

  return (
    <Layout>
      <Column>
        {rank !== "본부장" &&
          rank !== "지점장" &&
          rank !== "팀장" &&
          rank !== "담당자" && (
            <>
              <Row justifyContent={"end"} sx={{ gap: 1 }}>
                <Button
                  h={20}
                  variant="contained"
                  bgColor={"primary"}
                  fs="h6"
                  color="primary.white"
                  text="검색"
                  action={getDbDashBoard}
                />
                <Button
                  h={20}
                  variant="contained"
                  bgColor={"gray"}
                  fs="h6"
                  color="primary.white"
                  text="초기화"
                  action={() => setReset(!reset)}
                />
              </Row>

              <Row
                justifyContent={"between"}
                alignItems={"center"}
                sx={{
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
                  <LabelOutLineSelectInput
                    title={"팀"}
                    menuItems={teamMenuList}
                    value={team}
                    setValue={setTeam}
                  />
                </Row>
              </Row>

              <Row
                alignItems={"center"}
                justifyContent={"center"}
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
            mt:
              rank !== "본부장" &&
              rank !== "지점장" &&
              rank !== "팀장" &&
              rank !== "담당자"
                ? 10
                : 0,
          }}
        >
          <Row
            alignItems={"center"}
            justifyContent={"between"}
            sx={{ mb: "10px" }}
          >
            <Typography sx={{ fontSize: "30px" }}>접수 현황</Typography>
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

          <ReceptionStatusTable data={dashboard_list} date={date} />
        </Column>
      </Column>
    </Layout>
  );
}
