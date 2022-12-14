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
  Input,
  FormControlLabel,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TopLabelContents from "../../src/components/Box/TopLableContents";
import RowLabel from "../../src/components/Box/RowLabel";
import UnderLineInput, { OutLineInput } from "../../src/components/Input";
import Button from "../../src/components/Button";
import { OutLineSelectInput } from "../../src/components/Input/Select";
import { status_list, rank_list } from "../../src/data/share/MenuByTextList";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import { styles } from "../../src/styles/bojang";
import useGetUserDetail from "../../src/hooks/user/useGetUserDetail";
import useGetOrganization from "../../src/hooks/share/useGetOrganization";
import api from "../../src/utility/api";
import { getAccessToken, getCookie } from "../../src/utility/getCookie";
import CustomSwitch from "../../src/components/Switch";
import { useSnackbar } from "notistack";
import useGetMenus from "../../src/hooks/setting/useGetMenus";
import BackgroundTextBox from "../../src/components/Box/BackgroundText";
import Axios from "../../src/utility/api";
import {
  getOrgWithUnit,
  getOrgHeadOffice,
  getOrgByParentRank,
} from "../../src/utility/organization/getOrgWithUnit";
import useGetArea from "../../src/hooks/setting/useGetArea";
import { sortGeo } from "../../src/utility/sortGeo";
import DbApplyStatusTable from "../../src/components/Table/db-apply-status";

const rowLabelWidth = {
  width: {
    lg: "40%",
    md: "60%",
    sm: "60%",
    xs: "100%",
  },
};

export default function UserDetail() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  //data
  const [loading, setLoading] = useState(true);
  // const { user_detail } = useGetUserDetail(router.query.detail);

  const { sales, org_pending } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");

  const { area } = useGetArea();

  const { menus } = useGetMenus();

  const [org_code_by_sales, setOrgCodeBySales] = useState([]);
  const [db_histroy, setDbHistory] = useState([]);

  //login info
  const [rank] = useState(getCookie("user_info")?.grade);
  //change state
  const [org_name, setOrgName] = useState("");
  const [org_code, setOrgCode] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [db, setDb] = useState([]); //????????? ???????????? state
  const [changeDb, setChangeDb] = useState([]); //?????? state
  const [head_office_name, setHeadOfficeName] = useState("");
  const [head_office_code, setHeadOfficeCode] = useState("");
  const [pk, setPk] = useState("");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState();

  const [header_org, setHeaderOrg] = useState("");
  const [branch_name, setBranchName] = useState("");
  const [branch_code, setBranchCode] = useState("");
  const [team_name, setTeamName] = useState("");
  const [team_code, setTeamCode] = useState("");

  const [idCheck, setIdCheck] = useState(false);

  //menuList
  const [orgMenuList, setOrgMenuList] = useState({}); //??????
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({}); //??????
  const [branchMenuList, setBranchMenuList] = useState({}); //??????
  const [teamMenuList, setTeamMenuList] = useState({}); //???
  const [cooperationMenuList, setCooperationMenuList] = useState("");

  useEffect(() => {
    const head_org = {};

    getOrgHeadOffice(sales, head_org);

    setOrgMenuList(head_org);
  }, [org_pending]);

  useEffect(() => {
    if (!org_code) return;
    const getOrgCodeByData = async () => {
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
        setOrgCodeBySales(res?.data);
      }
    };

    getOrgCodeByData();
  }, [org_code]);

  useEffect(() => {
    if (!org_code) return;
    if (grade === "?????????" || grade === "?????????") {
      const head_result = {};

      getOrgByParentRank(sales, "region", org_code, head_result);

      setHeadOfficeMenuList(head_result);
    } else if (grade === "??????") {
      const branch_result = {};

      getOrgWithUnit(org_code_by_sales, "branch", branch_result);

      setBranchMenuList(branch_result);
    } else if (grade === "?????????") {
      const team_result = {};

      getOrgWithUnit(org_code_by_sales, "team", team_result);

      setTeamMenuList(team_result);
    }
  }, [grade, org_code_by_sales]);

  useEffect(() => {
    if (grade === "????????????") {
      const coop_org = {};
      getOrgHeadOffice(cooperation, coop_org);
      setCooperationMenuList(coop_org);
    }
  }, [grade]);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.detail !== "new-id") {
      const getDetail = async () => {
        const res = (
          await Axios.Get(`member/${router.query.detail}`, {
            params: {
              token: getAccessToken(),
            },
          })
        )?.data;
        if (res?.code === 200) {
          const {
            id,
            status,
            pk,
            grade,
            name,
            phone,
            email,
            birthdate,
            db,
            org_code,
            head_office_org_code,
            parent_org_code,
            branch,
            team,
            region,
            head_office,
          } = res?.data;
          setId(id);
          setPassword();
          setStatus(status);
          setGrade(grade || "");
          setName(name);
          setPhone(phone);
          setBirthdate(birthdate);
          setDb(db);
          setChangeDb((prev) => {
            const newData = [...prev];
            db.map((d) =>
              newData.push({
                db_pk: d.pk,
                allocation: [
                  {
                    is_activated: d.allocation.is_activated,
                    count: d.allocation.count,
                  },
                ],
                geomap: (() => {
                  const geoData = [];
                  d.geomap?.map((geo) => geoData.push({ name: geo?.name }));
                  return geoData;
                })(),
              })
            );

            return newData;
          });

          setEmail(email);
          setBirthdate(birthdate);
          setOrgCode(head_office_org_code);
          setHeaderOrg(head_office_org_code);
          setHeadOfficeCode(parent_org_code);
          setHeadOfficeName(region);
          setBranchName(branch);
          setBranchCode(parent_org_code);
          setTeamCode(org_code);
          setTeamName(team);
          setPk(pk);
        }
      };

      getDetail();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!router.isReady) return;

    if (menus.length !== 0 && router.query.detail === "new-id") {
      setDb((prev) => {
        const newData = [...prev];

        menus.map((m) =>
          newData.push({
            title: m?.title,
            geomap: [],
            allocation: { is_activated: 0, count: 0 },
          })
        );

        return newData;
      });
      setChangeDb((prev) => {
        const newData = [...prev];
        menus.map((m) =>
          newData.push({
            db_pk: m?.pk,
            geomap: [],
            allocation: [{ is_activated: 0, count: 0 }],
          })
        );

        return newData;
      });
    }
  }, [router.isReady, menus]);

  useEffect(() => {
    if (!pk) return;

    const getDbHistory = async () => {
      const res = (
        await Axios.Get("member/db/history", {
          params: {
            token: getAccessToken(),
            page: page,
            user_pk: pk,
          },
        })
      )?.data;

      if (res?.code === 200) {
        setDbHistory(res?.data?.result);
        setTotalCount(Math.ceil(res?.data.total_count / 20));
      }
    };

    getDbHistory();
  }, [page, pk]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  //TODO
  //DB?????? setstate

  return (
    <Layout loading={loading}>
      <Column sx={{ p: "40px", gap: "20px" }}>
        <Typography variant="h1">
          {router.query.detail !== "new-id" ? "????????? ??????" : "?????? ??????"}
        </Typography>
        <TopLabelContents
          title="??????"
          fs="h4"
          sx={{ ...styles.argument_status_contents }}
        >
          {Object.entries(status_list).map(([list, color], key) => {
            if (key !== 0)
              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      disabled={
                        router.query.detail !== "new-id" &&
                        (status === "?????????" || rank === "????????????")
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
              );
          })}
        </TopLabelContents>
        <TopLabelContents
          title="??????"
          fs="h4"
          sx={{
            width: { lg: "80%", xs: "100%" },
            ...styles.argument_status_contents,
          }}
        >
          {Object.entries(rank_list).map(
            ([list, color], key) =>
              key !== 0 && (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      disabled={
                        router.query.detail !== "new-id" &&
                        (status === "?????????" || rank === "????????????")
                      }
                      checked={grade === list || grade === list}
                      onClick={() => setGrade(list)}
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

        {grade === "????????????" && (
          <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              w="50%"
              defaultValue={head_office_name}
              onBlur={(e) => setOrgName(e.target.value)}
            />
          </RowLabel>
        )}
        {(grade === "?????????" ||
          grade === "?????????" ||
          grade === "??????" ||
          grade === "?????????") && (
          <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              w="50%"
              defaultValue={org_code}
              menuItems={orgMenuList}
              value={org_code}
              setValue={setOrgCode}
            />
          </RowLabel>
        )}
        {grade === "????????????" && (
          <RowLabel label="????????????" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              defaultValue={org_code}
              w="50%"
              menuItems={cooperationMenuList}
              value={org_code}
              setValue={setOrgCode}
            />
          </RowLabel>
        )}
        {grade !== "" &&
          grade !== "????????????" &&
          grade !== "??????" &&
          grade !== "?????????" &&
          grade !== "?????????" &&
          grade !== "????????????" && (
            <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
              {grade === "?????????" ? (
                <OutLineInput
                  disabled={
                    router.query.detail !== "new-id" &&
                    (status === "?????????" || rank === "????????????")
                  }
                  w="50%"
                  defaultValue={head_office_name}
                  onBlur={(e) => setHeadOfficeName(e.target.value)}
                />
              ) : (
                <OutLineSelectInput
                  disabled={
                    router.query.detail !== "new-id" &&
                    (status === "?????????" || rank === "????????????")
                  }
                  w="50%"
                  menuItems={headOfficeMenuList}
                  value={head_office_code}
                  setValue={setHeadOfficeCode}
                />
              )}
            </RowLabel>
          )}

        {grade === "?????????" && (
          <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              w="50%"
              defaultValue={branch_name}
              onBlur={(e) => setBranchName(e.target.value)}
            />
          </RowLabel>
        )}
        {grade === "??????" && (
          <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              w="50%"
              menuItems={branchMenuList}
              value={branch_code}
              setValue={setBranchCode}
            />
          </RowLabel>
        )}

        {grade === "??????" && (
          <>
            <RowLabel label="??????" sx={rowLabelWidth} label_w={83}>
              <OutLineInput
                disabled={
                  router.query.detail !== "new-id" &&
                  (status === "?????????" || rank === "????????????")
                }
                w="50%"
                defaultValue={team_name}
                onBlur={(e) => setTeamName(e.target.value)}
              />
            </RowLabel>
          </>
        )}
        {grade === "?????????" && (
          <>
            <RowLabel label="??????" sx={rowLabelWidth} label_w={83}>
              <OutLineSelectInput
                disabled={
                  router.query.detail !== "new-id" &&
                  (status === "?????????" || rank === "????????????")
                }
                w="50%"
                menuItems={teamMenuList}
                defaultValue={team_code}
                value={team_code}
                setValue={setTeamCode}
              />
            </RowLabel>
          </>
        )}

        {grade !== "" && (
          <RowLabel label="????????????" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              w="50%"
              defaultValue={name}
              onBlur={(e) => setName(e.target.value)}
            />
          </RowLabel>
        )}
        {grade === "" && (
          <RowLabel label="??????" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              w="50%"
              defaultValue={name}
              onBlur={(e) => setName(e.target.value)}
            />
          </RowLabel>
        )}
        <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "?????????" || rank === "????????????")
            }
            w="50%"
            defaultValue={id}
            onBlur={(e) => setId(e.target.value)}
          />
          <Button
            text="????????????"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            h={20}
            fs="h6"
            disabled={
              router.query.detail !== "new-id" &&
              (status === "?????????" || rank === "????????????")
            }
            action={async () => {
              const res = await Axios.Post("member/iddupcheck", {
                token: getAccessToken(),
                id: id,
              });

              if (res?.code === 200) {
                enqueueSnackbar("??????????????? ????????? ?????????.", {
                  variant: "success",
                  autoHideDuration: 2000,
                });
                setIdCheck(true);
              } else {
                enqueueSnackbar("???????????? ??????????????????.", {
                  variant: "error",
                  autoHideDuration: 2000,
                });
                setIdCheck(false);
              }
            }}
          />
        </RowLabel>
        <RowLabel label="?????? ????????????" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "?????????" || rank === "????????????")
            }
            w="50%"
            onBlur={(e) => setNewPassword(e.target.value)}
            type={"password"}
          />
        </RowLabel>
        <RowLabel label="???????????? ??????" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "?????????" || rank === "????????????")
            }
            w="50%"
            onBlur={(e) => setPassword(e.target.value)}
            type={"password"}
          />
        </RowLabel>
        <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "?????????" || rank === "????????????")
            }
            w="50%"
            defaultValue={email}
            onBlur={(e) => setEmail(e.target.value)}
          />
        </RowLabel>
        <RowLabel label="?????????" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "?????????" || rank === "????????????")
            }
            w="50%"
            defaultValue={phone}
            onBlur={(e) => setPhone(e.target.value)}
          />
        </RowLabel>
        {(grade !== "?????????" || grade !== "????????????") && (
          <RowLabel label="????????????" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "?????????" || rank === "????????????")
              }
              w="50%"
              defaultValue={birthdate}
              onBlur={(e) => setBirthdate(e.target.value)}
            />
          </RowLabel>
        )}

        {grade !== "?????????" &&
          grade !== "????????????" &&
          grade !== "????????????" &&
          grade && (
            <Column sx={{ pr: "40px", gap: "20px", mt: 3 }}>
              <Typography variant="h1">DB ??????</Typography>
              {db?.map((d, key) => (
                <Column key={key}>
                  <RowLabel
                    label={d?.title}
                    fs="h4"
                    label_w={83}
                    sx={{
                      flexDirection: {
                        lg: "row",
                        md: "row",
                        sm: "row",
                        xs: "column",
                      },
                      alignItems: {
                        lg: "center",
                        md: "center",
                        sm: "center",
                        xs: "flex-start",
                      },
                      rowGap: 2,
                    }}
                  >
                    <Row alignItems={"center"}>
                      <OutLineInput
                        disabled={
                          router.query.detail !== "new-id" &&
                          (status === "?????????" || rank === "????????????")
                        }
                        w={90}
                        defaultValue={d?.allocation?.count}
                        onBlur={(e) =>
                          setChangeDb((prev) => {
                            const newData = [...prev];
                            newData[key].allocation[0].count = e.target.value;

                            return newData;
                          })
                        }
                      />
                      <Typography variant="h6" pl={1} mr={3}>
                        ???
                      </Typography>
                      <CustomSwitch
                        disabled={
                          router.query.detail !== "new-id" &&
                          (status === "?????????" || rank === "????????????")
                        }
                        checked={
                          changeDb[key]?.allocation[0].is_activated === 1
                            ? true
                            : false
                        }
                        onClick={(e) => {
                          setChangeDb((prev) => {
                            const newData = [...prev];
                            if (newData[key].allocation[0].is_activated === 1)
                              newData[key].allocation[0].is_activated = 0;
                            else newData[key].allocation[0].is_activated = 1;

                            return newData;
                          });
                        }}
                      />
                    </Row>
                    <Row wrap={"wrap"} sx={{ gap: 1 }}>
                      <RoundColorBox
                        background={
                          changeDb[key]?.geomap.length ===
                          menus[key]?.geomap.length
                            ? "#0D1D41"
                            : "#E6E6E6"
                        }
                        fc={
                          changeDb[key]?.geomap.length ===
                          menus[key]?.geomap.length
                            ? "#FFFFFF"
                            : "#000000"
                        }
                        fs={12}
                        sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                        onClick={() => {
                          if (status === "?????????" || rank === "????????????")
                            return;
                          setChangeDb((prev) => {
                            const newData = [...prev];

                            if (
                              newData[key].geomap.length <
                              menus[key]?.geomap?.length
                            ) {
                              newData[key].geomap = [];

                              menus[key]?.geomap?.map((map) =>
                                newData[key].geomap?.push({ name: map?.name })
                              );
                            } else {
                              newData[key].geomap = [];
                            }

                            return newData;
                          });
                        }}
                      >
                        ??????
                      </RoundColorBox>
                      {/* {menus?.map((menu, area_key) => { */}
                      {/* return  */}
                      {menus[key]?.geomap?.map((geo, area_key) => (
                        <RoundColorBox
                          key={area_key}
                          background={
                            changeDb[key]?.geomap?.find(
                              (d) => d?.name === geo?.name
                            )
                              ? "#0D1D41"
                              : "#E6E6E6"
                          }
                          fc={
                            changeDb[key]?.geomap?.find(
                              (d) => d?.name === geo?.name
                            )
                              ? "#FFFFFF"
                              : "#000000"
                          }
                          fs={12}
                          sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                          onClick={() => {
                            if (status === "?????????" || rank === "????????????")
                              return;
                            setChangeDb((prev) => {
                              const newData = [...prev];
                              const newDataGeo = newData[key].geomap;

                              const foundIndex = newDataGeo?.findIndex(
                                (d) => d?.name === geo?.name
                              );

                              if (foundIndex === -1) {
                                newDataGeo.push({ name: geo?.name });
                              } else {
                                newDataGeo.splice(foundIndex, 1);
                              }

                              return newData;
                            });
                          }}
                        >
                          {geo?.name}
                        </RoundColorBox>
                      ))}
                    </Row>
                  </RowLabel>
                </Column>
              ))}
            </Column>
          )}

        <Column sx={{ pr: "40px", gap: "20px", mt: 3 }}>
          <Typography variant="h1">????????????</Typography>

          <DbApplyStatusTable data={db_histroy} page={page} />
          <Row justifyContent={"center"} sx={{ width: "100%", mt: 5 }}>
            <Pagination
              component="div"
              page={page}
              count={totalCount}
              onChange={(subject, newPage) => {
                setPage(newPage);
              }}
              color="primary"
              // hidePrevButton
              // hideNextButton
            />
          </Row>
        </Column>

        <Row justifyContent={"center"} sx={{ gap: "15px", mt: 5 }}>
          {rank === "????????????" ? (
            <Button
              text="????????????"
              variant="contained"
              bgColor="gray"
              color="primary.white"
              w={158}
              h={35}
              fs="h5"
              action={() => router.back()}
            />
          ) : (
            <>
              <Button
                text={router.query.detail === "new-id" ? "??????" : "??????"}
                variant="contained"
                bgColor="primary"
                color="primary.white"
                w={158}
                h={35}
                fs="h5"
                action={async () => {
                  // if (!status || !grade || !name)
                  //   return enqueueSnackbar("???????????? ??????????????????", {
                  //     variant: "error",
                  //     autoHideDuration: 2000,
                  //   });
                  if (router.query.detail === "new-id" && !idCheck)
                    return enqueueSnackbar("???????????? ??????????????????", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });

                  if (
                    router.query.detail === "new-id" &&
                    (!password || !new_password)
                  )
                    return enqueueSnackbar("??????????????? ??????????????????", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });

                  if (
                    router.query.detail === "new-id" &&
                    password !== new_password
                  )
                    return enqueueSnackbar("??????????????? ????????????", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });

                  // if (grade === "?????????") {
                  //   enqueueSnackbar("????????? ??????????????????", {
                  //     variant: "error",
                  //     autoHideDuration: 2000,
                  //   });
                  // }
                  const res = await Axios.Post("member", {
                    token: getAccessToken(),
                    member_pk: pk || undefined,
                    id: id,
                    password: new_password,
                    status: status,
                    grade: grade,
                    name: name,
                    phone: phone,
                    email: email,
                    birthdate: birthdate,
                    db: changeDb,
                    head_office_org_code:
                      grade === "????????????"
                        ? org_name
                        : grade === "?????????" ||
                          grade === "?????????" ||
                          grade === "??????" ||
                          grade === "?????????"
                        ? org_code
                        : grade === "?????????"
                        ? name
                        : org_code,
                    parent_org_code:
                      grade === "?????????"
                        ? head_office_code
                        : grade === "??????"
                        ? branch_code
                        : undefined,
                    org_code:
                      grade === "?????????"
                        ? head_office_name
                        : grade === "?????????"
                        ? branch_name
                        : grade === "??????"
                        ? team_name
                        : grade === "?????????"
                        ? team_code
                        : grade === "????????????"
                        ? name
                        : undefined,
                  });
                  if (res?.code === 200) {
                    enqueueSnackbar(
                      router.query.detail === "new-id"
                        ? "?????? ????????? ?????? ?????????????????????"
                        : "????????? ?????????????????????",
                      {
                        variant: "success",
                        autoHideDuration: 2000,
                      }
                    );
                    router.back();
                  } else {
                    enqueueSnackbar(res?.message, {
                      variant: "error",
                      autoHideDuration: 2000,
                    });
                  }
                }}
              />
              <Button
                text="??????"
                variant="contained"
                bgColor="gray"
                color="primary.white"
                w={158}
                h={35}
                fs="h5"
                action={() => router.back()}
              />
            </>
          )}
        </Row>
      </Column>
    </Layout>
  );
}
