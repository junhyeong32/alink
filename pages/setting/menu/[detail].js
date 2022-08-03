import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../src/components/Layout";
import Column from "../../../src/components/Box/Column";
import Row from "../../../src/components/Box/Row";
import { Typography, Box, FormControlLabel, Radio, Input } from "@mui/material";
import Button from "../../../src/components/Button";
import { DateInput, OutLineInput } from "../../../src/components/Input";
import RowLabel from "../../../src/components/Box/RowLabel";
import Image from "next/image";
import RadioInput from "../../../src/components/Radio";
import { ModalContext } from "../../../src/contexts/ModalContext";
import useGetFields from "../../../src/hooks/setting/useGetFields";
import Axios from "../../../src/utility/api";
import { getAccessToken } from "../../../src/utility/getCookie";
import { useSnackbar } from "notistack";
import uploadFile from "../../../src/utility/uploadFile";
import { OutLineSelectInput } from "../../../src/components/Input/Select";
import useGetOrganization from "../../../src/hooks/share/useGetOrganization";
import useGetMenuDetail from "../../../src/hooks/setting/useGetMenuDetail";
import { setCookie, getCookie } from "../../../src/utility/getCookie";

export default function MenuDetail() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [menu, setMenu] = useState("popup");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [org_list, setOrgList] = useState([]);
  const [area_org, setAreaOrg] = useState({});
  const [is_cooperated, setIscooperated] = useState(false);
  const [is_activated, setIsActivated] = useState(false);
  const [cooperation_organization, setCooperationOrganization] = useState("");
  const [sample, setSample] = useState("");
  const [db_fields, setDbFields] = useState();
  const [geomap, setGeoMap] = useState();

  const [file_name, setFileName] = useState("");

  const [menuItems, setMenuItems] = useState();

  const { openModal } = useContext(ModalContext);

  const { isPending, fields } = useGetFields();
  const { org_pending, sales } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");

  const { menu_detail, area, menuDetailPending, setArea } = useGetMenuDetail(
    router.query.detail
  );

  const getUser = async (token) => {
    if (router.isReady) {
      const res = (await Axios.Get(`user/db/count?token=${token}`))?.data;

      if (res?.code === 200) return res?.data;
    }
  };

  const handleAddDb = async () => {
    console.log("test");
    const res = await Axios.Post("db/menu", {
      token: getAccessToken(),
      db_pk: router.query.detail || undefined, //수정 시에만 필요한 값,
      organization_codes: org_list.join(","),
      title: title,
      is_cooperated: is_cooperated,
      cooperation_organization_codes: cooperation_organization || undefined, //협력사 조직코드 (,)로 구분
      sample: sample,
      is_activated: is_activated, //활성화 여부(1, 0)
      geomap: area,
      fields: db_fields || menu_detail?.fields,
    });
    if (res?.code === 200) {
      setCookie("db", await getUser(res?.access_token));
      enqueueSnackbar("DB생성이 완료되었습니다.", {
        variant: "success",
        autoHideDuration: 2000,
      });

      router.push("/setting");
    }
  };

  useEffect(() => {
    setDbFields(() => {
      const obj = fields.map((field) =>
        Object.assign(
          {},
          {
            ...field,
            is_detail_shown: 0,
            is_filter_shown: 0,
            is_list_shown: 0,
          }
        )
      );
      return obj;
    });
  }, [isPending]);

  useEffect(() => {
    const {
      title,
      organization,
      is_activated,
      is_cooperated,
      sample,
      organizations,
    } = menu_detail;
    setTitle(title);

    setIsActivated(is_activated);
    setIscooperated(is_cooperated);
    setDbFields(menu_detail?.fields);
    setSample(sample);
    setOrgList((prev) => {
      const arr = [];
      organizations?.map((org, key) => arr.push(org.code));
      return arr;
    });
  }, [menu_detail]);

  useEffect(() => {
    const result = {};
    const getOrganiztionList = (el) => {
      if (!el) {
        sales?.[0]?.children.map((child) => {
          Object.assign(result, { [child.code]: child.name });
          return getOrganiztionList((el = child));
        });
      } else {
        el.children.map((child_el) => {
          Object.assign(result, { [child_el.code]: child_el.name });

          return getOrganiztionList((el = child_el));
        });
      }
    };
    getOrganiztionList();
    setMenuItems(result);
  }, [org_pending]);

  useEffect(() => {
    if (organization) setOrgList((prev) => [...prev, organization]);
  }, [organization]);

  useEffect(() => {
    if (JSON.stringify(area_org) !== "{}")
      setArea((prev) => [...prev, area_org]);
  }, [area_org]);

  if (menu_detail?.length === 0) return <div>loading</div>;

  return (
    <Layout loading={menu_detail?.length === 0 || isPending}>
      <Column sx={{ gap: 4.7, width: { xs: "100%", sm: "100%", md: 550 } }}>
        <Column sx={{ gap: 1 }}>
          <Typography variant="h1">DB 추가</Typography>
          <RowLabel label="제목" label_w={68}>
            <OutLineInput w={231} value={title} setValue={setTitle} />
          </RowLabel>
          <RowLabel label="조직" label_w={68}>
            <OutLineSelectInput
              w={231}
              value={organization}
              setValue={setOrganization}
              placeholder={"placeholder"}
              menuItems={{ 선택: "선택", ...menuItems }}
            />
          </RowLabel>
          <Column
            wrap={"wrap"}
            sx={{
              p: 1,
              gap: 1,
              width: "100%",
              height: "85px",
              border: "3px solid #909090",
              borderRadius: "5px",
            }}
          >
            {org_list?.map((org, key) => (
              <Row key={key} alignItems={"center"} sx={{ gap: 1 }}>
                <Typography variant="h6">
                  {org === "T0000" ? "(주)어센틱금융그룹" : menuItems[org]}
                </Typography>
                <Image
                  src="/cancel.png"
                  width={15}
                  height={15}
                  alt="x"
                  layout="fixed"
                  style={{ marginTop: "3px", cursor: "pointer" }}
                  onClick={() =>
                    setOrgList((prev) => {
                      const new_arr = [...prev];
                      new_arr.splice(key, 1);
                      return new_arr;
                    })
                  }
                />
              </Row>
            ))}
          </Column>
          <RowLabel label="협력사" label_w={68}>
            <FormControlLabel
              label="유"
              control={
                <RadioInput
                  checked={is_cooperated === 1}
                  onClick={() => setIscooperated(1)}
                />
              }
            />
            <FormControlLabel
              label="무"
              control={
                <RadioInput
                  checked={is_cooperated === 0}
                  onClick={() => setIscooperated(0)}
                />
              }
            />
          </RowLabel>
          <RowLabel label="샘플 업로드" label_w={68}>
            <OutLineInput w={231} value={file_name} disabled />
            <label htmlFor="contained-button-file">
              <Input
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="contained-button-file"
                type="file"
                onChange={async (e) => {
                  // TODO
                  // 태웅이 수정 후 작업
                  setFileName(e.target.files[0].name);
                  const _uploadFile = await uploadFile(e.target.files[0]);
                  setSample(_uploadFile);
                }}
                sx={{ display: "none" }}
              />
              <Button
                component="span"
                text="파일선택"
                bgColor="excel"
                color="primary.white"
                w={60}
                h={20}
                fs="h6"
              />
            </label>
          </RowLabel>
          <RowLabel label="활성화" label_w={68}>
            <FormControlLabel
              label="활성화"
              control={
                <RadioInput
                  checked={is_activated === 1}
                  onClick={() => setIsActivated(1)}
                />
              }
            />
            <FormControlLabel
              label="비활성화"
              control={
                <RadioInput
                  checked={is_activated === 0}
                  onClick={() => setIsActivated(0)}
                />
              }
            />
          </RowLabel>
        </Column>

        <Row justifyContent={"between"}>
          <Typography variant="h1">DB 구성</Typography>
          <Button
            text="지역 설정"
            w={60}
            h={20}
            fs="h6"
            action={() =>
              openModal({
                modal: "area",
                content: { buttonAction: setAreaOrg },
                data: {
                  geomaps: area,
                  setGeomaps: setArea,
                },
              })
            }
          />
        </Row>

        <Column>
          {fields?.map((field, key) => (
            <RowLabel
              label_w={68}
              key={key}
              label={field?.name}
              columnGap={{
                lg: "35px",
                md: "35px",
                sm: "35px",
                xs: "20px",
              }}
            >
              <FormControlLabel
                label="필터노출"
                control={
                  <RadioInput
                    checked={
                      menu_detail?.fields[key]?.is_filter_shown === 1
                        ? true
                        : false
                    }
                    onClick={() =>
                      setDbFields(() => {
                        const arr = [...db_fields];
                        const new_obj = Object.assign(
                          {},
                          {
                            ...arr[key],
                            is_filter_shown:
                              arr[key]?.is_filter_shown === 1 ? 0 : 1,
                          }
                        );

                        arr[key] = new_obj;
                        return arr;
                      })
                    }
                    disabled={field?.is_filter_shown === 0}
                  />
                }
              />
              <FormControlLabel
                label="리스트노출"
                control={
                  <RadioInput
                    disabled={field?.is_list_shown === 0}
                    checked={menu_detail?.fields[key]?.is_list_shown === 1}
                    onClick={() =>
                      setDbFields(() => {
                        const arr = [...db_fields];
                        const new_obj = Object.assign(
                          {},
                          {
                            ...arr[key],
                            is_list_shown:
                              arr[key]?.is_list_shown === 1 ? 0 : 1,
                          }
                        );

                        arr[key] = new_obj;
                        return arr;
                      })
                    }
                  />
                }
              />
              <FormControlLabel
                label="상세노출"
                control={
                  <RadioInput
                    disabled={field?.is_detail_shown === 0}
                    checked={menu_detail?.fields[key]?.is_detail_shown === 1}
                    onClick={() =>
                      setDbFields(() => {
                        const arr = [...db_fields];
                        const new_obj = Object.assign(
                          {},
                          {
                            ...arr[key],
                            is_detail_shown:
                              arr[key].is_detail_shown === 1 ? 0 : 1,
                          }
                        );

                        arr[key] = new_obj;
                        return arr;
                      })
                    }
                  />
                }
              />
            </RowLabel>
          ))}
        </Column>

        <Row justifyContent={"center"} sx={{ gap: 1.5 }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="등록"
            color="primary.white"
            fs="h6"
            w={120}
            h={28}
            action={handleAddDb}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="취소"
            color="primary.white"
            fs="h6"
            w={120}
            h={28}
            action={() => router.back()}
          />
        </Row>
      </Column>
    </Layout>
  );
}
