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
import RadioInput from "../../src/components/Radio";
import { useSnackbar } from "notistack";
import uploadFile from "../../src/utility/uploadFile";
import { argument_status } from "../../src/data/share/MenuByTextList";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import {
  getOrgWithUnit,
  getOrgByOfficeNameWithUnit,
  getOrgWithManyUnit,
} from "../../src/utility/organization/getOrgWithUnit";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { formatPhoneNumber } from "../../src/utility/formatPhone";
import {
  getTitleOfOrg,
  getTitleOfOrg_name,
} from "../../src/utility/organization/getTitleOfOrg";
import Carousel from "nuka-carousel";

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isGift, setIsGift] = useState("");

  const [orgHead, setOrgHead] = useState(""); //?????? ???????????? ????????????

  // file uplad state
  const [transcript_file, setTranscriptFile] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const [asImageFile, setAsImageFile] = useState("");
  const [asImageFileLoading, setAsImageFileLoading] = useState("");

  const [memo, setMemo] = useState("");
  const [reasonModalCount, setReasonModalCount] = useState(0);

  //menuItmes
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({});
  const [orgMenuList, setOrgMenuList] = useState({});
  const [teamMenuList, setTeamMenuList] = useState({});
  const [uploaderMenuList, setUploaderMenuList] = useState({});
  const [areaParentMenuList, setAreaParentMenuList] = useState({
    ??????: "??????",
  });
  const [areaChildMenuList, setAreaChildMenuList] = useState({ ??????: "??????" });
  const [userMenuList, setUserMenuList] = useState({});

  const [date_range, setDateRange] = useState(new Date());
  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  // TODO
  // ?????? ?????? menulist ??????

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
      const dataObj = newData.filter((data) => data.title === "??????");
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
      enqueueSnackbar("??????????????? ???????????? ??????????????????", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, [dateAgeChangeLog]);

  useEffect(() => {
    if (!date && age)
      setValues((prev) => {
        const newData = [...prev];
        const dataObj = newData.filter((data) => data.title === "??????");
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
        let valuesAge = values?.filter((v) => v?.title === "??????")?.[0]?.value;

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
        } else if (valuesAge?.length > 0) {
          setDateAge(valuesAge);
        }
      }

      setLoading(false);
    };

    getDbDetail();
  }, [router.isReady, router.query.db]);

  //??????????????????
  useEffect(() => {
    if (!parent_area || parent_area === "??????" || area?.length === 0) return;

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

  useEffect(() => {
    if (!router.isReady) return;
    const getPhoneNumber = async () => {
      const res = (
        await Axios.Post("db/list/vn", {
          token: getAccessToken(),
          db_list_pk: router.query.db,
        })
      )?.data;

      if (res?.vn_number) {
        setPhoneNumber(res?.vn_number);
      }
    };

    getPhoneNumber();
  }, [router.isReady]);

  useEffect(() => {
    if (status === "????????????(AS??????)" && reasonModalCount === 1) {
      openModal({
        modal: "asreason",
        content: {
          action: (_memo, _transcript) => {
            const getMemoField = menu_detail?.fields?.find(
              (data) => data?.property.name === "??????"
            );

            const getRecordField = menu_detail?.fields?.find(
              (data) => data?.property.name === "?????? ??????"
            );

            setValues((prev) => {
              const newData = [...prev];

              const newMemo = Object.assign(
                {},
                {
                  field_pk: getMemoField?.pk,
                  title: "??????",
                  value: _memo,
                  created_date: new Date(+new Date() + 3240 * 10000)
                    .toISOString()
                    .replace("T", " ")
                    .replace(/\..*/, ""),
                }
              );

              const newTranscipt = Object.assign(
                {},
                {
                  field_pk: getRecordField?.pk,
                  title: "?????? ??????",
                  value:
                    user_info?.grade === "?????????"
                      ? `cooperation|${_transcript}`
                      : user_info?.grade === "?????????" ||
                        user_info?.grade === "????????????"
                      ? `manager|${_transcript}`
                      : `user|${_transcript}`,
                  created_date: new Date(+new Date() + 3240 * 10000)
                    .toISOString()
                    .replace("T", " ")
                    .replace(/\..*/, ""),
                }
              );

              if (_memo && _transcript) {
                newData.push(newMemo, newTranscipt);
              } else if (_memo) {
                newData.push(newMemo);
              } else if (_transcript) {
                newData.push(newTranscipt);
              }

              return newData;
            });
            setReasonModalCount(0);
          },
        },
      });
    }
  }, [status]);

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
            <Typography variant="h1">
              {router.query.menu === "146" ? "?????? ??????" : "?????? ??????"}
            </Typography>
            {menu_detail?.fields?.map((field, key) => {
              if (field?.is_detail_shown === 1) {
                switch (field?.property?.name) {
                  case "?????????":
                    return (
                      <RowLabel label="?????????" fs="h5" key={key}>
                        <OutLineInput
                          disabled={
                            rank !== "?????????" &&
                            rank !== "?????????" &&
                            rank !== "????????????"
                          }
                          defaultValue={
                            values.filter((v) => v?.title === "?????????")?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "?????????"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );
                  case "?????????":
                    return (
                      <RowLabel label="?????????" fs="h5" key={key}>
                        <OutLineInput
                          disabled={
                            rank !== "?????????" &&
                            rank !== "?????????" &&
                            rank !== "????????????"
                          }
                          defaultValue={
                            formatPhoneNumber(
                              values.filter((v) => v?.title === "?????????")?.[0]
                                ?.value
                            ) ||
                            values.filter((v) => v?.title === "?????????")?.[0]
                              ?.value
                          }
                          onBlur={(e) => {
                            const regPhone =
                              /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/;

                            if (!regPhone.test(e.target.value))
                              return enqueueSnackbar(
                                "???????????? ????????? 000-0000-000 ?????????.",
                                {
                                  variant: "error",
                                  autoHideDuration: 2000,
                                }
                              );

                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data.title === "?????????"
                              );
                              dataObj[0].value = e.target.value;

                              return newData;
                            });
                          }}
                        />
                        {rank !== "?????????" &&
                          rank !== "????????????" &&
                          rank !== "?????????" &&
                          rank !== "????????????" && (
                            <>
                              <Row
                                sx={{
                                  display: {
                                    lg: "flex",
                                    md: "flex",
                                    sm: "none",
                                    xs: "none",
                                  },
                                }}
                              >
                                <Image
                                  src="/call.png"
                                  width={24}
                                  height={24}
                                  alt="call"
                                  className="cursor"
                                  onClick={() => {
                                    openModal({
                                      modal: "needconfirm",
                                      content: {
                                        buttonText: "??????",
                                        action: closeModal,
                                        text: phoneNumber
                                          ? `?????? ?????? ??? ?????? ????????? ?????? ????????? ?????? ?????? ${phoneNumber} ??? ????????? ???????????????.`
                                          : "??????????????? ???????????? ???????????????.",
                                      },
                                    });
                                  }}
                                />
                              </Row>
                              <Row
                                sx={{
                                  display: {
                                    lg: "none",
                                    md: "none",
                                    sm: "flex",
                                    xs: "flex",
                                  },
                                }}
                              >
                                <a href={`tel:${phoneNumber}`}>
                                  <Image
                                    src="/call.png"
                                    width={18}
                                    height={18}
                                    layout="fixed"
                                    alt="call"
                                    className="cursor"
                                    onClick={() => {}}
                                  />
                                </a>
                              </Row>
                            </>
                          )}
                      </RowLabel>
                    );
                  case "??????":
                    return (
                      <RowLabel label="??????" fs="h5" key={key}>
                        <div ref={el} style={{ width: "50%" }}>
                          <DatePicker
                            disabled={
                              rank !== "?????????" &&
                              rank !== "?????????" &&
                              rank !== "????????????"
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
                            rank !== "?????????" &&
                            rank !== "?????????" &&
                            rank !== "????????????"
                          }
                          defaultValue={(() => {
                            let filterValue = values.filter(
                              (v) => v?.title === "??????"
                            )?.[0]?.value;

                            return filterValue?.length < 5
                              ? values.filter((v) => v?.title === "??????")?.[0]
                                  ?.value
                              : filterValue?.length === 8
                              ? new Date().getFullYear() -
                                new Date(
                                  filterValue?.slice(0, 4) +
                                    "-" +
                                    filterValue?.slice(4, 6) +
                                    "-" +
                                    filterValue?.slice(6, 8)
                                ).getFullYear() +
                                1
                              : new Date().getFullYear() -
                                new Date(filterValue).getFullYear() +
                                1;
                          })()}
                          onBlur={(e) => setAge(e.target.value)}
                        />
                      </RowLabel>
                    );
                  case "??????":
                    return (
                      <RowLabel label="??????" fs="h5" key={key}>
                        <FormControlLabel
                          label="??????"
                          control={
                            <RadioInput
                              disabled={
                                rank !== "?????????" &&
                                rank !== "????????????" &&
                                rank !== "?????????" &&
                                rank !== "????????????"
                              }
                              checked={
                                values.filter((v) => v?.title === "??????")?.[0]
                                  ?.value === "??????"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "??????"
                                  );
                                  dataObj[0].value = "??????";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                        <FormControlLabel
                          label="??????"
                          control={
                            <RadioInput
                              disabled={
                                rank !== "?????????" &&
                                rank !== "????????????" &&
                                rank !== "?????????" &&
                                rank !== "????????????"
                              }
                              checked={
                                values.filter((v) => v?.title === "??????")?.[0]
                                  ?.value === "??????"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "??????"
                                  );
                                  dataObj[0].value = "??????";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                      </RowLabel>
                    );
                  case "????????????":
                    return (
                      <RowLabel label="????????????" fs="h5" key={key}>
                        <FormControlLabel
                          label="??????"
                          control={
                            <RadioInput
                              disabled={
                                rank !== "?????????" &&
                                rank !== "????????????" &&
                                rank !== "?????????" &&
                                rank !== "????????????"
                              }
                              checked={
                                values.filter(
                                  (v) => v?.title === "????????????"
                                )?.[0]?.value === "??????"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "????????????"
                                  );
                                  dataObj[0].value = "??????";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                        <FormControlLabel
                          label="??????"
                          control={
                            <RadioInput
                              disabled={
                                rank !== "?????????" &&
                                rank !== "????????????" &&
                                rank !== "?????????" &&
                                rank !== "????????????"
                              }
                              checked={
                                values.filter(
                                  (v) => v?.title === "????????????"
                                )?.[0]?.value === "??????"
                              }
                              onClick={() =>
                                setValues((prev) => {
                                  const newData = [...prev];
                                  const dataObj = newData.filter(
                                    (data) => data.title === "????????????"
                                  );
                                  dataObj[0].value = "??????";

                                  return newData;
                                })
                              }
                            />
                          }
                        />
                      </RowLabel>
                    );
                  case "????????????":
                    return (
                      <RowLabel label="????????????" fs="h5" key={key}>
                        <OutLineInput
                          disabled={
                            rank !== "?????????" &&
                            rank !== "????????????" &&
                            (rank === "?????????" ||
                              rank === "?????????" ||
                              rank === "??????" ||
                              rank === "?????????") &&
                            allocated_user?.pk !== user_info?.pk
                          }
                          multiline
                          rows={3}
                          w={"100%"}
                          defaultValue={
                            rank !== "?????????" &&
                            rank !== "????????????" &&
                            (rank === "?????????" ||
                              rank === "?????????" ||
                              rank === "??????" ||
                              rank === "?????????") &&
                            allocated_user?.pk !== user_info?.pk
                              ? ""
                              : values.filter(
                                  (v) => v?.title === "????????????"
                                )?.[0]?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];

                              if (
                                newData.filter(
                                  (data) => data.title === "????????????"
                                ).length !== 0
                              )
                                newData.filter(
                                  (data) => data.title === "????????????"
                                )[0].value = e.target.value;
                              else {
                                newData.push({
                                  field_pk: field?.pk,
                                  value: e.target.value,
                                });
                              }

                              return newData;
                            })
                          }
                        />
                      </RowLabel>
                    );

                  case "??????":
                    return;
                  case "?????? ??????":
                    return;
                  case "AS?????????":
                    return;

                  default:
                    return (
                      <RowLabel label={field?.property?.name} fs="h5" key={key}>
                        <OutLineInput
                          w={"100%"}
                          disabled={
                            rank !== "?????????" &&
                            rank !== "?????????" &&
                            rank !== "????????????"
                          }
                          defaultValue={
                            values.filter((v) => v?.field_pk === field?.pk)?.[0]
                              ?.value
                          }
                          onBlur={(e) =>
                            setValues((prev) => {
                              const newData = [...prev];
                              const dataObj = newData.filter(
                                (data) => data?.pk === field?.pk
                              );

                              if (dataObj[0]?.value) {
                                dataObj[0].value = e.target.value;
                              } else {
                                newData.push({
                                  ...field,
                                  field_pk: field?.pk,
                                  value: e.target.value,
                                });
                              }

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
                rank === "?????????" ||
                rank === "?????????" ||
                rank === "??????" ||
                rank === "?????????"
                  ? "????????????"
                  : "????????????"
              }
              fs="h5"
            >
              <Typography variant="h5">
                {rank === "?????????" ||
                rank === "?????????" ||
                rank === "??????" ||
                rank === "?????????"
                  ? db_detail?.allocated_date
                  : db_detail?.created_date}
              </Typography>
            </RowLabel>
            <RowLabel label="??????" fs="h5">
              <OutLineSelectInput
                title="??????"
                placeholder={"??????"}
                w={"50%"}
                menuItems={areaParentMenuList}
                value={parent_area}
                setValue={setParentArea}
                disabled={
                  rank !== "?????????" && rank !== "?????????" && rank !== "????????????"
                }
              />
              <OutLineSelectInput
                w={"50%"}
                placeholder={"????????????"}
                menuItems={areaChildMenuList}
                value={child_area}
                setValue={setChildArea}
                disabled={
                  rank !== "?????????" && rank !== "?????????" && rank !== "????????????"
                }
              />
            </RowLabel>

            {(rank === "?????????" ||
              rank === "?????????" ||
              rank === "????????????") && (
              <RowLabel label="?????????" fs="h5">
                <Typography variant="h5">
                  {db_detail?.uploader?.name}
                </Typography>
              </RowLabel>
            )}
          </Column>
          <Column sx={{ width: "100%", maxWidth: 463, gap: 2.8 }}>
            <Typography variant="h1">????????? ??????</Typography>
            <RowLabel label="????????????" fs="h5">
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
                                rank !== "?????????"
                              }
                              checked={status === list}
                              onClick={() => {
                                list === "????????????(AS??????)" &&
                                  setReasonModalCount(1);
                                setStatus(list);
                              }}
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
                <RoundColorBox background={argument_status[status]}>
                  <Typography variant="h6">{status}</Typography>
                </RoundColorBox>
              )}
            </RowLabel>
            {rank !== "?????????" &&
              rank !== "?????????" &&
              rank !== "??????" &&
              rank !== "?????????" && (
                <RowLabel label="????????????" fs="h5">
                  <OutLineSelectInput
                    disabled={
                      (allocated_user?.pk !== user_info?.pk &&
                        rank !== "?????????" &&
                        uploader?.pk !== user_info?.pk &&
                        user_info?.org_code !== uploader?.organization?.code) ||
                      status !== "????????????(AS??????)"
                    }
                    w={"50%"}
                    menuItems={{
                      AS??????: "AS??????",
                      AS??????: "AS??????",
                      default: "default",
                    }}
                    value={org_status}
                    setValue={setOrgStatus}
                  />
                </RowLabel>
              )}

            {rank !== "?????????" && rank !== "????????????" && (
              <RowLabel label="??????" fs="h5">
                <Typography variant="h6">{organization?.name}</Typography>
              </RowLabel>
            )}
            {rank !== "?????????" &&
              rank !== "????????????" &&
              rank !== "?????????" &&
              rank !== "?????????" &&
              rank !== "??????" &&
              rank !== "?????????" && (
                <RowLabel label="??????/??????" fs="h5" alignItems="center">
                  <Button
                    variant="contained"
                    bgColor="primary"
                    text="??????"
                    color="primary.white"
                    fs="h5"
                    h={28}
                    // disabled={
                    //   (allocated_user?.pk !== user_info?.pk &&
                    //     rank !== "?????????" &&
                    //     rank !== "????????????") ||
                    //   getTitleOfOrg(allocated_user) ||
                    //   allocated_user?.name
                    // }
                    action={() =>
                      openModal({
                        modal: "chooseuser",
                        data: {
                          geo: parent_area,
                          isGift: isGift,
                        },
                        content: {
                          action: {
                            setUserCode: (value) => setUserCode(value),
                            setIsGift: (value) => setIsGift(value),
                          },
                        },
                      })
                    }
                  />
                  <Row sx={{ width: "100%", gap: 1 }} alignItems={"center"}>
                    <Typography>
                      {user_code?.pk === 0
                        ? ""
                        : user_code?.org
                        ? user_code?.org + " " + user_code?.name
                        : getTitleOfOrg(allocated_user)
                        ? getTitleOfOrg(allocated_user) +
                          " " +
                          allocated_user?.name
                        : ""}
                    </Typography>
                  </Row>
                </RowLabel>
              )}
          </Column>
        </Row>
        {menu_detail?.fields?.filter(
          (field) =>
            (field?.is_detail_shown === 1 &&
              field?.property?.name === "AS?????????") ||
            (field?.is_detail_shown === 1 &&
              field?.property?.name === "AS?????????") ||
            (field?.is_detail_shown === 1 &&
              field?.property?.name === "AS?????????")
        ).length !== 0 && (
          <Typography variant="h4" color="primary.red">
            ???????????? ??? ????????? ?????? ??? ????????? ????????????, ????????? ?????? ?????? ???
            ????????? ?????? ????????????.
          </Typography>
        )}

        {/* AS ????????? ?????? */}

        {(allocated_user?.pk === user_info?.pk ||
          rank === "?????????" ||
          user_info?.org_code === uploader?.organization?.code ||
          uploader?.pk === user_info?.pk) &&
          menu_detail?.fields
            ?.filter(
              (field) =>
                field?.is_detail_shown === 1 &&
                field?.property?.name === "AS?????????"
            )
            ?.map((filter_data) => (
              <>
                <Column sx={{ gap: 1 }}>
                  <Row alignItems={"center"} sx={{ gap: 2 }}>
                    <Typography variant="h1">AS?????????</Typography>
                    <Row
                      alignItems={"center"}
                      justifyContent={"start"}
                      sx={{ gap: 1 }}
                    >
                      <label htmlFor="image-button-file">
                        <Input
                          accept="image/*"
                          id="image-button-file"
                          type="file"
                          onChange={(e) => setAsImageFile(e.target.files[0])}
                        />

                        <Button
                          text="????????????"
                          fs="h5"
                          bgColor={"gray"}
                          color={"primary.white"}
                          h={28}
                          component={"span"}
                        />
                      </label>

                      <UnderLineInput
                        disabled
                        value={asImageFile?.name || ""}
                      />
                      <LoadingButton
                        variant="contained"
                        loading={asImageFileLoading}
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          height: 28,
                          mt: 0.1,
                        }}
                        onClick={async () => {
                          if (!asImageFile)
                            return enqueueSnackbar("????????? ??????????????????", {
                              variant: "error",
                              autoHideDuration: 2000,
                            });
                          setAsImageFile(true);
                          const _uploadFile = await uploadFile(asImageFile);

                          if (_uploadFile) {
                            const getAsField = menu_detail?.fields?.find(
                              (data) => data?.property.name === "AS?????????"
                            );

                            setValues((prev) => {
                              const newData = [...prev];

                              const newObj = Object.assign(
                                {},
                                {
                                  field_pk: getAsField?.pk,
                                  title: "AS?????????",
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
                            if (!asImageFileLoading) {
                              setAsImageFile("");
                              document.querySelector(
                                "#contained-button-file"
                              ).value = "";

                              enqueueSnackbar(
                                "AS????????? ??????????????? ?????? ???????????????.",
                                {
                                  variant: "success",
                                  autoHideDuration: 2000,
                                }
                              );
                            }
                          }
                        }}
                      >
                        ?????????
                      </LoadingButton>
                    </Row>
                  </Row>
                  <Row
                    justifyContent={"start"}
                    wrap={"wrap"}
                    sx={{
                      width: "fit-content",
                      columnGap: 6,
                      rowGap: 1,
                      mt: 1,
                      border:
                        values?.filter(
                          (v, _key) =>
                            v?.title === "AS?????????" &&
                            v?.value &&
                            v?.value.includes("https")
                        )?.length !== 0 && "1px solid black",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      openModal({
                        modal: "imageslider",
                        data: values,
                      })
                    }
                  >
                    {values?.map(
                      (v, _key) =>
                        v?.title === "AS?????????" &&
                        v?.value &&
                        v?.value.includes("https") && (
                          <Column
                            alignItems={"center"}
                            sx={{
                              // width: "100%",
                              p: 1,
                            }}
                          >
                            <Image
                              src={v?.value || "/"}
                              width={"100%"}
                              height={140}
                              alt=""
                            />
                            <Typography variant="h6" mb={1} align="center">
                              {values.filter((v) => v?.title === "?????????")?.[0]
                                ?.value + "?????????"}{" "}
                              <br />
                              {v?.created_date}
                            </Typography>
                            <a href={v?.value} target="_blank" rel="noreferrer">
                              <Button
                                variant="contained"
                                bgColor="primary"
                                text="????????????"
                                color="primary.white"
                                fs="h6"
                                w={80}
                                h={20}
                                // action={() => {}}
                              />
                            </a>
                          </Column>
                        )
                    )}
                  </Row>
                </Column>
              </>
            ))}

        {/* ???????????? */}

        {(allocated_user?.pk === user_info?.pk ||
          rank === "?????????" ||
          user_info?.org_code === uploader?.organization?.code ||
          uploader?.pk === user_info?.pk) &&
          menu_detail?.fields
            ?.filter(
              (field) =>
                field?.is_detail_shown === 1 &&
                field?.property?.name === "?????? ??????"
            )
            ?.map((filter_data) => (
              <>
                <Column sx={{ gap: 1 }}>
                  <Row alignItems={"center"} sx={{ gap: 2 }}>
                    <Typography variant="h1">????????????</Typography>
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
                          text="????????????"
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
                            return enqueueSnackbar("????????? ??????????????????", {
                              variant: "error",
                              autoHideDuration: 2000,
                            });
                          setFileLoading(true);
                          const _uploadFile = await uploadFile(transcript_file);

                          if (_uploadFile) {
                            const getRecordField = menu_detail?.fields?.find(
                              (data) => data?.property.name === "?????? ??????"
                            );

                            setValues((prev) => {
                              const newData = [...prev];

                              const newObj = Object.assign(
                                {},
                                {
                                  field_pk: getRecordField?.pk,
                                  title: "?????? ??????",
                                  value:
                                    user_info?.grade === "?????????"
                                      ? `cooperation|${_uploadFile}`
                                      : user_info?.grade === "?????????" ||
                                        user_info?.grade === "????????????"
                                      ? `manager|${_uploadFile}`
                                      : `user|${_uploadFile}`,
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
                                "????????? ??????????????? ?????? ???????????????.",
                                {
                                  variant: "success",
                                  autoHideDuration: 2000,
                                }
                              );
                            }
                          }
                        }}
                      >
                        ?????????
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
                        v?.title === "?????? ??????" &&
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
                              {(v?.value?.split("|")?.[0] === "cooperation"
                                ? "?????????"
                                : v?.value?.split("|")?.[0] === "manager"
                                ? "?????????"
                                : "?????????") +
                                " " +
                                v?.created_date}
                            </Typography>
                            <audio
                              controls
                              src={v?.value?.split("|")?.[1] || v?.value}
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
        {/* } */}
        {
          // (allocated_user?.pk === user_info?.pk ||
          //   rank === "?????????" ||
          //   user_info?.org_code === uploader?.organization?.code ||
          //   uploader?.pk === user_info?.pk) &&
          menu_detail?.fields
            ?.filter(
              (field) =>
                field?.is_detail_shown === 1 && field?.property?.name === "??????"
            )
            ?.map((filter_data, key) => (
              <Column sx={{ gap: 1, maxWidth: 1020 }} key={key}>
                <Row alignItems={"center"} sx={{ gap: 2 }}>
                  <Typography variant="h1">????????????</Typography>
                  <Button
                    variant="contained"
                    bgColor="primary"
                    text="????????????"
                    color="primary.white"
                    fs="h5"
                    h={28}
                    action={() => {
                      if (!memo)
                        return enqueueSnackbar("???????????? ??????????????????", {
                          variant: "error",
                          autoHideDuration: 2000,
                        });

                      const getRecordField = menu_detail?.fields?.find(
                        (data) => data?.property.name === "??????"
                      );

                      setMemo("");
                      setValues((prev) => {
                        const newData = [...prev];

                        const newObj = Object.assign(
                          {},
                          {
                            field_pk: getRecordField?.pk,
                            title: "??????",
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
                  placeholder="????????? ??????????????????."
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
                      v?.title === "??????" &&
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
            ))
        }

        <Row justifyContent={"between"} sx={{ gap: "12px", width: "100%" }}>
          <Button
            variant="contained"
            bgColor="print"
            text="??????"
            color="primary.white"
            fs="h5"
            w={100}
            h={35}
            action={() =>
              window.open(
                `/db/print?db=${router.query.db}&menu=${router.query.menu}`,
                "_blank"
              )
            }
          />

          <Row sx={{ gap: 1 }}>
            {(allocated_user?.pk === user_info?.pk ||
              rank === "?????????" ||
              rank === "????????????" ||
              user_info?.org_code === uploader?.organization?.code ||
              uploader?.pk === user_info?.pk) && (
              <Button
                variant="contained"
                bgColor="primary"
                text="??????"
                color="primary.white"
                fs="h5"
                w={100}
                h={35}
                action={() =>
                  openModal({
                    modal: "needconfirm",
                    content: {
                      contents: "????????? ????????????????????????? ",
                      action: async () => {
                        console.log(user_code);
                        if (transcript_file) {
                          enqueueSnackbar("????????? ?????? ?????? ?????????????????????", {
                            variant: "error",
                            autoHideDuration: 2000,
                          });
                          return closeModal();
                        }

                        if (!parent_area)
                          return enqueueSnackbar("????????? ??????????????????.", {
                            variant: "error",
                            autoHideDuration: 2000,
                          });

                        let newValues = values?.map((v) =>
                          Object.assign(
                            {},
                            {
                              pk: v.pk,
                              field_pk: v.field_pk,
                              value: v.value,
                            }
                          )
                        );
                        const getRecordField = menu_detail?.fields?.find(
                          (data) => data?.property.name === "??????"
                        );

                        const res = await Axios.Post("db/list", {
                          token: getAccessToken(),
                          list_pk: router.query.db,
                          db_pk: router.query.menu,
                          organization_code: org_code,
                          user_pk: user_code?.pk,
                          status: status,
                          org_status:
                            org_status === "default" ? undefined : org_status,
                          geo_parent: parent_area,
                          geo_name: child_area,
                          is_gift: isGift,
                          values: memo
                            ? [
                                ...newValues,
                                {
                                  field_pk: getRecordField?.pk,
                                  value: memo,
                                },
                              ]
                            : [...newValues],
                        });

                        if (res?.code === 200) {
                          closeModal();
                          enqueueSnackbar("DB ????????? ?????????????????????.", {
                            variant: "success",
                            autoHideDuration: 2000,
                          });

                          window.localStorage.query
                            ? router.push(
                                `db?menu=${router.query.menu}&${window.localStorage.query}`
                              )
                            : router.back();
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
              text="????????????"
              color="primary.white"
              fs="h5"
              w={100}
              h={35}
              action={() => {
                window.localStorage.query
                  ? router.push(
                      `/db?menu=${router.query.menu}&${window.localStorage.query}`
                    )
                  : router.back();
              }}
            />
          </Row>
          {(allocated_user?.pk === user_info?.pk ||
            rank === "?????????" ||
            rank === "????????????" ||
            uploader?.pk === user_info?.pk) && (
            <Button
              variant="contained"
              bgColor="red"
              text="??????"
              color="primary.white"
              fs="h5"
              w={100}
              h={35}
              action={() =>
                openModal({
                  modal: "needconfirm",
                  content: {
                    text: "??????DB??? ?????????????????????????",
                    buttonText: "??????",
                    action: async () => {
                      const res = await Axios.Post("db/list/remove", {
                        token: getAccessToken(),
                        list_pk: router.query.db,
                      });

                      if (res?.code === 200) {
                        closeModal();
                        enqueueSnackbar("DB??? ?????????????????????.", {
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
