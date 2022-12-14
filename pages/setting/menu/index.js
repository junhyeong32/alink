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
import { getOrgHeadOffice } from "../../../src/utility/organization/getOrgWithUnit";

export default function Menu() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [menu, setMenu] = useState("popup");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [org_list, setOrgList] = useState([]);
  const [area_org, setAreaOrg] = useState([]);
  const [is_cooperated, setIscooperated] = useState(false);
  const [is_activated, setIsActivated] = useState(false);
  const [cooperation_organization, setCooperationOrganization] = useState("");
  const [sample, setSample] = useState("");
  const [db_fields, setDbFields] = useState();
  const [cooperationMenuList, setCooperationMenuList] = useState("");
  const [coop_list, setCoopList] = useState([]);
  const [area, setArea] = useState([]);

  const [file_name, setFileName] = useState("");

  const [menuItems, setMenuItems] = useState();

  const { openModal } = useContext(ModalContext);

  const { isPending, fields } = useGetFields();
  const { org_pending, sales } = useGetOrganization("sales");
  const { cooperation } = useGetOrganization("cooperation");

  const getArea = async () => {
    const res = (
      await Axios.Get(`db/geomap`, {
        params: {
          token: getAccessToken(),
        },
      })
    )?.data;

    if (res?.code === 200) setArea(res?.data);
  };

  useEffect(() => {
    getArea();
  }, []);

  const handleAddDb = async () => {
    if (!title)
      return enqueueSnackbar("????????? ??????????????????.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    if (org_list.length === 0)
      return enqueueSnackbar("????????? ??????????????????.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    const res = await Axios.Post("db/menu", {
      token: getAccessToken(),
      db_pk: undefined, //?????? ????????? ????????? ???,
      organization_codes: org_list.join(","),
      title: title,
      is_cooperated: is_cooperated,
      cooperation_organization_codes: coop_list.join(",") || undefined, //????????? ???????????? (,)??? ??????
      sample: sample,
      is_activated: is_activated, //????????? ??????(1, 0)
      geomap: area_org.length === 0 ? area : area_org,
      fields: db_fields,
    });
    if (res?.code === 200) {
      enqueueSnackbar("DB????????? ?????????????????????.", {
        variant: "success",
        autoHideDuration: 2000,
      });
      router.push("/setting?menu=menu", "/setting");
    }
  };

  useEffect(() => {
    setDbFields(() => {
      const obj = fields.map((field) =>
        Object.assign(
          {},
          {
            pk: field?.pk,
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

  return (
    <Layout loading={fields?.length === 0}>
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
              menuItems={menuItems}
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
                  checked={is_cooperated === 1 && true}
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
                  checked={is_cooperated === 0 && true}
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
          {/* <RowLabel label="?????? ?????????" label_w={68}>
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
          </RowLabel> */}
          <RowLabel label="?????????" label_w={68}>
            <FormControlLabel
              label="?????????"
              control={
                <RadioInput
                  checked={is_activated === 1 && true}
                  onClick={() => setIsActivated(1)}
                />
              }
            />
            <FormControlLabel
              label="????????????"
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
                  area: area,
                  setArea: setArea,
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
                              arr[key].is_filter_shown === 1 ? 0 : 1,
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
