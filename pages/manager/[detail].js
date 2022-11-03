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
import RowLabel from "../../src/components/Box/RowLabel";
import { userListLabel, field } from "../../src/data/manager/detail";
import Button from "../../src/components/Button";
import Axios from "../../src/utility/api";
import { getAccessToken, getCookie } from "../../src/utility/getCookie";
import { useTransition } from "react";
import useGetArea from "../../src/hooks/setting/useGetArea";
import { OutLineInput } from "../../src/components/Input";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import useGetMenus from "../../src/hooks/setting/useGetMenus";
import { getTitleOfOrg } from "../../src/utility/organization/getTitleOfOrg";
import { useSnackbar } from "notistack";
export default function Detail() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { menus } = useGetMenus();
  const [user_info] = useState(getCookie("user_info"));

  const [user, setUser] = useState([]);
  const [isPending, startTransition] = useTransition();

  const [phone, setPhone] = useState("");
  const [changeDb, setChangeDb] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;

    const getDetail = async () => {
      const res = (
        await Axios.Get(`member/${router.query.detail}`, {
          params: {
            token: getAccessToken(),
          },
        })
      )?.data;

      if (res?.code === 200) {
        startTransition(() => {
          setUser(res?.data);
          setPhone(res?.data?.phone);
          setChangeDb((prev) => {
            const newData = [...prev];
            res?.data?.db?.map((d) =>
              newData.push({
                db_pk: d.pk,
                allocation: [
                  {
                    is_activated: d.allocation.is_activated,
                    count: d.allocation.count,
                    count_for_next_month: d.allocation.count_for_next_month,
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
        });
      }
    };
    getDetail();
  }, [router.isReady]);

  console.log(changeDb);

  return (
    <Layout loading={isPending}>
      <Column sx={{ gap: 2.8 }}>
        <Typography variant="h1">이용자 정보</Typography>
        <Column sx={{ gap: 3 }}>
          {userListLabel.map((label, key) => (
            <RowLabel
              key={key}
              label={label}
              fs={"h4"}
              label_w={60}
              sx={{
                width: { lg: 481, md: 481, sm: 481, xs: "100%" },
              }}
            >
              {user_info?.pk === user?.pk && key === 6 && (
                <OutLineInput defaultValue={phone} setValue={setPhone} />
              )}
              <Typography variant="h4">
                {key === 0
                  ? user?.status
                  : key === 1
                  ? user?.name
                  : key === 2
                  ? user?.id
                  : key === 3
                  ? getTitleOfOrg(user)
                  : key === 4
                  ? user?.email
                  : key === 5
                  ? user?.birthdate
                  : key === 6 && user_info?.pk !== user?.pk
                  ? user?.phone
                  : key === 7 && user?.created_date}
              </Typography>
            </RowLabel>
          ))}
        </Column>

        <Column sx={{ pr: "40px", gap: "20px", mt: 3 }}>
          <Typography variant="h1">DB 관리</Typography>
          {menus?.map((d, key) => (
            <Column key={key}>
              <RowLabel label={d?.title} fs="h4" label_w={83}>
                <Row alignItems={"center"}>
                  <OutLineInput
                    disabled
                    w={90}
                    defaultValue={
                      user?.db?.filter((db) => db?.pk === d?.pk)[0]?.allocation
                        ?.count
                    }
                  />
                  <Typography variant="h6" pl={1}>
                    개
                  </Typography>
                </Row>
                <RoundColorBox
                  background={
                    user?.db?.filter((db) => db?.pk === d?.pk)[0].location
                      ?.is_activated === 1
                      ? "#0D1D41"
                      : "#909090"
                  }
                >
                  {d?.location?.is_activated === 1 ? "ON" : "OFF"}
                </RoundColorBox>

                <Row wrap={"wrap"} sx={{ gap: 1 }}>
                  {d?.geomap?.map((map, area_key) => {
                    return (
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
                          if (user_info?.pk !== user?.pk) return;

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
                    );
                  })}
                </Row>
              </RowLabel>
            </Column>
          ))}
        </Column>

        <Row justifyContent={"center"} sx={{ gap: 1 }}>
          {user?.pk === user_info?.pk && (
            <Button
              text="정보수정"
              variant={"contained"}
              bgColor="primary"
              color="primary.white"
              fs={"h5"}
              w={158}
              h={35}
              action={async () => {
                const res = await Axios.Post("member", {
                  token: getAccessToken(),
                  member_pk: user?.pk || undefined,
                  id: user?.id,
                  status: user?.status,
                  grade: user?.grade,
                  name: user?.name,
                  phone: phone,
                  email: user?.email,
                  birthdate: user?.birthdate,
                  db: changeDb,
                  head_office_org_code: user?.head_office_org_code,
                  parent_org_code: user?.parent_org_code,
                  org_code: user?.org_code,
                });
                if (res?.code === 200) {
                  enqueueSnackbar("수정이 완료되었습니다", {
                    variant: "success",
                    autoHideDuration: 2000,
                  });
                  router.back();
                } else {
                  enqueueSnackbar(res?.message, {
                    variant: "error",
                    autoHideDuration: 2000,
                  });
                }
              }}
            />
          )}
          <Button
            text="목록보기"
            variant={"contained"}
            bgColor="gray"
            color="primary.white"
            fs={"h5"}
            w={158}
            h={35}
            action={() => router.back()}
          />
        </Row>
      </Column>
    </Layout>
  );
}
