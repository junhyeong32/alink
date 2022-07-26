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

  const { sales, isUserDetailPending } = useGetOrganization("sales");
  const { office_by_org, org_pending } = useGetOrganization(
    "sales",
    user_detail?.head_office_org_code
  );
  const { menus } = useGetMenus();
  console.log(menus);

  //change state
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

  const [header_org, setHeaderOrg] = useState("");
  const [team, setTeam] = useState("");

  const [bojang, setBojang] = useState("");
  const [finance, setFinance] = useState("");
  const [dna, setDna] = useState("");

  //menuList
  const [orgMenuList, setOrgMenuList] = useState({});
  const [teamMenuList, setTeamMenuList] = useState({});

  useEffect(() => {
    const sales_result = { [sales[0]?.code]: sales[0]?.name };
    const team_result = {};
    const getTeamList = (el) => {
      if (!el) {
        office_by_org[0]?.children.map((child) => {
          if (child.unit === "team") {
            Object.assign(team_result, { [child.code]: child.name });
          }

          return getTeamList((el = child));
        });
      } else {
        el.children.map((child_el) => {
          if (child_el.unit === "team") {
            Object.assign(team_result, { [child_el.code]: child_el.name });
          }
          return getTeamList((el = child_el));
        });
      }
    };

    getTeamList();
    setOrgMenuList(sales_result);
    setTeamMenuList(team_result);
  }, [org_pending]);

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
    setTeam(org_code);

    setBojang(db?.[0]);
    setFinance(db?.[1]);
    setDna(db?.[2]);
  }, [user_detail]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // 조직 가져올떄
  //조직명 - sales
  // headoffice_org

  //TODO
  // new-id랑 똑같이

  // 부관리자인 경우
  // head_office_org_code에 조직명

  // 본부장인 경우
  // head_office_org_code에 조직 코드
  // org_code에 본부명

  // 지점장인 경우
  // head_office_org_code에 조직 코드
  // parent_org_code에 본부 코드
  // org_code에 지점명

  // 팀장인 경우
  // head_office_org_code에 조직 코드
  // parent_org_code에 지점 코드
  // org_code에 팀명

  // 담당자인 경우
  // head_office_org_code에 조직 코드
  // org_code에 팀 코드

  // 협력사인 경우
  // head_office_org_code에 조직명

  // 부협력사인 경우
  // head_office_org_code에 협력사 코드

  //팀장 - 팀명이 인풋박스 변경, 지점명 추가(unit - branch)
  //

  //TODO
  //DB관리 setstate

  return (
    <Layout loading={loading}>
      <Column sx={{ p: "40px", gap: "20px" }}>
        <Typography variant="h1">
          {router.query.detail ? "이용자 정보" : "신규 생성"}
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
                  disabled={user_detail?.status === "퇴사자"}
                  key={key}
                  control={<Checkbox checked={user_detail?.status === list} />}
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
                      checked={user_detail?.grade === list}
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

        {grade !== "협력사" ? (
          <>
            <RowLabel label="조직명" sx={rowLabelWidth} label_w={83}>
              <OutLineSelectInput
                disabled={user_detail?.status === "퇴사자"}
                w="50%"
                value={org_code}
                setValue={setOrgCode}
                menuItems={orgMenuList}
              />
            </RowLabel>
            {/* <RowLabel label="직급" sx={rowLabelWidth} label_w={83}>
              <OutLineInput
                disabled={user_detail?.status === "퇴사자"}
                w="50%"
                value={grade}
                setValue={setGrade}
              />
            </RowLabel> */}
            <RowLabel label="팀명" sx={rowLabelWidth} label_w={83}>
              <OutLineSelectInput
                disabled={user_detail?.status === "퇴사자"}
                w="50%"
                menuItems={teamMenuList}
                value={team}
                setValue={setTeam}
              />
            </RowLabel>
            <RowLabel label="성명" sx={rowLabelWidth} label_w={83}>
              <OutLineInput
                disabled={user_detail?.status === "퇴사자"}
                w="50%"
                value={name}
                setValue={setName}
              />
            </RowLabel>
          </>
        ) : (
          <RowLabel label="이용자명" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={user_detail?.status === "퇴사자"}
              w="50%"
              value={name}
              setValue={setName}
            />
          </RowLabel>
        )}

        <RowLabel label="아이디" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={user_detail?.status === "퇴사자" || router.query.detail}
            w="50%"
            value={id}
            setValue={setId}
          />
          {!router.query.detail && (
            <Button
              text="중복체크"
              variant="contained"
              bgColor="gray"
              color="primary.white"
              h={20}
              fs="h6"
              disabled={user_detail?.status === "퇴사자"}
            />
          )}
        </RowLabel>
        <RowLabel label="신규 비밀번호" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={user_detail?.status === "퇴사자"}
            w="50%"
            value={new_password}
            setValue={setNewPassword}
            type="password"
          />
        </RowLabel>
        <RowLabel label="비밀번호 확인" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={user_detail?.status === "퇴사자"}
            w="50%"
            value={password}
            setValue={setPassword}
            type="password"
          />
        </RowLabel>
        <RowLabel label="이메일" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={user_detail?.status === "퇴사자"}
            w="50%"
            value={email}
            setValue={setEmail}
          />
        </RowLabel>
        <RowLabel label="연락처" sx={rowLabelWidth} label_w={83}>
          <OutLineInput
            disabled={user_detail?.status === "퇴사자"}
            w="50%"
            value={phone}
            setValue={setPhone}
          />
        </RowLabel>
        {/* todo 
        date input
        */}
        {grade !== "협력사" && (
          <RowLabel label="생년월일" sx={rowLabelWidth} label_w={83}>
            <OutLineInput
              disabled={user_detail?.status === "퇴사자"}
              w="50%"
              value={birthdate}
              setValue={setBirthdate}
            />
          </RowLabel>
        )}
      </Column>
      <Column sx={{ p: "40px", gap: "20px" }}>
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
    </Layout>
  );
}
