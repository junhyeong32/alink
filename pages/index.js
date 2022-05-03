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
import styles from "../styles/js/home";

import Row from "../src/components/Box/Row";
import Column from "../src/components/Box/Column";
import MenuBox from "../src/components/Box/MenuBox";
import Tab from "../src/components/Box/Tab";
import { menuText, img_src, menu_link } from "../src/data/selectInput";

import { ModalContext, ModalProvider } from "../src/contexts/ModalContext";
import getDetailInfo from "../src/hooks/share/getDetailInfo";
import checkLogin from "../src/hooks/account/useCheckLogin";

export default function Home({ getCookies }) {
  const router = useRouter();
  const [menu_list, setMenuList] = useState([]);
  const [current_menu, setCurrentMenu] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
  const { modal_list, addModalList, deleteModalList } =
    useContext(ModalContext);

  useEffect(() => !getCookies && router.replace("/login"), []);
  const is_loggedin = checkLogin();
  // const detail_info = getDetailInfo(addModalList);

  const logout = () => {
    removeCookie("access_token", { path: "/" });
    removeCookie("user_info", { path: "/" });
    router.replace("login");
  };

  if (!is_loggedin)
    return (
      <Row justifyContent="center" alignItems="center" sx={styles.loading_box}>
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
              return (
                <MenuBox
                  key={key}
                  text={menu}
                  img_src={img_src[key]}
                  onClick={() => {
                    setCurrentMenu(menu_list.length);
                    setMenuList([
                      ...menu_list,
                      {
                        title: menu,
                        link: menu_link[key],
                      },
                    ]);
                  }}
                />
              );
            }
          })}
        </Column>
      </aside>
      <Container component="article" sx={styles.container}>
        <Row sx={{ mt: "4px" }}>
          {menu_list?.map((menu, m_key) => (
            <Tab
              style={{
                position: "relative",
                zIndex: current_menu === m_key ? 3 : 1,
              }}
              title={menu.title}
              menu_list={menu.link}
              key={m_key}
              tabOnClick={() => {
                setCurrentMenu(m_key);
              }}
              refreshOnclick={() =>
                (document.getElementsByClassName("iframe")[m_key].src += "")
              }
              closeOnClick={() => {
                if (current_menu === menu_list.length - 1) {
                  setCurrentMenu(current_menu - 1);
                }
                setMenuList(() => {
                  let new_menu_list = [...menu_list];
                  new_menu_list.splice(m_key, 1);

                  return new_menu_list;
                });
              }}
            />
          ))}
        </Row>

        {/* {menu_list?.map((menu, m_key) => {
          return (
            <Column
              key={m_key}
              sx={{
                display: m_key !== current_menu ? "none" : undefined,
                ...styles.menu_list,
              }}
            >
              <iframe
                src={menu.link}
                className="iframe"
                id={menu.link.slice(1, menu.link.length)}
                width="100%"
                height="100%"
                frameBorder={0}
                padding={10}
              />
            </Column>
          );
        })}
        {modal_list.map((modal, key) => {
          if (modal?.name === "openUserModal") {
            return (
              <ContractModal
                key={key}
                index={key}
                modal_props={modal}
                deleteModalList={deleteModalList}
              />
            );
          } else if (modal?.name === "openApModal") {
            return (
              <EmployeeModal
                key={key}
                index={key}
                modal_props={modal}
                addModalList={addModalList}
                deleteModalList={deleteModalList}
              />
            );
          } else if (modal?.name === "openMessageModal") {
            return (
              <MessageModal
                key={key}
                index={key}
                modal_props={modal}
                deleteModalList={deleteModalList}
              />
            );
          } else if (modal?.name === "openImageModal") {
            return (
              <ImageModal
                key={key}
                index={key}
                modal_props={modal}
                deleteModalList={deleteModalList}
              />
            );
          } else if (modal?.name === "openApproveModal") {
            return (
              <ApproveModal
                key={key}
                index={key}
                modal_props={modal}
                deleteModalList={deleteModalList}
              />
            );
          } else if (modal?.name === "openCompanionModal") {
            return (
              <CompanionModal
                key={key}
                index={key}
                modal_props={modal}
                deleteModalList={deleteModalList}
              />
            );
          } else if (modal?.name === "openImproveModal") {
            return (
              <ImproveModal
                key={key}
                index={key}
                modal_props={modal}
                deleteModalList={deleteModalList}
              />
            );
          } else {
            return;
          }
        })} */}
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
