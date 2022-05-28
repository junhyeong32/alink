import Head from "next/head";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import {
  Input,
  Box,
  Typography,
  Container,
  Divider,
  CircularProgress,
} from "@mui/material";
import Row from "../Box/Row";
import Column from "../Box/Column";
import MenuBox from "../Box/MenuBox";
import { menuText, img_src, menu_link } from "../../data/home";
import checkLogin from "../../hooks/account/useCheckLogin";
import Button from "../Button";
import Modal from "../Modal";

export default function Layout({ getCookies, children }) {
  const router = useRouter();
  const [menu_list, setMenuList] = useState([]);
  const [current_menu, setCurrentMenu] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [visible, setVisible] = useState(false);
  //   const { modal_list, addModalList, deleteModalList } =
  //     useContext(ModalContext);

  //   useEffect(() => !getCookies && router.replace("/login"), []);
  const is_loggedin = checkLogin();

  const logout = () => {
    removeCookie("access_token", { path: "/" });
    removeCookie("user_info", { path: "/" });
    router.replace("login");
  };

  //   if (!is_loggedin)
  //     return (
  //       <Row
  //         justifyContent="center"
  //         alignItems="center"
  //         sx={{
  //           width: "100%",
  //           mt: 5,
  //           minHeight: "999px",
  //         }}
  //       >
  //         <CircularProgress size="60px" thickness={5} color="primary" />
  //       </Row>
  //     );

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
            <Image src="/alink.png" width={240} height={63} alt="" />
            <Row
              alignItems={"start"}
              justifyContent={"between"}
              sx={{ mt: 5.2 }}
            >
              <Typography variant="h2" color="primary.white">
                환영합니다.
                {/* {cookies.user_info?.name} {cookies.user_info?.rank}님 */}{" "}
              </Typography>

              <Column justifyContent="between" alignItems={"start"}>
                <Button
                  text="이용권한"
                  color="primary.white"
                  fs="h7"
                  sx={{ p: 0 }}
                  action={() => router.push("/authority")}
                />
                <Button
                  text="개인 정보 수정"
                  color="primary.white"
                  fs="h7"
                  sx={{ p: 0 }}
                  action={() => router.push("/privacy")}
                />
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
              {menuText.map((menu, key) => {
                if (menu === "AP 관리" && cookies.user_info?.rank === "AP") {
                  return;
                } else {
                  return (
                    <MenuBox key={key} text={menu} link={menu_link[key]} />
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
          }}
        >
          {children}
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
