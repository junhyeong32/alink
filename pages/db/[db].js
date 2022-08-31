import { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Column from "../../src/components/Box/Column";
import Row from "../../src/components/Box/Row";
import {
  Typography,
  FormControlLabel,
  TextField,
  MenuItem,
} from "@mui/material";

import SelectInput, {
  OutLineSelectInput,
  LabelOutLineGroupingSelectInput,
  LabelOutLineSelectInput,
  LabelOutLineSearchSelectInput,
} from "../../src/components/Input/Select";
import Button from "../../src/components/Button";
import GridBox from "../../src/components/Box/Grid";
import RowLabel from "../../src/components/Box/RowLabel";
import UnderLineInput, {
  OutLineInput,
  DatePicker,
} from "../../src/components/Input";
import MemoBox from "../../src/components/Box/Memo";
import DisableBox from "../../src/components/Box/DisableBox";
import { ModalContext } from "../../src/contexts/ModalContext";
import Axios from "../../src/utility/api";
import { getAccessToken, getCookie } from "../../src/utility/getCookie";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import useGetArea from "../../src/hooks/setting/useGetArea";
import RadioInput from "../../src/components/Radio";
import { useSnackbar } from "notistack";
import uploadFile from "../../src/utility/uploadFile";
import { argument_status } from "../../src/data/share/MenuByTextList";

import { styled } from "@mui/material/styles";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import {
  getOrgWithUnit,
  getOrgByOfficeNameWithUnit,
  getOrgWithManyUnit,
} from "../../src/utility/organization/getOrgWithUnit";
import moment from "moment";
import { LoadingButton } from "@mui/lab";

const Input = styled("input")({
  display: "none",
});

export default function DbDetail() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const el = useRef(null);

  const [rank] = useState(getCookie("user_info")?.grade);

  const [menu_detail, setMenuDetail] = useState([]);
  const [db_detail, setDbDetail] = useState([]);
  const [user_info] = useState(getCookie("user_info"));

  //change state
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [head_office_org_code, setHeadOfficeOrgCode] = useState("");
  const [org_code, setOrgCode] = useState("");
  const [status, setStatus] = useState("");
  const [org_status, setOrgStatus] = useState("");
  const [allocated_user, setAllocatedUser] = useState("");
  const [parent_area, setParentArea] = useState("");
  const [child_area, setChildArea] = useState("");
  const [created_date, setCreatedDate] = useState("");
  const [uploader, setUploader] = useState({});
  const [values, setValues] = useState([]);
  const [organization, setOrganization] = useState({});
  const [user_code, setUserCode] = useState("");
  const [date, setDate] = useState(null);
  const [dateAge, setDateAge] = useState("");
  const [dateAgeChangeLog, setDateAgeChangeLog] = useState(false);
  const [age, setAge] = useState("");
  const [area, setArea] = useState([]);
  const [sales, setSales] = useState([]);
  const [team, setTeam] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const [orgHead, setOrgHead] = useState(""); //메뉴 리스트만 바꾸는용

  const [transcript_file, setTranscriptFile] = useState("");
  const [memo, setMemo] = useState("");

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [orgMenuList, setOrgMenuList] = useState({});
  const [teamMenuList, setTeamMenuList] = useState({});
  const [uploaderMenuList, setUploaderMenuList] = useState({});
  const [areaParentMenuList, setAreaParentMenuList] = useState({
    전체: "전체",
  });
  const [areaChildMenuList, setAreaChildMenuList] = useState({ 전체: "전체" });
  const [userMenuList, setUserMenuList] = useState({});

  const [date_range, setDateRange] = useState(new Date());
  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  // TODO
  // 본부 코드 menulist 다시

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
    if (!date) return;

    document.querySelector(".rdrCalendarWrapper").style.display = "none";
    if (dateAge !== moment(date).format("YYYY-MM-DD"))
      setDateAge(moment(date).format("YYYY-MM-DD"));

    document.querySelector("#age").value =
      new Date().getFullYear() - date.getFullYear() + 1;
    setValues((prev) => {
      const newData = [...prev];
      const dataObj = newData.filter((data) => data.title === "나이");
      dataObj[0].value = moment(date).format("YYYY-MM-DD");

      return newData;
    });
  }, [date]);

  useEffect(() => {
    if (!dateAge) return;
    if (
      dateAge?.length === 10 &&
      dateAge?.includes("-", 5) &&
      dateAge?.includes("-", 7) &&
      new Date(dateAge) instanceof Date &&
      !isNaN(new Date(dateAge))
    ) {
      setDate(new Date(dateAge));
    } else {
      enqueueSnackbar("날짜형식을 올바르게 입력해주세요", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, [dateAgeChangeLog]);

  useEffect(() => {
    if (!date && age)
      setValues((prev) => {
        const newData = [...prev];
        const dataObj = newData.filter((data) => data.title === "나이");
        dataObj[0].value = age;

        return newData;
      });
  }, [age]);

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
          const parent = {};
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
    if (!router.isReady) return;

    const getDbDetail = async () => {
      const res = (
        await Axios.Get(`db/list/${router.query.db}?token=${getAccessToken()}`)
      )?.data;

      if (res?.code === 200) {
        const {
          allocated_user,
          created_date,
          geo_name,
          geo_parent,
          org_status,
          status,
          uploader,
          values,
          organization_code,
          organization,
        } = res?.data;
        setDbDetail(res?.data);
        setAllocatedUser(allocated_user);
        setCreatedDate(created_date);
        setParentArea(geo_parent);
        setChildArea(geo_name);
        setOrgStatus(org_status);
        setStatus(status);
        setUploader(uploader);
        setValues(values);
        setOrgCode(organization_code);
        setOrganization(organization);
        setUserCode(allocated_user?.pk);
        setOrgHead(allocated_user?.organization?.code);
        let valuesAge = values?.filter((v) => v?.title === "나이")?.[0]?.value;

        if (valuesAge?.length === 8) {
          setDateAge(
            valuesAge.slice(0, 4) +
              "-" +
              valuesAge.slice(4, 6) +
              "-" +
              valuesAge.slice(6, 8)
          );
        } else if (valuesAge?.length === 2) {
          setAge(valuesAge);
        } else if (valuesAge.length > 0) {
          setDateAge(valuesAge);
        }
      }

      setLoading(false);
    };

    getDbDetail();
  }, [router.isReady, router.query.db]);

  //상세지역구분
  useEffect(() => {
    if (!parent_area || parent_area === "전체" || area?.length === 0) return;

    setAreaChildMenuList((prev) => {
      const child = {};

      area
        ?.filter((geomap) => geomap.parent === parent_area)
        ?.map((filter_area) => {
          filter_area?.children?.map((d) => {
            Object.assign(child, { [d]: d });
          });
        });

      return child;
    });
  }, [area, parent_area]);

  useEffect(() => {
    if (!org_code) return;
    const getSalesByHeadOffice = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code: org_code,
          },
        })
      )?.data;

      if (res?.code === 200) {
        setSales(res?.data);
        const result = {};

        getOrgWithManyUnit(res?.data, "region", "team", result);

        setOrgMenuList(result);
      }
    };
    getSalesByHeadOffice();
  }, [org_code]);

  // useEffect(() => {
  //   if (!orgHead) return;
  //   const result = {};
  //   getOrgByOfficeNameWithUnit(sales, orgMenuList[orgHead], "team", result);

  //   setTeamMenuList(result);
  // }, [orgHead]);

  // console.log("result", teamMenuList);

  useEffect(() => {
    if (!orgHead) return;
    const getUserList = async () => {
      const res = (
        await Axios.Get("member", {
          params: {
            token: getAccessToken(),
            org_code: orgHead ? orgHead : org_code,
            count: 10000,
          },
        })
      )?.data;
      if (res?.code === 200) {
        const userDbCount = [];
        const listObj = {};

        res?.data?.result?.map((user) =>
          user?.allocations?.map(
            (location) =>
              location?.db?.pk === router.query.menu &&
              userDbCount.push(location?.count)
          )
        );

        res?.data?.result?.map((user, key) =>
          Object.assign(listObj, {
            [user?.pk]: user?.name + " (" + userDbCount[key] + ")",
          })
        );

        setUserMenuList(listObj);
      }
    };
    getUserList();
  }, [org_code, orgHead]);

  console.log("hi", dateAge, age, date);

  return (
    <Layout loading={loading}>
      <Column justifyContent={"between"} sx={{ gap: 2.8 }}>
        <Row
          justifyContent={"start"}
          flexDirection={{
            lg: "row",
            md: "row",
            sm: "row",
            xs: "column",
          }}
          sx={{ columnGap: "100px", rowGap: 3 }}
        >
          <Column sx={{ width: "100%", maxWidth: 463, gap: 2.8 }}>
            <Typography variant="h1">고객 정보</Typography>
            {menu_detail?.fields?.map((field, key) => {
              if (field?.is_detail_shown === 1) {
                switch (field?.property?.name) {
                  case "고객명":
                    return (
                      <RowLabel label="고객명" fs="h5" key={key}>
                        <OutLineInput
                          disabled={
                            allocated_user?.pk !== user_info?.pk &&
                            rank !== "관리자" &&
                            uploader?.pk !== user_info?.pk &&
                            user_info?.org_code !== uploader?.organization?.code
                          }
                          defaultValue={
                            values.filter((v) => v?.title === "고객명")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "고객명"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                  case "연락처":
                    return (
                      <RowLabel label="연락처" fs="h5" key={key}>
                        <OutLineInput
                          disabled={
                            allocated_user?.pk !== user_info?.pk &&
                            rank !== "관리자" &&
                            uploader?.pk !== user_info?.pk &&
                            user_info?.org_code !== uploader?.organization?.code
                          }
                          defaultValue={
                            values.filter((v) => v?.title === "연락처")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "연락처"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                  case "나이":
                    return (
                      <RowLabel label="나이" fs="h5" key={key}>
                        <div ref={el} style={{ width: "50%" }}>
                          <DatePicker
                            disabled={
                              allocated_user?.pk !== user_info?.pk &&
                              rank !== "관리자" &&
                              uploader?.pk !== user_info?.pk &&
                              user_info?.org_code !==
                                uploader?.organization?.code
                            }
                            date={dateAge}
                            setDate={setDateAge}
                            value={date}
                            setValue={setDate}
                            w={"100%"}
                            setChangeLog={setDateAgeChangeLog}
                          />
                        </div>

                        <OutLineInput
                          id="age"
                          disabled={
                            allocated_user?.pk !== user_info?.pk &&
                            rank !== "관리자" &&
                            uploader?.pk !== user_info?.pk &&
                            user_info?.org_code !== uploader?.organization?.code
                          }
                          defaultValue={
                            values.filter((v) => v?.title === "나이")?.[0]
                              ?.value.length < 5
                              ? values.filter((v) => v?.title === "나이")?.[0]
                                  ?.value
                              : new Date().getFullYear() -
                                new Date(
                                  values.filter(
                                    (v) => v?.title === "나이"
                                  )?.[0]?.value
                                ).getFullYear() +
                                1
                          }
                          onBlur={(e) => setAge(e.target.value)}
                        />
                      </RowLabel>
                    );
                  case "성별":
                    return (
                      <RowLabel label="성별" fs="h5" key={key}>
                        <FormControlLabel
                          label="남자"
                          control={
                            <RadioInput
                              disabled={
                                allocated_user?.pk !== user_info?.pk &&
                                rank !== "관리자" &&
                                uploader?.pk !== user_info?.pk &&
                                user_info?.org_code !==
                                  uploader?.organization?.code
                              }
                              checked={
                                values.filter((v) => v?.title === "성별")?.[0]
                                  ?.value === "남자"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "성별"
                                  );
                                  dataObj[0].value = "남자";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                        <FormControlLabel
                          label="여자"
                          control={
                            <RadioInput
                              disabled={
                                allocated_user?.pk !== user_info?.pk &&
                                rank !== "관리자" &&
                                uploader?.pk !== user_info?.pk &&
                                user_info?.org_code !==
                                  uploader?.organization?.code
                              }
                              checked={
                                values.filter((v) => v?.title === "성별")?.[0]
                                  ?.value === "여자"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "성별"
                                  );
                                  dataObj[0].value = "여자";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                      </RowLabel>
                    );
                  case "결혼여부":
                    return (
                      <RowLabel label="결혼여부" fs="h5" key={key}>
                        <FormControlLabel
                          label="미혼"
                          control={
                            <RadioInput
                              disabled={
                                allocated_user?.pk !== user_info?.pk &&
                                rank !== "관리자" &&
                                uploader?.pk !== user_info?.pk &&
                                user_info?.org_code !==
                                  uploader?.organization?.code
                              }
                              checked={
                                values.filter(
                                  (v) => v?.title === "결혼여부"
                                )?.[0]?.value === "미혼"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "결혼여부"
                                  );
                                  dataObj[0].value = "미혼";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                        <FormControlLabel
                          label="기혼"
                          control={
                            <RadioInput
                              disabled={
                                allocated_user?.pk !== user_info?.pk &&
                                rank !== "관리자" &&
                                uploader?.pk !== user_info?.pk &&
                                user_info?.org_code !==
                                  uploader?.organization?.code
                              }
                              checked={
                                values.filter(
                                  (v) => v?.title === "결혼여부"
                                )?.[0]?.value === "기혼"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "결혼여부"
                                  );
                                  dataObj[0].value = "기혼";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                      </RowLabel>
                    );
                  case "특이사항":
                    return (
                      <RowLabel label="특이사항" fs="h5" key={key}>
                        <OutLineInput
                          disabled={
                            allocated_user?.pk !== user_info?.pk &&
                            rank !== "관리자" &&
                            uploader?.pk !== user_info?.pk &&
                            user_info?.org_code !== uploader?.organization?.code
                          }
                          multiline
                          rows={3}
                          w={"100%"}
                          defaultValue={
                            values.filter((v) => v?.title === "특이사항")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "특이사항"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );

                  case "메모":
                    return;

                  default:
                    return (
                      <RowLabel label={field?.property?.name} fs="h5" key={key}>
                        <OutLineInput
                          w={"100%"}
                          disabled={
                            allocated_user?.pk !== user_info?.pk &&
                            rank !== "관리자" &&
                            uploader?.pk !== user_info?.pk &&
                            user_info?.org_code !== uploader?.organization?.code
                          }
                          defaultValue={
                            values.filter((v) => v?.title === "고객명")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "고객명"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                }
              }
            })}
            <RowLabel
              label={
                rank === "본부장" ||
                rank === "지점장" ||
                rank === "팀장" ||
                rank === "담당자"
                  ? "분배일시"
                  : "등록일시"
              }
              fs="h5"
            >
              <Typography variant="h5">
                {rank === "본부장" ||
                rank === "지점장" ||
                rank === "팀장" ||
                rank === "담당자"
                  ? db_detail?.allocated_date
                  : db_detail?.created_date}
              </Typography>
            </RowLabel>
            <RowLabel label="지역" fs="h5">
              <OutLineSelectInput
                title="지역"
                placeholder={"시도"}
                w={"50%"}
                menuItems={areaParentMenuList}
                value={parent_area}
                setValue={setParentArea}
                disabled={
                  allocated_user?.pk !== user_info?.pk &&
                  rank !== "관리자" &&
                  uploader?.pk !== user_info?.pk &&
                  user_info?.org_code !== uploader?.organization?.code
                }
              />
              <OutLineSelectInput
                w={"50%"}
                placeholder={"지역상세"}
                menuItems={areaChildMenuList}
                value={child_area}
                setValue={setChildArea}
                disabled={
                  allocated_user?.pk !== user_info?.pk &&
                  rank !== "관리자" &&
                  uploader?.pk !== user_info?.pk &&
                  user_info?.org_code !== uploader?.organization?.code
                }
              />
            </RowLabel>

            <RowLabel label="등록처" fs="h5">
              <Typography variant="h5">{db_detail?.uploader?.name}</Typography>
            </RowLabel>
          </Column>
          <Column sx={{ width: "100%", maxWidth: 463, gap: 2.8 }}>
            <Typography variant="h1">담당자 정보</Typography>
            <RowLabel label="인수상태" fs="h5">
              {allocated_user?.pk === user_info?.pk ? (
                <Row wrap={"wrap"} sx={{ width: "100%" }}>
                  {Object.entries(argument_status).map(
                    ([list, color], key) =>
                      key !== 0 &&
                      key !== 6 &&
                      key !== 8 && (
                        <FormControlLabel
                          key={key}
                          control={
                            <RadioInput
                              disabled={
                                allocated_user?.pk !== user_info?.pk &&
                                rank !== "관리자"
                              }
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
                </Row>
              ) : (
                <RoundColorBox bgColor={argument_status[status]}>
                  {status}
                </RoundColorBox>
              )}
            </RowLabel>
            {rank !== "본부장" &&
              rank !== "지점장" &&
              rank !== "팀장" &&
              rank !== "담당자" && (
                <RowLabel label="업체승인" fs="h5">
                  <OutLineSelectInput
                    disabled={
                      allocated_user?.pk !== user_info?.pk &&
                      rank !== "관리자" &&
                      uploader?.pk !== user_info?.pk &&
                      user_info?.org_code !== uploader?.organization?.code
                    }
                    w={"50%"}
                    menuItems={{
                      AS승인: "AS승인",
                      AS반려: "AS반려",
                    }}
                    value={org_status}
                    setValue={setOrgStatus}
                  />
                </RowLabel>
              )}

            <RowLabel label="조직" fs="h5">
              <Typography variant="h6">{organization?.name}</Typography>
            </RowLabel>
            {rank !== "협력사" &&
              rank !== "부협력사" &&
              rank !== "본부장" &&
              rank !== "지점장" &&
              rank !== "팀장" &&
              rank !== "담당자" && (
                <RowLabel label="소속/성명" fs="h5" alignItems="stasrt">
                  <Row sx={{ width: "100%", gap: 1 }}>
                    <LabelOutLineSelectInput
                      alignItems={"start"}
                      native
                      title="소속"
                      disabled={
                        allocated_user?.pk !== user_info?.pk &&
                        rank !== "관리자"
                      }
                      w={"50%"}
                      menuItems={orgMenuList}
                      value={orgHead}
                      setValue={setOrgHead}
                    />
                    {/* <LabelOutLineGroupingSelectInput
                  alignItems={"start"}
                  title="팀"
                  w={"100%"}
                  disabled={
                    allocated_user?.pk !== user_info?.pk && rank !== "관리자"
                  }
                /> */}
                    {/* <LabelOutLineSelectInput
                  alignItems={"start"}
                  title="팀"
                  disabled={
                    allocated_user?.pk !== user_info?.pk && rank !== "관리자"
                  }
                  w={"100%"}
                  menuItems={teamMenuList}
                  value={team}
                  setValue={setTeam}
                /> */}
                    <LabelOutLineSelectInput
                      alignItems={"start"}
                      title="담당자명"
                      disabled={
                        allocated_user?.pk !== user_info?.pk &&
                        rank !== "관리자"
                      }
                      w={"50%"}
                      menuItems={userMenuList}
                      value={user_code}
                      setValue={setUserCode}
                    />
                  </Row>
                </RowLabel>
              )}
          </Column>
        </Row>
        {(allocated_user?.pk === user_info?.pk ||
          rank === "관리자" ||
          user_info?.org_code === uploader?.organization?.code ||
          uploader?.pk === user_info?.pk) &&
          menu_detail?.fields
            ?.filter(
              (field) =>
                field?.is_detail_shown === 1 &&
                field?.property?.name === "녹취 파일"
            )
            ?.map((filter_data) => (
              <>
                <Typography variant="h4" color="primary.red">
                  녹취파일 및 메모는 등록 후 삭제가 불가하며, 업로드 하지 않을
                  시 저장이 되지 않습니다.
                </Typography>

                <Column sx={{ gap: 1 }}>
                  <Row alignItems={"center"} sx={{ gap: 2 }}>
                    <Typography variant="h1">녹취파일</Typography>
                    <Row
                      alignItems={"center"}
                      justifyContent={"start"}
                      sx={{ gap: 1 }}
                    >
                      <label htmlFor="contained-button-file">
                        <Input
                          accept="audio/*"
                          id="contained-button-file"
                          type="file"
                          onChange={(e) => setTranscriptFile(e.target.files[0])}
                        />

                        <Button
                          text="파일찾기"
                          fs="h5"
                          bgColor={"gray"}
                          color={"primary.white"}
                          h={28}
                          component={"span"}
                        />
                      </label>

                      <UnderLineInput
                        disabled
                        value={transcript_file?.name || ""}
                      />
                      <LoadingButton
                        variant="contained"
                        loading={fileLoading}
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          height: 28,
                          mt: 0.1,
                        }}
                        onClick={async () => {
                          if (!transcript_file)
                            return enqueueSnackbar("파일을 선택해주세요", {
                              variant: "error",
                              autoHideDuration: 2000,
                            });
                          setFileLoading(true);
                          const _uploadFile = await uploadFile(transcript_file);

                          if (_uploadFile) {
                            const getRecordField = menu_detail?.fields?.find(
                              (data) => data?.property.name === "녹취 파일"
                            );

                            setValues((prev) => {
                              const newData = [...prev];

                              const newObj = Object.assign(
                                {},
                                {
                                  field_pk: getRecordField?.pk,
                                  title: "녹취 파일",
                                  value: _uploadFile,
                                  created_date: new Date(
                                    +new Date() + 3240 * 10000
                                  )
                                    .toISOString()
                                    .replace("T", " ")
                                    .replace(/\..*/, ""),
                                }
                              );
                              newData.push(newObj);

                              return newData;
                            });

                            setFileLoading(false);
                            if (!fileLoading) {
                              setTranscriptFile("");
                              document.querySelector(
                                "#contained-button-file"
                              ).value = "";

                              enqueueSnackbar(
                                "파일이 정상적으로 등록 되었습니다.",
                                {
                                  variant: "success",
                                  autoHideDuration: 2000,
                                }
                              );
                            }
                          }
                        }}
                      >
                        업로드
                      </LoadingButton>
                    </Row>
                  </Row>

                  <GridBox
                    itemCount={4}
                    alignItems={"end"}
                    sx={{ width: "100%", gap: 1, mt: 1, maxWidth: 1024 }}
                  >
                    {values?.map(
                      (v, _key) =>
                        v?.title === "녹취 파일" &&
                        v?.value &&
                        v?.value.includes("https") && (
                          <Column
                            sx={{
                              width: "100%",
                              p: 1,
                              border: "1px solid black",
                              borderRadius: "5px",
                            }}
                          >
                            <Typography variant="h6" ml={3} mb={1}>
                              {v?.created_date}{" "}
                            </Typography>
                            <audio
                              controls
                              src={v?.value}
                              style={{ width: "100%" }}
                            >
                              Your browser does not support the
                              <code>audio</code> element.
                            </audio>
                          </Column>
                        )
                    )}
                  </GridBox>
                </Column>
              </>
            ))}
        {(allocated_user?.pk === user_info?.pk ||
          rank === "관리자" ||
          user_info?.org_code === uploader?.organization?.code ||
          uploader?.pk === user_info?.pk) &&
          menu_detail?.fields
            ?.filter(
              (field) =>
                field?.is_detail_shown === 1 && field?.property?.name === "메모"
            )
            ?.map((filter_data, key) => (
              <Column sx={{ gap: 1, maxWidth: 1020 }} key={key}>
                <Row alignItems={"center"} sx={{ gap: 2 }}>
                  <Typography variant="h1">메모관리</Typography>
                  <Button
                    variant="contained"
                    bgColor="primary"
                    text="메모추가"
                    color="primary.white"
                    fs="h5"
                    h={28}
                    action={() => {
                      if (!memo)
                        return enqueueSnackbar("텍스트를 입력해주세요", {
                          variant: "error",
                          autoHideDuration: 2000,
                        });

                      const getRecordField = menu_detail?.fields?.find(
                        (data) => data?.property.name === "메모"
                      );

                      setMemo("");
                      setValues((prev) => {
                        const newData = [...prev];

                        const newObj = Object.assign(
                          {},
                          {
                            field_pk: getRecordField?.pk,
                            title: "메모",
                            value: memo,
                            created_date: new Date(+new Date() + 3240 * 10000)
                              .toISOString()
                              .replace("T", " ")
                              .replace(/\..*/, ""),
                          }
                        );

                        newData.push(newObj);

                        return newData;
                      });
                    }}
                  />
                </Row>
                <OutLineInput
                  // disabled={
                  //   allocated_user?.pk === user_info?.pk ||
                  //   rank === "관리자" ||
                  //   user_info?.org_code === uploader?.organization?.code ||
                  //   uploader?.pk === user_info?.pk
                  // }
                  placeholder="메모를 입력해주세요."
                  rows={4}
                  multiline
                  value={memo}
                  setValue={setMemo}
                />
                <GridBox
                  itemCount={4}
                  alignItems={"end"}
                  sx={{ width: "100%", gap: 1, mt: 1, maxWidth: 1024 }}
                >
                  {values?.map(
                    (v, _key) =>
                      v?.title === "메모" &&
                      v?.value && (
                        <MemoBox
                          w={"100%"}
                          time={v?.created_date}
                          text={v?.value}
                        />
                      )
                  )}
                </GridBox>
              </Column>
            ))}

        <Row justifyContent={"between"} sx={{ gap: "12px", width: "100%" }}>
          <Button
            variant="contained"
            bgColor="print"
            text="인쇄"
            color="primary.white"
            fs="h5"
            w={100}
            h={35}
          />

          <Row sx={{ gap: 1 }}>
            {(allocated_user?.pk === user_info?.pk ||
              rank === "관리자" ||
              user_info?.org_code === uploader?.organization?.code ||
              uploader?.pk === user_info?.pk) && (
              <Button
                variant="contained"
                bgColor="primary"
                text="수정"
                color="primary.white"
                fs="h5"
                w={100}
                h={35}
                action={() =>
                  openModal({
                    modal: "needconfirm",
                    content: {
                      contents: "수정을 진행하시겠습니까? ",
                      action: async () => {
                        if (transcript_file) {
                          enqueueSnackbar("업로드 하지 않은 파일이있습니다", {
                            variant: "error",
                            autoHideDuration: 2000,
                          });
                          return closeModal();
                        }
                        const newValue = values?.map((v) =>
                          Object.assign(
                            {},
                            {
                              pk: v.pk,
                              field_pk: v.field_pk,
                              value: v.value,
                            }
                          )
                        );
                        const res = await Axios.Post("db/list", {
                          token: getAccessToken(),
                          list_pk: router.query.db,
                          db_pk: router.query.menu,
                          organization_code: org_code,
                          user_pk: user_code,
                          status: status,
                          org_status: org_status,
                          geo_parent: parent_area,
                          geo_name: child_area,
                          values: [...newValue],
                        });

                        if (res?.code === 200) {
                          closeModal();
                          enqueueSnackbar("DB 수정이 완료되었습니다.", {
                            variant: "success",
                            autoHideDuration: 2000,
                          });
                          router.back();
                        } else {
                          enqueueSnackbar(res?.message, {
                            variant: "error",
                            autoHideDuration: 2000,
                          });
                        }
                      },
                    },
                  })
                }
              />
            )}

            <Button
              variant="contained"
              bgColor="gray"
              text="목록보기"
              color="primary.white"
              fs="h5"
              w={100}
              h={35}
              action={() => router.back()}
            />
          </Row>
          {(allocated_user?.pk === user_info?.pk ||
            rank === "관리자" ||
            uploader?.pk === user_info?.pk) && (
            <Button
              variant="contained"
              bgColor="red"
              text="삭제"
              color="primary.white"
              fs="h5"
              w={100}
              h={35}
              action={() =>
                openModal({
                  modal: "needconfirm",
                  content: {
                    contents: "해당DB를 삭제하시겠습니까?",
                    buttonText: "삭제",
                    action: async () => {
                      const res = await Axios.Post("db/list/remove", {
                        token: getAccessToken(),
                        list_pk: router.query.db,
                      });

                      if (res?.code === 200) {
                        closeModal();
                        enqueueSnackbar("DB가 삭제되었습니다.", {
                          variant: "success",
                          autoHideDuration: 2000,
                        });
                        router.back();
                      }
                    },
                  },
                })
              }
            />
          )}
        </Row>
      </Column>
    </Layout>
  );
}
