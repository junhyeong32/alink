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
import Tab from "../Box/Tab";
import { menuText, img_src, menu_link } from "../../data/home";
import checkLogin from "../../hooks/account/useCheckLogin";
import Button from "../Button";


export default function Layout({ getCookies, children }) {
  const router = useRouter();
  const [menu_list, setMenuList] = useState([]);
  const [current_menu, setCurrentMenu] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
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
    <main
      style={{
        width: "100vw",
      }}
    >
      <aside>
        <Image src="/alink.png" width={240} height={63} alt="" />
        <Row alignItems={"start"} justifyContent={"between"} sx={{ mt: 5.2 }}>
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
              return <MenuBox key={key} text={menu} link={menu_link[key]} />;
            }
          })}
        </Column>
      </aside>
      <Container
        component="article"
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "none",
          padding: "50px 15px 15px 15px !important",
          margin: 0,
          maxWidth: "none !important",
          //   minWidth: "1190px",
          position: "relative",
        }}
      >
        {children}
      </Container>
    </main>
  );
}

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       getCookies: context.req.cookies.user_info || null,
//     },
//   };
// }
