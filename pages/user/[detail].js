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
import { getAccessToken } from "../../src/utility/getCookie";
import CustomSwitch from "../../src/components/Switch";
import { useSnackbar } from "notistack";
import useGetMenus from "../../src/hooks/setting/useGetMenus";
import BackgroundTextBox from "../../src/components/Box/BackgroundText";
import Axios from "../../src/utility/api";
import { getOrgWithUnit } from "../../src/utility/organization/getOrgWithUnit";

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
  const { user_detail } = useGetUserDetail(router.query.detail);

  const { sales, org_pending } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");

  const { menus } = useGetMenus();
  const [org_code_by_sales, setOrgCodeBySales] = useState([]);

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
  const [db, setDb] = useState([]);
  const [head_office_name, setHeadOfficeName] = useState("");
  const [head_office_code, setHeadOfficeCode] = useState("");

  const [header_org, setHeaderOrg] = useState("");
  const [branch_name, setBranchName] = useState("");
  const [branch_code, setBranchCode] = useState("");
  const [team_name, setTeamName] = useState("");
  const [team_code, setTeamCode] = useState("");

  const [bojang, setBojang] = useState("");
  const [finance, setFinance] = useState("");
  const [dna, setDna] = useState("");

  //menuList
  const [orgMenuList, setOrgMenuList] = useState({}); //조직
  const [headOfficeMenuList, setHeadOfficeMenuList] = useState({}); //본부
  const [branchMenuList, setBranchMenuList] = useState({}); //지점
  const [teamMenuList, setTeamMenuList] = useState({}); //팀

  useEffect(() => {
    setOrgMenuList({ [sales[0]?.code]: sales[0]?.name });
  }, [org_pending]);

  useEffect(() => {
    const getOrgCodeByData = async () => {
      const res = (
        await Axios.Get("organization", {
          params: {
            token: getAccessToken(),
            type: "sales",
            head_office_org_code: org_code || user_detail?.org_code,
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
    if (org_code && grade === "지점장") {
      const head_result = {};

      getOrgWithUnit(org_code_by_sales, "region", head_result);

      setHeadOfficeMenuList(head_result);
    } else if (org_code && grade === "팀장") {
      const branch_result = {};

      getOrgWithUnit(org_code_by_sales, "branch", branch_result);

      setBranchMenuList(branch_result);
    } else if (org_code && grade === "담당자") {
      const team_result = {};

      getOrgWithUnit(org_code_by_sales, "team", team_result);

      setTeamMenuList(team_result);
    }
  }, [org_code, grade]);

  useEffect(() => {
    const {
      id,
      status,
      grade,
      name,
      phone,
      email,
      birthdate,
      db,
      org_code,
      head_office_org_code,
    } = user_detail;

    setId(id);
    setPassword();
    setStatus(status);
    setGrade(grade);
    setName(name);
    setPhone(phone);
    setBirthdate(birthdate);
    setDb(db);
    setEmail(email);
    setBirthdate(birthdate);
    setOrgCode(org_code);
    setHeaderOrg(head_office_org_code);
    setTeamCode(org_code);

    setBojang(db?.[0]);
    setFinance(db?.[1]);
    setDna(db?.[2]);
  }, [user_detail]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  //TODO
  //DB관리 setstate

  console.log("branchMenuList", branchMenuList);

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
                      disabled={user_detail?.status === "퇴사자"}
                      checked={user_detail?.status === list || status === list}
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
                      disabled={user_detail?.status === "퇴사자"}
                      checked={user_detail?.grade === list || grade === list}
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
            <OutLineInput w="50%" onBlur={(e) => setOrgName(e.target.value)} />
          </RowLabel>
        )}
        {(grade === "본부장" ||
          grade === "지점장" ||
          grade === "팀장" ||
          grade === "담당자") && (
          <RowLabel label="조직명" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
              w="50%"
              menuItems={orgMenuList}
              value={org_code}
              setValue={setOrgCode}
            />
          </RowLabel>
        )}
        {grade === "부협력사" && (
          <RowLabel label="협력사명" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput w="50%" menuItems={{}} />
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
                  w="50%"
                  onBlur={(e) => setHeadOfficeName(e.target.value)}
                />
              ) : (
                <OutLineSelectInput
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
              w="50%"
              onBlur={(e) => setBranchName(e.target.value)}
            />
          </RowLabel>
        )}
        {grade === "팀장" && (
          <RowLabel label="지점명" sx={rowLabelWidth} label_w={83}>
            <OutLineSelectInput
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
                w="50%"
                menuItems={{}}
                onBlur={(e) => setTeamName(e.target.value)}
              />
            </RowLabel>
          </>
        )}
        {grade === "담당자" && (
          <>
            <RowLabel label="팀명" sx={rowLabelWidth} label_w={83}>
              <OutLineSelectInput w="50%" menuItems={{}} />
            </RowLabel>
          </>
        )}

        {grade !== "" && (
          <RowLabel label="이용자명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput w="50%" onBlur={(e) => setName(e.target.value)} />
          </RowLabel>
        )}
        {grade === "" && (
          <RowLabel label="성명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput w="50%" onBlur={(e) => setName(e.target.value)} />
          </RowLabel>
        )}
        <RowLabel label="아이디" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" onBlur={(e) => setId(e.target.value)} />
          <Button
            text="중복체크"
            variant="contained"
            bgColor="gray"
            color="primary.white"
            h={20}
            fs="h6"
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
              } else {
                enqueueSnackbar("아이디를 확인해주세요.", {
                  variant: "error",
                  autoHideDuration: 2000,
                });
              }
            }}
          />
        </RowLabel>
        <RowLabel label="신규 비밀번호" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            w="50%"
            onBlur={(e) => setNewPassword(e.target.value)}
            type={"password"}
          />
        </RowLabel>
        <RowLabel label="비밀번호 확인" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            w="50%"
            onBlur={(e) => setPassword(e.target.value)}
            type={"password"}
          />
        </RowLabel>
        <RowLabel label="이메일" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" onBlur={(e) => setEmail(e.target.value)} />
        </RowLabel>
        <RowLabel label="연락처" sx={rowLabelWidth} label_w={83}>
          <OutLineInput w="50%" onBlur={(e) => setPhone(e.target.value)} />
        </RowLabel>
        {(grade !== "협락사" || grade !== "부협락사") && (
          <RowLabel label="생년월일" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              w="50%"
              onBlur={(e) => setBirthdate(e.target.value)}
            />
          </RowLabel>
        )}

        <Column sx={{ pr: "40px", gap: "20px", mt: 3 }}>
          <Typography variant="h1">DB 관리</Typography>
          {grade !== "협력사" &&
            user_detail?.db?.map((db, key) => (
              <Column key={key}>
                <RowLabel label={db?.title} fs="h4" label_w={83}>
                  <Row alignItems={"center"}>
                    <OutLineInput
                      disabled={user_detail?.status === "퇴사자"}
                      w={90}
                      defaultValue={db?.allocation?.count}
                      onBlur={(e) =>
                        setBojang((prev) => {
                          const obj = { ...prev };
                          obj.allocation.count = e.target.value;

                          return obj;
                        })
                      }
                    />
                    <Typography variant="h6" pl={1}>
                      개
                    </Typography>
                    <CustomSwitch
                      sx={{ ml: 3 }}
                      checked={db?.allocation?.is_activated === 1}
                      onClick={(e) => {
                        console.log(e.target.checked);
                        setBojang((prev) => {
                          const obj = { ...prev };
                          if (e.target.value) {
                            obj.allocation.is_activated = 1;
                          } else {
                            obj.allocation.is_activated = 0;
                          }

                          return obj;
                        });
                      }}
                    />
                  </Row>
                  <Row wrap={"wrap"} sx={{ gap: 1 }}>
                    {menus[0]?.geomap?.map((map, key) => (
                      <RoundColorBox
                        key={key}
                        background={
                          bojang?.geomap?.find((d) => d?.name === map?.name)
                            ? "#0D1D41"
                            : "#E6E6E6"
                        }
                        fc={
                          bojang?.geomap?.find((d) => d?.name === map?.name)
                            ? "#FFFFFF"
                            : "#000000"
                        }
                        fs={12}
                        sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                        onClick={() =>
                          setBojang((prev) => {
                            const obj = { ...prev };
                            const foundIndex = obj?.geomap?.findIndex(
                              (d) => d?.name === map?.name
                            );

                            if (foundIndex === -1) {
                              obj.geomap.push({ name: map?.name });
                            } else {
                              obj?.geomap.splice(foundIndex, 1);
                            }

                            return obj;
                          })
                        }
                      >
                        {map?.name}
                      </RoundColorBox>
                    ))}
                  </Row>
                </RowLabel>
              </Column>
            ))}
        </Column>

        <Row justifyContent={"center"} sx={{ gap: "15px", mt: 5 }}>
          <Button
            text="생성"
            variant="contained"
            bgColor="primary"
            color="primary.white"
            w={158}
            h={35}
            fs="h5"
            action={async () => {
              if (router.query.detail === "new-id") {
                const res = await Axios.Post("member", {
                  token: getAccessToken(),
                  id: id,
                  password: new_password,
                  status: status,
                  grade: grade,
                  name: name,
                  phone: phone,
                  email: email,
                  birthdate: birthdate,
                  db: { allocation: [], geomap: [] },
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
                      : "협력사 코드",
                  parent_org_code:
                    grade === "지점장"
                      ? head_office_code
                      : grade === "팀장"
                      ? "지점코드"
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
                      : undefined,
                });
                if (res?.code === 200) {
                  enqueueSnackbar("신규 아이디 생성 완료되었습니다", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                }
              } else {
                console.log("hi");
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
        </Row>
      </Column>
    </Layout>
  );
}
