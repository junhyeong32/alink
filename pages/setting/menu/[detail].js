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
import useGetArea from "../../../src/hooks/setting/useGetArea";
import useGetMenuDetail from "../../../src/hooks/setting/useGetMenuDetail";

export default function MenuDetail() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [menu, setMenu] = useState("popup");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
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
  const { area } = useGetArea();

  const { menu_detail, menuDetailPending } = useGetMenuDetail(
    router.query.detail
  );

  const handleAddDb = async () => {
    console.log("test");
    const res = await Axios.Post("db/menu", {
      token: getAccessToken(),
      db_pk: undefined, //수정 시에만 필요한 값,
      organization_code: organization,
      title: title,
      is_cooperated: is_cooperated,
      cooperation_organization_codes: cooperation_organization || undefined, //협력사 조직코드 (,)로 구분
      sample: sample,
      is_activated: is_activated, //활성화 여부(1, 0)
      geomap: area,
      // geomap: geomap, //[{parent, name, children}, ...]
      fields: db_fields,
    });
    if (res?.code === 200) {
      enqueueSnackbar("DB생성이 완료되었습니다.", {
        variant: "success",
        autoHideDuration: 2000,
      });
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
    const { title, organization, is_activated, is_cooperated, sample } =
      menu_detail;
    setTitle(title);
    setOrganization(organization?.code);

    setIsActivated(is_activated);
    setIscooperated(is_cooperated);
    setDbFields(menu_detail?.fields);
    setSample(sample);
  }, [menu_detail]);

  useEffect(() => {
    const result = {};
    const getOrganiztionList = (el) => {
      if (!el) {
        sales[0]?.children.map((child) => {
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

  if (menu_detail?.length === 0) return <div>loading</div>;

  return (
    <Layout loading={isPending}>
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
              menuItems={menuItems}
            />
          </RowLabel>
          <RowLabel label="협력사" label_w={68}>
            <FormControlLabel
              label="유"
              control={
                <RadioInput
                  checked={is_cooperated === 1 && true}
                  onClick={() => setIscooperated(1)}
                />
              }
            />
            <FormControlLabel
              label="무"
              control={
                <RadioInput
                  checked={is_cooperated === 0 && true}
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
                  console.log(_uploadFile);
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
                  checked={is_activated === 1 && true}
                  onClick={() => setIsActivated(1)}
                />
              }
            />
            <FormControlLabel
              label="비활성화"
              control={
                <RadioInput
                  checked={is_activated === 0 && true}
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
            action={() => openModal({ modal: "area", data: area })}
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
                    checked={menu_detail?.fields[key]?.is_filter_shown && 1}
                    onClick={() =>
                      setDbFields(() => {
                        const arr = [...db_fields];
                        const new_obj = Object.assign(
                          {},
                          {
                            ...arr[key],
                            is_filter_shown:
                              arr[key].is_filter_shown === 1 ? 0 : 1,
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
                    checked={menu_detail?.fields[key]?.is_list_shown && 1}
                    onClick={() =>
                      setDbFields(() => {
                        const arr = [...db_fields];
                        const new_obj = Object.assign(
                          {},
                          {
                            ...arr[key],
                            is_list_shown: arr[key].is_list_shown === 1 ? 0 : 1,
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
                    checked={menu_detail?.fields[key]?.is_detail_shown && 1}
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
