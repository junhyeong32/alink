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
import { getAccessToken } from "../../src/utility/getCookie";
import { useTransition } from "react";
import useGetArea from "../../src/hooks/setting/useGetArea";
import { OutLineInput } from "../../src/components/Input";
import RoundColorBox from "../../src/components/Box/RoundColorBox";
import useGetMenus from "../../src/hooks/setting/useGetMenus";
import { getTitleOfOrg } from "../../src/utility/organization/getTitleOfOrg";

export default function Detail() {
  const router = useRouter();
  const [user, setUser] = useState([]);
  const [isPending, startTransition] = useTransition();
  const { area } = useGetArea();
  const { menus } = useGetMenus();

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
        });
      }
    };
    getDetail();
  }, [router.isReady]);

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
                  : key === 6
                  ? user?.phone
                  : user?.created_date}
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
                          user?.db
                            ?.filter((db) => db?.pk === d?.pk)[0]
                            .geomap?.find((d) => d?.name === map?.name)
                            ? "#0D1D41"
                            : "#E6E6E6"
                        }
                        fc={
                          user?.db
                            ?.filter((db) => db?.pk === d?.pk)[0]
                            .geomap?.find((d) => d?.name === map?.name)
                            ? "#FFFFFF"
                            : "#000000"
                        }
                        fs={12}
                        sx={{ maxWidth: 100, gap: 1 }}
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

        <Row justifyContent={"center"}>
        <Button
            text="정보수정"
            variant={"contained"}
            bgColor="gray"
            color="primary.white"
            fs={"h6"}
            w={65}
            h={25}
            action={() => router.back()}
          />
          <Button
            text="목록보기"
            variant={"contained"}
            bgColor="gray"
            color="primary.white"
            fs={"h6"}
            w={65}
            h={25}
            action={() => router.back()}
          />
        </Row>
      </Column>
    </Layout>
  );
}
