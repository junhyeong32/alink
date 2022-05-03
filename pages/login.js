import Head from "next/head";
import Image from "next/image";
import style from "../styles/js/login";
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

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();

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
        platform: "web",
        id: id,
        password: password,
      })
    )?.data;
    // A0000001
    // 830223 사장

    if (res?.web_token) {
      setCookie("user_info", res, {
        path: "/",
        maxAge: 86400,
      });

      setCookie("access_token", res?.web_token, {
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
    <main style={style.main}>
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
          sx={style.id_input}
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
          sx={style.password_input}
          name="password"
        />
      </Column>
      <LoadingButton
        onClick={handleLogin}
        sx={style.login_btn}
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
