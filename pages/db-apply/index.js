import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
} from "@mui/material";
import RoundColorBox from "../../src/components/Box/RoundColorBox";

import Button from "../../src/components/Button";
import RowLabel from "../../src/components/Box/RowLabel";
import { OutLineInput } from "../../src/components/Input";
import CustomSwitch from "../../src/components/Switch";
import useGetUser from "../../src/hooks/user/useGetUser";
import useGetArea from "../../src/hooks/setting/useGetArea";
import Axios from "../../src/utility/api";
import { getAccessToken } from "../../src/utility/getCookie";
import { useSnackbar } from "notistack";
import { getCookie } from "../../src/utility/getCookie";
import useGetMenus from "../../src/hooks/setting/useGetMenus";
import { LensTwoTone } from "@mui/icons-material";

export default function DBApply() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [org_name, setOrgName] = useState("");
  const [user_info] = useState(getCookie("user_info"));
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [db, setDb] = useState([]); //화면에 뿌려주는 state
  const [changeDb, setChangeDb] = useState([]); //전송 state
  const [pk, setPk] = useState("");
  const [loading, setLoading] = useState(true);

  const { menus } = useGetMenus();
  const { area } = useGetArea();
  const { user, isUserPending, getUser } = useGetUser();

  useEffect(() => {
    if (menus?.length === 0 || user?.length === 0) return;
    const { db } = user;

    setChangeDb(() => {
      return menus?.map((menu, key) => {
        return {
          db_pk: menu.pk,
          allocation: [
            {
              is_activated: menu?.is_activated,
              count: db?.find((d) => d?.pk === menu.pk)?.allocation?.count,
            },
          ],
          geomap: (() => {
            const geoData = [];
            db?.find((d) => d?.pk === menu.pk).geomap?.map((geo) =>
              geoData.push({ name: geo?.name })
            );
            return geoData;
          })(),
        };
      });
    });
    console.log("db", db);
    setLoading(false);
  }, [menus, user]);

  //TODO
  // 모달창
  // 디비 수량 신청 및 지역 설정

  console.log("menus", changeDb);

  return (
    <Layout loading={loading}>
      <Column>
        <Column sx={{ pr: "40px", gap: "20px", mt: 3 }}>
          <Typography variant="h1">DB 신청</Typography>
          <Column justifyContent={"start"} alignItems={"start"} sc={{ mb: 2 }}>
            <Typography variant="h5" sx={{ color: "#3532C7" }}>
              {user?.acfp > 300000 && new Date().getMonth() + 1}월 DB 지원
              대상자입니다.
            </Typography>
            <Typography variant="normal" sx={{ color: "#909090" }}>
              지원여부는 계약상태값에 따라 변경될 수 있습니다.
            </Typography>
          </Column>
          {menus?.map((menu, key) => (
            <Column key={key}>
              <RowLabel
                label={menu?.title}
                fs="h4"
                label_w={83}
                sx={{ gap: 10 }}
              >
                <Row alignItems={"center"}>
                  <OutLineInput
                    disabled={status === "퇴사자"}
                    w={90}
                    defaultValue={0}
                    onBlur={(e) =>
                      setChangeDb((prev) => {
                        const newData = [...prev];
                        newData[key].allocation[0].count = e.target.value;

                        return newData;
                      })
                    }
                  />
                  <Typography variant="h6" pl={1}>
                    개
                  </Typography>

                  {/* <CustomSwitch
                    sx={{ ml: 3 }}
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
                  /> */}
                </Row>
                <Row wrap={"wrap"} sx={{ gap: 1 }}>
                  <Typography variant="h4" mr={3}>
                    담당 지역
                  </Typography>
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
                    onClick={() =>
                      setChangeDb((prev) => {
                        const newData = [...prev];
                        let newDataGeo = newData[key].geomap;
                        console.log(newDataGeo.length, area.length);
                        if (newDataGeo.length === area.length) {
                          newDataGeo.splice(0, newDataGeo.length);
                        } else {
                          area.map((map) =>
                            newDataGeo.push({ name: map?.name })
                          );
                        }

                        return newData;
                      })
                    }
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
                      onClick={() =>
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
        <Row justifyContent={"center"} sx={{ mt: 18 }}>
          <Button
            variant="contained"
            bgColor="primary"
            text="신청"
            color="primary.white"
            fs="h5"
            w={160}
            h={30}
            action={async () => {
              const res = await Axios.Post("user/db/count", {
                token: getAccessToken(),
                db: changeDb,
              });

              if (res?.code === 200)
                enqueueSnackbar("db가 신청되었습니다.", {
                  variant: "success",
                  autoHideDuration: 2000,
                });
              getUser();
            }}
          />
        </Row>
      </Column>
    </Layout>
  );
}
