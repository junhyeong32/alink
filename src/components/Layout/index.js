import Head from "next/head";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import {
  Input,
  Box,
  Button,
  Typography,
  Container,
  Divider,
  CircularProgress,
} from "@mui/material";
import Row from "../Box/Row";
import Column from "../Box/Column";
import MenuBox from "../Box/MenuBox";
import Tab from "../Box/Tab";
import { menuText, img_src, menu_link } from "../../data/home";
import checkLogin from "../../hooks/account/useCheckLogin";

export default function Layout({ getCookies, children }) {
  const router = useRouter();
  const [menu_list, setMenuList] = useState([]);
  const [current_menu, setCurrentMenu] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
  //   const { modal_list, addModalList, deleteModalList } =
  //     useContext(ModalContext);

  useEffect(() => !getCookies && router.replace("/login"), []);
  const is_loggedin = checkLogin();

  const logout = () => {
    removeCookie("access_token", { path: "/" });
    removeCookie("user_info", { path: "/" });
    router.replace("login");
  };

  if (!is_loggedin)
    return (
      <Row
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "100%",
          mt: 5,
          minHeight: "999px",
        }}
      >
        <CircularProgress size="60px" thickness={5} color="primary" />
      </Row>
    );

  return (
    <main
      style={{
        width: "100vw",
      }}
    >
      <aside>
        <Image src="/web_header.png" width={176} height={32} alt="" />
        <Typography variant="h2" color="primary.white" mt={5.2}>
          {cookies.user_info?.name} {cookies.user_info?.rank}님
          <br />
        </Typography>
        <Typography variant="normal" color="primary.white">
          환영합니다.
        </Typography>
        <Divider />
        <Row justifyContent="end">
          <Button variant="text" sx={{ p: 0 }} onClick={logout}>
            <Typography variant="h7" color="primary.white">
              로그아웃
            </Typography>
          </Button>
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
              return <MenuBox key={key} text={menu} link={menu_link[key]} />;
            }
          })}
        </Column>
      </aside>
      <Container
        component="article"
        sx={{
          width: "100%",
          height: "100vh",
          maxWidth: "none",
          padding: "0px 0px 0px 2px !important",
          margin: 0,
          maxWidth: "none !important",
          minWidth: "1190px",
          // minHeight: "1000px",
          position: "relative",
        }}
      >
        {children}
      </Container>
    </main>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      getCookies: context.req.cookies.user_info || null,
    },
  };
}
