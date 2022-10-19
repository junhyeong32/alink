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
import {
  LabelOutLineInput,
  LabelUnderLineInput,
  OutLineInput,
} from "../../src/components/Input";
import CustomSwitch from "../../src/components/Switch";
import useGetUser from "../../src/hooks/user/useGetUser";
import Axios from "../../src/utility/api";
import { getAccessToken, setCookie } from "../../src/utility/getCookie";
import { useSnackbar } from "notistack";
import { getCookie } from "../../src/utility/getCookie";
import useGetMenus from "../../src/hooks/setting/useGetMenus";
import { LensTwoTone } from "@mui/icons-material";
import { useContext } from "react";
import { ModalContext } from "../../src/contexts/ModalContext";
import { numberFormat } from "../../src/utility/math";
import moment from "moment";
import { sortGeo } from "../../src/utility/sortGeo";

export default function DBApply() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [org_name, setOrgName] = useState("");
  const [user_info] = useState(getCookie("user_info"));
  const [dbInformation] = useState(getCookie("dbInformation"));
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [db, setDb] = useState([]); //화면에 뿌려주는 state
  const [changeDb, setChangeDb] = useState([]); //전송 state
  const [noneChangeDb, setNoneChangeDb] = useState([]); //전송 state
  const [pk, setPk] = useState("");
  const [loading, setLoading] = useState(true);
  const [changeLoading, setChangeLoading] = useState(true);
  const [db_count, setDbCount] = useState([]);
  const [next_db_count, setNextDbCount] = useState([]);

  const { menus } = useGetMenus();
  const { user, isUserPending, getUser } = useGetUser();
  const { openModal, closeModal } = useContext(ModalContext);

  const weekdayOf27 = moment(moment().format("yyyy-MM-27")).weekday();
  const day = 27 - (weekdayOf27 === 6 || weekdayOf27 === 0 ? 1 : 0);

  useEffect(() => {
    if (menus?.length === 0 || user?.length === 0) return;
    const { db } = user;

    setNoneChangeDb(() => {
      return user?.db
        ?.filter((u, key) => !menus?.some((menu) => menu?.pk === u?.pk))
        ?.map((user_db, key) => {
          return {
            db_pk: user_db?.pk,
            allocation: [
              {
                is_activated: 0,
                count: user_db?.allocation?.count,
                count_for_next_month: user_db?.allocation?.count_for_next_month,
                pk: 0,
              },
            ],
            geomap: (() => {
              const geoData = [];
              user_db?.geomap?.map((geo) => geoData.push({ name: geo?.name }));
              return geoData;
            })(),
          };
        });
      // return _user;
    });

    setChangeDb(() => {
      return menus?.map((menu, key) => {
        return {
          db_pk: menu.pk,
          allocation: [
            {
              is_activated: menu?.is_activated,
              count: db?.find((d) => d?.pk === menu.pk)?.allocation?.count,
              count_for_next_month:
                moment().date() >= day
                  ? db?.find((d) => d?.pk === menu.pk)?.allocation
                      ?.count_for_next_month
                  : 0,
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

    if (
      user?.status === "미승인" &&
      (user?.pay_amount < 0 || !user?.pay_amount) &&
      (user?.deposit_status === "입금 미완료" || !user?.deposit_status)
    ) {
      openModal({
        modal: "deposit",
        data: numberFormat(user?.pay_amount * -1),
        content: {
          buttonAction: () =>
            openModal({
              modal: "needconfirm",
              content: {
                buttonText: "예",

                action: async () => {
                  const res = Axios.Post("user/deposit", {
                    token: getAccessToken(),
                  });
                  closeModal();
                  router.push("/");
                },
                closeAction: () => router.push("/"),
                contents: (
                  <Column>
                    <Typography variant="h5" color="primary.red" align="center">
                      입금을 완료하셨습니까?
                    </Typography>
                    <Typography variant="h5" color="red" align="center" mt={1}>
                      관리자 확인 후 승인처리가 진행됩니다
                    </Typography>
                  </Column>
                ),
              },
            }),
        },
      });
    } else if (
      (user?.deposit_status === "입금 완료" && user?.status === "미승인") ||
      user?.status === "미승인"
    ) {
      openModal({
        modal: "depositconfirm",
      });
    } else if (moment().date() >= day) {
      if (!dbInformation)
        openModal({
          modal: "guide",
          content: {
            guideText: "익월DB 신청안내",
            cancel: false,
            contents: (
              <Typography variant="h5">
                익월DB 신청칸이 생성되었습니다.
                <br />
                다음 달 DB신청 수량을 입력하세요.
              </Typography>
            ),
            buttonText: "확인",
            action: (todayNoSee) => {
              if (todayNoSee)
                setCookie("dbInformation", true, {
                  path: "/",
                  maxAge: 436000,
                });
              closeModal();
            },
          },
        });
    }

    setLoading(false);
  }, [menus, user]);

  useEffect(() => {
    if (changeLoading) return;
    const dbApply = async () => {
      const res = await Axios.Post("user/db/count", {
        token: getAccessToken(),
        db: [...changeDb, ...noneChangeDb],
      });
      if (res?.code === 200) {
        enqueueSnackbar("db가 신청되었습니다.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        router.reload();
      }
    };

    dbApply();
  }, [changeDb]);

  return (
    <Layout loading={loading}>
      <Column>
        <Column sx={{ pr: "40px", gap: "20px", mt: 3 }}>
          <Row alignItems={"center"} justifyContent={"between"} sx={{ mb: 2 }}>
            <Typography variant="h1">DB 신청</Typography>
            {/* moment().date() >= day &&  */}
            {
              <Button
                variant="contained"
                bgColor="primary"
                text="익월 DB 신청하기"
                color="primary.white"
                fs="h5"
                w={160}
                h={30}
                action={() => {
                  openModal({
                    modal: "dbapply",
                    data: {
                      menus: menus,
                      changeDb: changeDb,
                      noneChangeDb: noneChangeDb,
                      setChangeDb: setChangeDb,
                      user: user,
                    },
                    content: {
                      action: closeModal,
                      buttonText: "확인",
                      guideText:
                        user_info?.name +
                        " " +
                        user_info?.grade +
                        " " +
                        (new Date().getMonth() + 1) +
                        "월 DB신청현황",
                    },
                  });
                }}
              />
            }
          </Row>
          {user?.acfp > 300000 && (
            <Column
              justifyContent={"start"}
              alignItems={"start"}
              sc={{ mb: 2 }}
            >
              <Typography variant="h5" sx={{ color: "#3532C7" }}>
                {new Date().getMonth() + 1}월 DB 지원 대상자입니다.
              </Typography>

              <Typography variant="normal" sx={{ color: "#909090" }}>
                지원여부는 계약상태값에 따라 변경될 수 있습니다.
              </Typography>
            </Column>
          )}
          {menus?.map((menu, key) => (
            <Column key={key}>
              <RowLabel
                label={menu?.title}
                fs="h4"
                label_w={83}
                sx={{ gap: 10 }}
              >
                <Row alignItems={"end"} sx={{ gap: 1 }}>
                  <LabelUnderLineInput
                    title="당월"
                    disabled={status === "퇴사자"}
                    w={90}
                    defaultValue={0}
                    onBlur={(e) =>
                      setDbCount((prev) => {
                        const newData = [...prev];

                        newData[key] = e.target.value;

                        return newData;
                      })
                    }
                  />
                  <Typography variant="h6" pl={1}>
                    개
                  </Typography>

                  {moment().date() >= day && (
                    <>
                      <LabelUnderLineInput
                        title="익월"
                        disabled={status === "퇴사자"}
                        w={90}
                        defaultValue={0}
                        onBlur={(e) =>
                          setNextDbCount((prev) => {
                            const newData = [...prev];

                            newData[key] = e.target.value;

                            return newData;
                          })
                        }
                      />
                      <Typography variant="h6" pl={1}>
                        개
                      </Typography>
                    </>
                  )}
                </Row>
                <Row wrap={"wrap"} sx={{ gap: 1 }}>
                  <Typography variant="h4" mr={3}>
                    담당 지역
                  </Typography>
                  <RoundColorBox
                    background={
                      changeDb[key]?.geomap.length === menu?.geomap?.length
                        ? "#0D1D41"
                        : "#E6E6E6"
                    }
                    fc={
                      changeDb[key]?.geomap.length === menu?.geomap?.length
                        ? "#FFFFFF"
                        : "#000000"
                    }
                    fs={12}
                    sx={{ maxWidth: 100, gap: 1, cursor: "pointer" }}
                    onClick={() =>
                      setChangeDb((prev) => {
                        const newData = [...prev];

                        if (newData[key].geomap.length < menu?.geomap?.length) {
                          newData[key].geomap = [];

                          menu?.geomap?.map((map) =>
                            newData[key].geomap?.push({ name: map?.name })
                          );
                        } else {
                          newData[key].geomap = [];
                        }

                        return newData;
                      })
                    }
                  >
                    전국
                  </RoundColorBox>

                  {menu?.geomap?.map((map, area_key) => (
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
            // disabled={moment().date() >= day ? true : false}
            action={() => {
              openModal({
                modal: "needconfirm",
                content: {
                  contents: (
                    <Typography component={"div"}>
                      <Typography variant="h5">당월</Typography>- 잔여수량 :{" "}
                      {menus
                        ?.map((menu, key) => {
                          return user?.db?.find((db) => db?.pk === menu.pk);
                        })
                        ?.map(
                          (d) =>
                            d?.title.split("리스트")[0] +
                            " " +
                            d?.allocation?.count +
                            "개 "
                        )}
                      <br />- 신청수량 :{" "}
                      {menus?.map(
                        (menu, key) =>
                          menu?.title.split("리스트")[0] +
                          " " +
                          (Number(db_count[key]) ? Number(db_count[key]) : 0) +
                          "개 "
                      )}{" "}
                      <br />
                      <br />
                      잔여수량 총 합계는 아래와 같습니다. <br />[
                      {menus
                        ?.map((menu, key) => {
                          return user?.db?.find((db) => db?.pk === menu.pk);
                        })
                        ?.map(
                          (d, K) =>
                            d?.title.split("리스트")[0] +
                            " " +
                            (d?.allocation?.count +
                              (Number(db_count[K]) ? Number(db_count[K]) : 0)) +
                            "개 "
                        )}
                      ]
                    </Typography>
                  ),
                  action: () => {
                    setChangeDb((prev) => {
                      let newData = [...prev];

                      changeDb?.map(
                        (db, key) =>
                          (newData[key] = {
                            ...newData[key],
                            allocation: [
                              {
                                ...newData[key]?.allocation[0],
                                count:
                                  Number(db?.allocation[0]?.count) +
                                  (Number(db_count[key])
                                    ? Number(db_count[key])
                                    : 0),
                                count_for_next_month:
                                  db?.allocation[0]?.count_for_next_month,
                              },
                            ],
                          })
                      );

                      return newData;
                    });

                    setChangeLoading(false);
                  },
                },
              });
            }}
          />
        </Row>
      </Column>
    </Layout>
  );
}
