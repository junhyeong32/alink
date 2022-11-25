import Head from "next/head";
import Image from "next/image";
import { Input, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import Row from "../src/components/Box/Row";
import Column from "../src/components/Box/Column";
import Axios from "../src/utility/api";
import { useCookies } from "react-cookie";
import reduceImageSize from "../src/utility/image";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { getCookie } from "../src/utility/getCookie";

export default function Password() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();

  return (
    <main
      style={{
        backgroundImage: `url(/main_background.png)`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "100vw",
        height: "100vh",
        objectFit: "contain",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image src="/alink-logo.png" width={137} height={60} alt="" />
      <Column
        alignItems="start"
        justifyContent="start"
        sx={{
          mt: 5.2,
          rowGap: 1,
        }}
      >
        <Typography variant="h6" color="primary.white">
          아이디
        </Typography>
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          sx={{
            width: 364,
            height: 42,
            background: " rgba(255, 255, 255, 0.6)",
            pl: 0,
            fontWeight: 400,
            fontSize: 18,
            lineHeight: "26px",
            paddingLeft: "12px",
          }}
          name="username"
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </Column>

      <LoadingButton
        onClick={async () => {
          if (!id) {
            return enqueueSnackbar("아이디를 입력해주세요", {
              variant: "error",
              autoHideDuration: 2000,
            });
          }

          const res = (
            await Axios.Post("user/reset-password", {
              user_id: id,
            })
          )?.data;

          if (res?.code === 200) {
            enqueueSnackbar("초기화 되었습니다", {
              variant: "sucess",
              autoHideDuration: 2000,
            });

            router.push("/");
          } else {
            enqueueSnackbar("회원정보가 일치하지 않습니다.", {
              variant: "error",
              autoHideDuration: 2000,
            });
          }
        }}
        sx={{
          width: 364,
          height: 50,
          background:
            "linear-gradient(180deg, #0D1D41 0%, rgba(13, 29, 65, 0.8) 100%)",
          color: "white",
          mt: 5,
          p: 0,
        }}
        variant="contained"
        color="primary"
      >
        <Typography variant="h3">초기화</Typography>
      </LoadingButton>
    </main>
  );
}
