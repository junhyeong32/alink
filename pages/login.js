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

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  const getUser = async (token) => {
    if (router.isReady) {
      const res = (await Axios.Get(`user/db/count?token=${token}`))?.data;

      if (res?.code === 200) return res?.data;
    }
  };

  const handleLogin = async () => {
    if (!id || !password) {
      return enqueueSnackbar("회원정보를 올바르게 입력해주세요.", {
        variant: "error",
        autoHideDuration: 2000,
    });
    }
    setLoading(true);
    const res = (
      await Axios.Post("user/signin", {
        id: id,
        password: password,
      })
    )?.data;
    //관리자 계정
    //ALINK000
    //alink000!!

    // ALINK0001
    // link001!!

    if (res) {
      setCookie("user_info", res, {
        path: "/",
        maxAge: 86400,
      });

      setCookie("access_token", res?.access_token, {
        path: "/",
        maxAge: 86400,
      });

      setLoading(false);
      enqueueSnackbar("로그인 되었습니다.", {
        variant: "sucess",
        autoHideDuration: 2000,
      });
      router.replace(`/`);
    } else {
      enqueueSnackbar("회원정보가 일치하지 않습니다.", {
        variant: "error",
        autoHideDuration: 2000,
      });
      setLoading(false);
    }
  };

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
      <Image src="/alink.png" width={360} height={117} alt="" />
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
      <Column
        alignItems="start"
        justifyContent="start"
        sx={{
          mt: 2.1,
          rowGap: 1,
        }}
      >
        <Typography variant="h6" color="primary.white">
          비밀번호
        </Typography>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              handleLogin();
            }
          }}
          sx={{
            width: 364,
            height: 42,
            background: " rgba(255, 255, 255, 0.6)",
            pl: 0,
            fontWeight: 400,
            fontSize: 18,
            paddingLeft: "12px",
          }}
          name="password"
        />
      </Column>
      <LoadingButton
        onClick={handleLogin}
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
        loading={loading}
        loadingIndicator="Loading..."
      >
        {!loading && <Typography variant="h3">로그인</Typography>}
      </LoadingButton>
    </main>
  );
}
