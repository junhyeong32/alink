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
} from "../../src/utility/organization/getOrgWithUnit";
import useGetArea from "../../src/hooks/setting/useGetArea";

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
  const [db, setDb] = useState([]); //화면에 뿌려주는 state
  const [changeDb, setChangeDb] = useState([]); //전송 state
  const [head_office_name, setHeadOfficeName] = useState("");
  const [head_office_code, setHeadOfficeCode] = useState("");
  const [pk, setPk] = useState("");

  const [header_org, setHeaderOrg] = useState("");
  const [branch_name, setBranchName] = useState("");
  const [branch_code, setBranchCode] = useState("");
  const [team_name, setTeamName] = useState("");
  const [team_code, setTeamCode] = useState("");

  const [idCheck, setIdCheck] = useState(false);

  //menuList
  const [orgMenuList, setOrgMenuList] = useState({}); //조직
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({}); //본부
  const [branchMenuList, setBranchMenuList] = useState({}); //지점
  const [teamMenuList, setTeamMenuList] = useState({}); //팀
  const [cooperationMenuList, setCooperationMenuList] = useState("");

  useEffect(() => {
    const head_org = {};

    getOrgHeadOffice(sales, head_org);

    setOrgMenuList(head_org);
  }, [org_pending]);

  useEffect(() => {
    const getOrgCodeByData = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            // head_office_org_code: org_code || user_detail?.org_code,
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
    if (grade === "지점장" || grade === "본부장") {
      console.log("org_code_by_sales", org_code_by_sales);
      const head_result = {};

      getOrgWithUnit(org_code_by_sales, "region", head_result);

      setHeadOfficeMenuList(head_result);
    } else if (grade === "팀장") {
      const branch_result = {};

      getOrgWithUnit(org_code_by_sales, "branch", branch_result);

      setBranchMenuList(branch_result);
    } else if (grade === "담당자") {
      const team_result = {};

      getOrgWithUnit(org_code_by_sales, "team", team_result);

      setTeamMenuList(team_result);
    } else if (grade === "부협력사") {
      const coop_org = {};
      getOrgHeadOffice(cooperation, coop_org);
      setCooperationMenuList(coop_org);
    }
  }, [org_code, grade, org_code_by_sales]);

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
          setHeadOfficeName(head_office);
          setBranchName(branch);
          setBranchCode(parent_org_code);
          setTeamCode(org_code);
          setTeamName(team);
          setPk(pk);
        }
      };

      getDetail();
    } else {
      console.log("실행함??");
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
  }, [router.isReady]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  //TODO
  //DB관리 setstate

  console.log("changeDb", changeDb);

  return (
    <Layout loading={loading}>
      <Column sx={{ p: "40px", gap: "20px" }}>
        <Typography variant="h1">
          {router.query.detail !== "new-id" ? "이용자 정보" : "신규 생성"}
        </Typography>
        <TopLabelContents
          title="상태"
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
                        (status === "퇴사자" || rank === "부관리자")
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
          title="등급"
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
                        (status === "퇴사자" || rank === "부관리자")
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

        {grade === "부관리자" && (
          <RowLabel label="조직명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
              }
              w="50%"
              defaultValue={head_office_name}
              onBlur={(e) => setOrgName(e.target.value)}
            />
          </RowLabel>
        )}
        {(grade === "본부장" ||
          grade === "지점장" ||
          grade === "팀장" ||
          grade === "담당자") && (
          <RowLabel label="조직명" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
              }
              w="50%"
              defaultValue={org_code}
              menuItems={orgMenuList}
              value={org_code}
              setValue={setOrgCode}
            />
          </RowLabel>
        )}
        {grade === "부협력사" && (
          <RowLabel label="협력사명" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
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
          grade !== "부관리자" &&
          grade !== "팀장" &&
          grade !== "담당자" &&
          grade !== "협력사" &&
          grade !== "부협력사" && (
            <RowLabel label="본부명" sx={rowLabelWidth} label_w={83}>
              {grade === "본부장" ? (
                <OutLineInput
                  disabled={
                    router.query.detail !== "new-id" &&
                    (status === "퇴사자" || rank === "부관리자")
                  }
                  w="50%"
                  defaultValue={head_office_name}
                  onBlur={(e) => setHeadOfficeName(e.target.value)}
                />
              ) : (
                <OutLineSelectInput
                  disabled={
                    router.query.detail !== "new-id" &&
                    (status === "퇴사자" || rank === "부관리자")
                  }
                  w="50%"
                  menuItems={headOfficeMenuList}
                  value={head_office_code}
                  setValue={setHeadOfficeCode}
                />
              )}
            </RowLabel>
          )}

        {grade === "지점장" && (
          <RowLabel label="지점명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
              }
              w="50%"
              defaultValue={branch_name}
              onBlur={(e) => setBranchName(e.target.value)}
            />
          </RowLabel>
        )}
        {grade === "팀장" && (
          <RowLabel label="지점명" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
              }
              w="50%"
              menuItems={branchMenuList}
              value={branch_code}
              setValue={setBranchCode}
            />
          </RowLabel>
        )}

        {grade === "팀장" && (
          <>
            <RowLabel label="팀명" sx={rowLabelWidth} label_w={83}>
              <OutLineInput
                disabled={
                  router.query.detail !== "new-id" &&
                  (status === "퇴사자" || rank === "부관리자")
                }
                w="50%"
                defaultValue={team_name}
                onBlur={(e) => setTeamName(e.target.value)}
              />
            </RowLabel>
          </>
        )}
        {grade === "담당자" && (
          <>
            <RowLabel label="팀명" sx={rowLabelWidth} label_w={83}>
              <OutLineSelectInput
                disabled={
                  router.query.detail !== "new-id" &&
                  (status === "퇴사자" || rank === "부관리자")
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
          <RowLabel label="이용자명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
              }
              w="50%"
              defaultValue={name}
              onBlur={(e) => setName(e.target.value)}
            />
          </RowLabel>
        )}
        {grade === "" && (
          <RowLabel label="성명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
              }
              w="50%"
              defaultValue={name}
              onBlur={(e) => setName(e.target.value)}
            />
          </RowLabel>
        )}
        <RowLabel label="아이디" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "퇴사자" || rank === "부관리자")
            }
            w="50%"
            defaultValue={id}
            onBlur={(e) => setId(e.target.value)}
          />
          <Button
            text="중복체크"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            h={20}
            fs="h6"
            disabled={
              router.query.detail !== "new-id" &&
              (status === "퇴사자" || rank === "부관리자")
            }
            action={async () => {
              const res = await Axios.Post("member/iddupcheck", {
                token: getAccessToken(),
                id: id,
              });

              if (res?.code === 200) {
                enqueueSnackbar("사용가능한 아이디 입니다.", {
                  variant: "success",
                  autoHideDuration: 2000,
                });
                setIdCheck(true);
              } else {
                enqueueSnackbar("아이디를 확인해주세요.", {
                  variant: "error",
                  autoHideDuration: 2000,
                });
                setIdCheck(false);
              }
            }}
          />
        </RowLabel>
        <RowLabel label="신규 비밀번호" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "퇴사자" || rank === "부관리자")
            }
            w="50%"
            onBlur={(e) => setNewPassword(e.target.value)}
            type={"password"}
          />
        </RowLabel>
        <RowLabel label="비밀번호 확인" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "퇴사자" || rank === "부관리자")
            }
            w="50%"
            onBlur={(e) => setPassword(e.target.value)}
            type={"password"}
          />
        </RowLabel>
        <RowLabel label="이메일" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "퇴사자" || rank === "부관리자")
            }
            w="50%"
            defaultValue={email}
            onBlur={(e) => setEmail(e.target.value)}
          />
        </RowLabel>
        <RowLabel label="연락처" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={
              router.query.detail !== "new-id" &&
              (status === "퇴사자" || rank === "부관리자")
            }
            w="50%"
            defaultValue={phone}
            onBlur={(e) => setPhone(e.target.value)}
          />
        </RowLabel>
        {(grade !== "협락사" || grade !== "부협락사") && (
          <RowLabel label="생년월일" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={
                router.query.detail !== "new-id" &&
                (status === "퇴사자" || rank === "부관리자")
              }
              w="50%"
              defaultValue={birthdate}
              onBlur={(e) => setBirthdate(e.target.value)}
            />
          </RowLabel>
        )}

        {grade !== "협력사" &&
          grade !== "부관리자" &&
          grade !== "부협력사" &&
          grade && (
            <Column sx={{ pr: "40px", gap: "20px", mt: 3 }}>
              <Typography variant="h1">DB 관리</Typography>
              {db?.map((d, key) => (
                <Column key={key}>
                  <RowLabel label={d?.title} fs="h4" label_w={83}>
                    <Row alignItems={"center"}>
                      <OutLineInput
                        disabled={
                          (router.query.detail !== "new-id" &&
                            (status === "퇴사자" || rank === "부관리자")) ||
                          d?.allocation?.is_activated === 0
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
                        개
                      </Typography>
                      <CustomSwitch
                        disabled={
                          (router.query.detail !== "new-id" &&
                            (status === "퇴사자" || rank === "부관리자")) ||
                          d?.allocation?.is_activated === 0
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
                          changeDb[key]?.geomap.length === area.length
                            ? "#0D1D41"
                            : "#E6E6E6"
                        }
                        fc={
                          changeDb[key]?.geomap.length === area.length
                            ? "#FFFFFF"
                            : "#000000"
                        }
                        fs={12}
                        sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                        onClick={() => {
                          if (d?.allocation?.is_activated === 0) return;
                          setChangeDb((prev) => {
                            const newData = [...prev];

                            if (newData[key].geomap.length < area.length) {
                              newData[key].geomap = [];

                              area.map((map) =>
                                newData[key].geomap?.push({ name: map?.name })
                              );
                            } else {
                              newData[key].geomap = [];
                            }

                            console.log("menus", newData[key].geomap);
                            return newData;
                          });
                        }}
                      >
                        전국
                      </RoundColorBox>
                      {area?.map((map, area_key) => (
                        <RoundColorBox
                          key={area_key}
                          background={
                            changeDb[key]?.geomap?.find(
                              (d) => d?.name === map?.name
                            )
                              ? "#0D1D41"
                              : "#E6E6E6"
                          }
                          fc={
                            changeDb[key]?.geomap?.find(
                              (d) => d?.name === map?.name
                            )
                              ? "#FFFFFF"
                              : "#000000"
                          }
                          fs={12}
                          sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                          onClick={() => {
                            if (
                              status === "퇴사자" ||
                              rank === "부관리자" ||
                              d?.allocation?.is_activated === 0
                            )
                              return;
                            setChangeDb((prev) => {
                              const newData = [...prev];
                              const newDataGeo = newData[key].geomap;

                              const foundIndex = newDataGeo?.findIndex(
                                (d) => d?.name === map?.name
                              );

                              if (foundIndex === -1) {
                                newDataGeo.push({ name: map?.name });
                              } else {
                                newDataGeo.splice(foundIndex, 1);
                              }

                              return newData;
                            });
                          }}
                        >
                          {map?.name}
                        </RoundColorBox>
                      ))}
                    </Row>
                  </RowLabel>
                </Column>
              ))}
            </Column>
          )}
        <Row justifyContent={"center"} sx={{ gap: "15px", mt: 5 }}>
          {rank === "부관리자" ? (
            <Button
              text="목록보기"
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
                text={router.query.detail === "new-id" ? "생성" : "수정"}
                variant="contained"
                bgColor="primary"
                color="primary.white"
                w={158}
                h={35}
                fs="h5"
                action={async () => {
                  if (router.query.detail === "new-id" && !idCheck)
                    return enqueueSnackbar("아이디를 확인해주세요", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });
                  if (
                    router.query.detail === "new-id" &&
                    password !== new_password
                  )
                    return enqueueSnackbar("비밀번호가 틀립니다", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });

                  // if (grade === "지점장") {
                  //   enqueueSnackbar("항목을 입력해주세요", {
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
                      grade === "부관리자"
                        ? org_name
                        : grade === "본부장" ||
                          grade === "지점장" ||
                          grade === "팀장" ||
                          grade === "담당자"
                        ? org_code
                        : grade === "협력사"
                        ? name
                        : org_code,
                    parent_org_code:
                      grade === "지점장"
                        ? head_office_code
                        : grade === "팀장"
                        ? branch_code
                        : undefined,
                    org_code:
                      grade === "본부장"
                        ? head_office_name
                        : grade === "지점장"
                        ? branch_name
                        : grade === "팀장"
                        ? team_name
                        : grade === "담당자"
                        ? team_code
                        : grade === "부협력사"
                        ? name
                        : undefined,
                  });
                  if (res?.code === 200) {
                    enqueueSnackbar(
                      router.query.detail === "new-id"
                        ? "신규 아이디 생성 완료되었습니다"
                        : "수정이 완료되었습니다",
                      {
                        variant: "success",
                        autoHideDuration: 2000,
                      }
                    );
                    router.back();
                  }
                }}
              />
              <Button
                text="취소"
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
