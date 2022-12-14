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
import { formatPhoneNumber } from "../../src/utility/formatPhone";

const Input = styled("input")({
  display: "none",
});

export default function Print() {
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

  const [orgHead, setOrgHead] = useState(""); //?????? ???????????? ????????????

  const [transcript_file, setTranscriptFile] = useState("");
  const [memo, setMemo] = useState("");

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
        } else if (valuesAge.length > 0) {
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
    if (loading) return;
    setTimeout(() => {
      window.print();
    }, 500);
  }, [loading]);

  if (loading) return <></>;

  return (
    <Row justifyContent={"between"} sx={{ width: "100%", gap: 2.8, p: 3 }}>
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
          <Typography variant="h1">?????? ??????</Typography>
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
                              values.filter((v) => v?.title === "????????????")?.[0]
                                ?.value === "??????"
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
                              values.filter((v) => v?.title === "????????????")?.[0]
                                ?.value === "??????"
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
                            : values.filter((v) => v?.title === "????????????")?.[0]
                                ?.value
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

          {(rank === "?????????" || rank === "?????????" || rank === "????????????") && (
            <RowLabel label="?????????" fs="h5">
              <Typography variant="h5">{db_detail?.uploader?.name}</Typography>
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

          <RowLabel label="??????" fs="h5">
            <Typography variant="h6">{organization?.name}</Typography>
          </RowLabel>
          {rank !== "?????????" &&
            rank !== "????????????" &&
            rank !== "?????????" &&
            rank !== "?????????" &&
            rank !== "??????" &&
            rank !== "?????????" && (
              <RowLabel label="??????/??????" fs="h5" alignItems="stasrt">
                <Row sx={{ width: "100%", gap: 1 }}>
                  <LabelOutLineSelectInput
                    alignItems={"start"}
                    native
                    title="??????"
                    disabled={
                      allocated_user?.pk !== user_info?.pk && rank !== "?????????"
                    }
                    w={"50%"}
                    menuItems={orgMenuList}
                    value={orgHead}
                    setValue={setOrgHead}
                  />
                  {/* <LabelOutLineGroupingSelectInput
                  alignItems={"start"}
                  title="???"
                  w={"100%"}
                  disabled={
                    allocated_user?.pk !== user_info?.pk && rank !== "?????????"
                  }
                /> */}
                  {/* <LabelOutLineSelectInput
                  alignItems={"start"}
                  title="???"
                  disabled={
                    allocated_user?.pk !== user_info?.pk && rank !== "?????????"
                  }
                  w={"100%"}
                  menuItems={teamMenuList}
                  value={team}
                  setValue={setTeam}
                /> */}
                  <LabelOutLineSelectInput
                    alignItems={"start"}
                    title="????????????"
                    disabled={
                      allocated_user?.pk !== user_info?.pk && rank !== "?????????"
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
    </Row>
  );
}
