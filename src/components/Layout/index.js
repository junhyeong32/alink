import Head from "next/head";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import {
  Input,
  Box,
  Typography,
  Container,
  Divider,
  CircularProgress,
  Switch,
} from "@mui/material";
import Row from "../Box/Row";
import Column from "../Box/Column";
import MenuBox from "../Box/MenuBox";
import { menuText, menu_link, menuText2, menu_link2 } from "../../data/home";
import checkLogin from "../../hooks/account/useCheckLogin";
import Button from "../Button";
import Modal from "../Modal";
import NavSwitch from "../Switch/NavSwitch";
import { getAccessToken, getCookie } from "../../utility/getCookie";
import Axios from "../../utility/api";
import useGetMenus from "../../hooks/setting/useGetMenus";
import useGetUser from "../../hooks/user/useGetUser";
export default function Layout({ loading, children, sx }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [visible, setVisible] = useState(false);
  const [rank, setRank] = useState(cookies?.user_info?.grade);
  const [user_info] = useState(cookies?.user_info);
  const { user, getUser } = useGetUser();

  const [showChild, setShowChild] = useState(false);
  const { menus, isPending, getMenus } = useGetMenus();

  const logout = () => {
    removeCookie("access_token", { path: "/" });
    removeCookie("user_info", { path: "/" });
    router.replace("/login");
  };
  useEffect(() => {
    const _timer = setInterval(async () => {
      const getToekn = (
        await Axios.Get(`user?token=${getCookie("access_token")}`)
      )?.data;

      if (getToekn?.code === 500) {
        logout();
        clearInterval(_timer);
        enqueueSnackbar("인증정보가 만료되었습니다.", {
          variant: "error",
          autoHideDuration: 2000,
        });
        router.replace("/login");
      }
    }, 5000);

    return () => {
      clearInterval(_timer);
    };
  }, [cookies]);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  }

  if (loading)
    return (
      <Row
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "100vh",
        }}
      >
        <CircularProgress size="60px" thickness={5} color="primary" />
      </Row>
    );

  return (
    <>
      <header>
        <Box sx={{ cursor: "pointer", display: visible ? "none" : "inherit" }}>
          <Image
            src="/hamburger.png"
            width={48}
            height={48}
            alt="menu"
            onClick={() => setVisible(true)}
          />
        </Box>
      </header>
      <main
        style={{
          width: "100vw",
          overflowY: "hidden",
        }}
      >
        <aside
          style={{
            display: visible && "flex",
            position: visible && "absolute",
            zIndex: 1,
          }}
        >
          <Column>
            <Row
              justifyContent={"end"}
              sx={{
                display: visible ? "flex" : "none",
                mb: 2,
                cursor: "pointer",
              }}
            >
              <Image
                src="/x.png"
                width={25}
                height={25}
                layout="fixed"
                alt=""
                onClick={() => setVisible(false)}
              />
            </Row>
            <Box sx={{ cursor: "pointer" }}>
              <Image
                src="/alink.png"
                width={240}
                height={63}
                alt=""
                onClick={() => router.push("/")}
              />
            </Box>
            <Row
              alignItems={"start"}
              justifyContent={"between"}
              sx={{ mt: 5.2 }}
            >
              <Typography variant="h2" color="primary.white">
                {cookies.user_info?.name} {rank}
              </Typography>

              <Column
                justifyContent="between"
                alignItems={"start"}
                sx={{ mt: "3px", gap: 1 }}
              >
                {rank === "관리자" && (
                  <Button
                    text="이용권한"
                    color="primary.white"
                    fs="h7"
                    sx={{ p: 0 }}
                    action={() => router.push("/authority")}
                  />
                )}
                {(rank === "관리자" ||
                  rank === "협력사부운영자" ||
                  rank === "협력사운영자" ||
                  rank === "부관리자") && (
                  <Button
                    text="개인 정보 수정"
                    color="primary.white"
                    fs="h7"
                    sx={{ p: 0 }}
                    action={() => router.push("/privacy")}
                  />
                )}

                <Button
                  text="로그아웃"
                  color="primary.white"
                  fs="h7"
                  sx={{ p: 0 }}
                  action={logout}
                />
              </Column>
            </Row>
            <Column
              sx={{
                mt: 3,
                rowGap: 1.2,
              }}
            >
              {/* TODO 
              스위치 스타일 바구기
              */}
              {menuText.map((menu, key) => {
                if (menu === "DB 현황") {
                  return <MenuBox key={key} text={menu} link={"/"} />;
                } else if (menu === "DB 신청하기" || menu === "DB 신청현황") {
                  if (
                    rank === "본부장" ||
                    rank === "지점장" ||
                    rank === "팀장" ||
                    rank === "담당자"
                  ) {
                    return (
                      <MenuBox key={key} text={menu} link={menu_link[key]} />
                    );
                  }
                } else if (menu === "이용자 관리") {
                  if (rank === "관리자" || rank === "부관리자") {
                    return (
                      <MenuBox key={key} text={menu} link={menu_link[key]} />
                    );
                  }
                } else if (menu === "담당자 관리") {
                  if (
                    rank === "본부장" ||
                    rank === "지점장" ||
                    rank === "팀장"
                  ) {
                    return (
                      <MenuBox key={key} text={menu} link={menu_link[key]} />
                    );
                  }
                } else if (
                  (menu === "푸시 알림 내역" || menu === "설정") &&
                  rank === "관리자"
                ) {
                  return (
                    <MenuBox key={key} text={menu} link={menu_link[key]} />
                  );
                }
              })}

              {menus?.map((d, key) => {
                if (d?.is_activated === 0) return;
                if (
                  rank === "관리자" ||
                  ((rank === "협력사" || rank === "부협력사") &&
                    d?.cooperation_organizations.findIndex(
                      (org) => org?.name === user_info?.head_office
                    ) !== -1) ||
                  ((rank !== "협력사" || rank !== "부협력사") &&
                    d?.organizations.findIndex(
                      (org) => org?.name === user_info?.head_office
                    ) !== -1)
                )
                  return (
                    <Row
                      justifyContent={"between"}
                      alignItems="center"
                      key={key}
                      sx={{ ml: 2 }}
                    >
                      <MenuBox
                        textWidth={
                          rank === "본부장" ||
                          rank === "지점장" ||
                          rank === "팀장" ||
                          rank === "담당자"
                            ? 85
                            : "100%"
                        }
                        key={key}
                        text={d?.title}
                        link={`/db?menu=${d?.pk}`}
                      />
                      {(rank === "본부장" ||
                        rank === "지점장" ||
                        rank === "팀장" ||
                        rank === "담당자") && (
                        <>
                          <Typography variant="h5" color="primary.white">
                            {
                              user?.db?.find((u) => u?.pk === d?.pk)?.allocation
                                ?.count
                            }
                          </Typography>
                          <NavSwitch
                            sx={{ ml: 3 }}
                            checked={
                              user?.db?.find((u) => u?.pk === d?.pk)?.allocation
                                ?.is_activated === 1
                                ? true
                                : false
                            }
                            onClick={async () => {
                              const res = await Axios.Post(
                                "user/db/allocation",
                                {
                                  token: getAccessToken(),
                                  allocation_pk: user?.db?.find(
                                    (u) => u?.pk === d?.pk
                                  )?.allocation?.pk,
                                  onoff:
                                    user?.db?.find((u) => u?.pk === d?.pk)
                                      ?.allocation?.is_activated === 1
                                      ? 0
                                      : 1,
                                  db_pk: d?.pk,
                                }
                              );

                              if (res?.code === 200) {
                                enqueueSnackbar("변경되었습니다", {
                                  variant: "success",
                                  autoHideDuration: 2000,
                                });
                                getUser();
                              }
                            }}
                          />
                        </>
                      )}
                    </Row>
                  );
              })}
              {menuText2.map((menu, key) => {
                if (rank === "관리자") {
                  return (
                    <MenuBox key={key} text={menu} link={menu_link2[key]} />
                  );
                }
              })}
            </Column>
          </Column>
        </aside>
        <Container
          component="article"
          sx={{
            width: "100%",
            height: "100vh",
            maxWidth: "none",
            padding: "50px 15px 15px 15px !important",
            margin: 0,
            maxWidth: "none !important",
            position: "relative",
            overflowY: "scroll",
            ...sx,
          }}
        >
          {loading ? (
            <Row
              justifyContent="center"
              alignItems="center"
              sx={{
                height: "100%",
              }}
            >
              <CircularProgress size="60px" thickness={5} color="primary" />
            </Row>
          ) : (
            children
          )}
          <Modal />
        </Container>
      </main>
    </>
  );
}

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       getCookies: context.req.cookies.user_info || null,
//     },
//   };
// }
