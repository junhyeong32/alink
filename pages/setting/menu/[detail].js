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
import { getOrgHeadOffice } from "../../../src/utility/organization/getOrgWithUnit";

export default function MenuDetail() {
  const router = useRouter();
  const [menu_detail, setMenuDetail] = useState([]);
  const [area, setArea] = useState([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const [menu, setMenu] = useState("popup");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [org_list, setOrgList] = useState([]);
  const [area_org, setAreaOrg] = useState({});
  const [is_cooperated, setIscooperated] = useState(false);
  const [is_activated, setIsActivated] = useState(false);
  const [cooperation_organization, setCooperationOrganization] = useState("");
  const [coop_list, setCoopList] = useState([]);
  const [sample, setSample] = useState("");
  const [db_fields, setDbFields] = useState([]);
  const [geomap, setGeoMap] = useState();

  const [cooperationMenuList, setCooperationMenuList] = useState("");

  const [file_name, setFileName] = useState("");

  const [menuItems, setMenuItems] = useState();

  const { openModal } = useContext(ModalContext);

  const { isPending, fields } = useGetFields();
  const { org_pending, sales } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");

  const getUser = async (token) => {
    if (router.isReady) {
      const res = (await Axios.Get(`user/db/count?token=${token}`))?.data;

      if (res?.code === 200) return res?.data;
    }
  };

  const handleAddDb = async () => {
    const res = await Axios.Post("db/menu", {
      token: getAccessToken(),
      db_pk: router.query.detail || undefined, //?????? ????????? ????????? ???,
      organization_codes: org_list.join(","),
      title: title,
      is_cooperated: is_cooperated,
      cooperation_organization_codes: coop_list.join(",") || undefined, //????????? ???????????? (,)??? ??????
      sample: sample,
      is_activated: is_activated, //????????? ??????(1, 0)
      geomap: geomap,
      fields: db_fields,
    });
    if (res?.code === 200) {
      setCookie("db", await getUser(res?.access_token));
      enqueueSnackbar("DB????????? ?????????????????????.", {
        variant: "success",
        autoHideDuration: 2000,
      });

      router.push("/setting?menu=menu", "/setting");
    }
  };

  useEffect(() => {
    const getMenuDetail = async () => {
      if (!router.isReady) return;
      const res = (
        await Axios.Get(`db/menu/${router.query.detail}`, {
          params: {
            token: getAccessToken(),
          },
        })
      )?.data;

      if (res?.code === 200) {
        const {
          title,
          organization,
          is_activated,
          is_cooperated,
          sample,
          organizations,
          fields,
          cooperation_organizations,
          geomap,
        } = res?.data;
        setTitle(title);
        setIsActivated(is_activated);
        setIscooperated(is_cooperated);
        setCoopList(cooperation_organizations);
        setGeoMap(geomap);
        setCoopList((prev) => {
          const arr = [];
          cooperation_organizations?.map((org, key) => arr.push(org.code));
          return arr;
        });
        setDbFields((prev) => {
          const dbObj = [];

          // TODO
          // ?????????????????? ??????????????? ?????????
          fields.map((field) => {
            dbObj.push({
              pk: field?.property?.pk,
              is_filter_shown: field?.is_filter_shown,
              is_list_shown: field?.is_list_shown,
              is_detail_shown: field?.is_detail_shown,
            });
          });

          return dbObj;
        });

        setSample(sample);
        setOrgList((prev) => {
          const arr = [];
          organizations?.map((org, key) => arr.push(org.code));
          return arr;
        });
        setMenuDetail(res?.data);
        setLoading(false);
      }
    };
    getMenuDetail();
  }, [router.isReady]);

  useEffect(() => {
    const result = {};
    const coop_org = {};

    getOrgHeadOffice(sales, result);
    getOrgHeadOffice(cooperation, coop_org);

    setMenuItems(result);

    setCooperationMenuList(coop_org);
  }, [org_pending]);

  useEffect(() => {
    if (organization)
      setOrgList((prev) => {
        const newOrg = [...prev];

        const foundIndex = newOrg.indexOf(organization);

        if (foundIndex !== -1) return newOrg;
        newOrg.push(organization);

        return newOrg;
      });
  }, [organization]);

  useEffect(() => {
    if (cooperation_organization) {
      setCoopList((prev) => {
        const newCoop = [...prev];

        const foundIndex = newCoop.indexOf(cooperation_organization);

        if (foundIndex !== -1) return newCoop;
        newCoop.push(cooperation_organization);

        return newCoop;
      });
    }
  }, [cooperation_organization]);

  useEffect(() => {
    if (JSON.stringify(area_org) !== "{}")
      setArea((prev) => [...prev, area_org]);
  }, [area_org]);

  return (
    <Layout loading={loading}>
      <Column sx={{ gap: 4.7, width: { xs: "100%", sm: "100%", md: 550 } }}>
        <Column sx={{ gap: 1 }}>
          <Typography variant="h1">DB ??????</Typography>
          <RowLabel label="??????" label_w={68}>
            <OutLineInput w={231} value={title} setValue={setTitle} />
          </RowLabel>
          <RowLabel label="??????" label_w={68}>
            <OutLineSelectInput
              w={231}
              value={organization}
              setValue={setOrganization}
              placeholder={"placeholder"}
              menuItems={{ ??????: "??????", ...menuItems }}
            />
          </RowLabel>
          <Row
            justifyContent={"start"}
            alignItems={"start"}
            wrap={"wrap"}
            sx={{
              p: 1,
              gap: 1,
              width: "100%",
              minHeight: "85px",
              border: "3px solid #909090",
              borderRadius: "5px",
            }}
          >
            {org_list?.map((org, key) => (
              <Row key={key} alignItems={"center"} sx={{ gap: 1 }}>
                <Typography variant="h6">
                  {org === "T0000" ? "(???)?????????????????????" : menuItems[org]}
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
          </Row>
          <RowLabel label="?????????" label_w={68}>
            <FormControlLabel
              label="???"
              control={
                <RadioInput
                  checked={is_cooperated === 1}
                  onClick={() => setIscooperated(1)}
                />
              }
            />
            {is_cooperated === 1 && (
              <OutLineSelectInput
                w="50%"
                menuItems={cooperationMenuList}
                value={cooperation_organization}
                setValue={setCooperationOrganization}
              />
            )}
            <FormControlLabel
              label="???"
              control={
                <RadioInput
                  checked={is_cooperated === 0}
                  onClick={() => setIscooperated(0)}
                />
              }
            />
          </RowLabel>
          {is_cooperated === 1 && (
            <Row
              justifyContent={"start"}
              alignItems={"start"}
              wrap={"wrap"}
              sx={{
                p: 1,
                gap: 1,
                width: "100%",
                minHeight: "85px",
                border: "3px solid #909090",
                borderRadius: "5px",
              }}
            >
              {coop_list?.map((org, key) => (
                <Row key={key} alignItems={"center"} sx={{ gap: 1 }}>
                  <Typography variant="h6">
                    {cooperationMenuList[org]}
                  </Typography>
                  <Image
                    src="/cancel.png"
                    width={15}
                    height={15}
                    alt="x"
                    layout="fixed"
                    style={{ marginTop: "3px", cursor: "pointer" }}
                    onClick={() =>
                      setCoopList((prev) => {
                        const new_arr = [...prev];
                        new_arr.splice(key, 1);
                        return new_arr;
                      })
                    }
                  />
                </Row>
              ))}
            </Row>
          )}
          <RowLabel label="?????? ?????????" label_w={68}>
            <OutLineInput w={231} value={file_name} disabled />
            <label htmlFor="contained-button-file">
              <Input
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="contained-button-file"
                type="file"
                onChange={async (e) => {
                  // TODO
                  // ????????? ?????? ??? ??????
                  setFileName(e.target.files[0].name);
                  const _uploadFile = await uploadFile(e.target.files[0]);
                  setSample(_uploadFile);
                }}
                sx={{ display: "none" }}
              />
              <Button
                component="span"
                text="????????????"
                bgColor="excel"
                color="primary.white"
                w={60}
                h={20}
                fs="h6"
              />
            </label>
          </RowLabel>
          <RowLabel label="?????????" label_w={68}>
            <FormControlLabel
              label="?????????"
              control={
                <RadioInput
                  checked={is_activated === 1}
                  onClick={() => setIsActivated(1)}
                />
              }
            />
            <FormControlLabel
              label="????????????"
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
          <Typography variant="h1">DB ??????</Typography>
          <Button
            text="?????? ??????"
            w={65}
            h={28}
            fs="h6"
            action={() =>
              openModal({
                modal: "area",
                data: {
                  area: geomap,
                  setArea: setGeoMap,
                },
                content: { buttonAction: setAreaOrg },
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
                label="????????????"
                control={
                  <RadioInput
                    checked={
                      db_fields[key]?.is_filter_shown === 1 ? true : false
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
                    disabled={
                      field?.is_filter_shown === 0 ||
                      field?.name === "??????" ||
                      field?.name === "??????" ||
                      field?.name === "????????????" ||
                      field?.name === "????????????" ||
                      field?.name === "????????????" ||
                      field?.name === "????????????"
                    }
                  />
                }
              />
              <FormControlLabel
                label="???????????????"
                control={
                  <RadioInput
                    disabled={field?.is_list_shown === 0}
                    checked={db_fields[key]?.is_list_shown === 1 ? true : false}
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
                label="????????????"
                control={
                  <RadioInput
                    disabled={field?.is_detail_shown === 0}
                    checked={
                      db_fields[key]?.is_detail_shown === 1 ? true : false
                    }
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
            text="??????"
            color="primary.white"
            fs="h6"
            w={120}
            h={28}
            action={handleAddDb}
          />
          <Button
            variant="contained"
            bgColor="gray"
            text="??????"
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
