import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import Layout from "../src/components/Layout";
import Column from "../src/components/Box/Column";
import Row from "../src/components/Box/Row";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  Box,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ReceptionStatusTable from "../src/components/Table/data-status/ReceptionStatusTable";
import {
  select_title,
  area_input,
  headquarters_input,
  branch_input,
} from "../src/components/Table/data-status/ReceptionStatusList";
import TopLabelContents from "../src/components/Box/TopLableContents";
import RoundColorBox from "../src/components/Box/RoundColorBox";
import {
  status_list,
  status_bgcolor,
  rank_list,
  rank_bgcolor,
} from "../src/data/user";
import ExcelButton from "../src/components/Button/Excel";
import Input, { DateInput, LabelUnderLineInput } from "../src/components/Input";
import SelectInput, {
  OutLineSelectInput,
} from "../src/components/Input/Select";
import Button from "../src/components/Button";
import RowLabel from "../src/components/Box/RowLabel";

import Image from "next/image";
import SmsTable from "../src/components/Table/sms";
import { ModalContext } from "../src/contexts/ModalContext";
import Axios from "../src/utility/api";
import { useSnackbar } from "notistack";
import getUser from "../src/hooks/user/useGetUser";
import { getAccessToken, getCookie } from "../src/utility/getCookie";

export default function Privacy() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [rank, setRank] = useState(getCookie("user_info")?.grade);
  const [status, setStatus] = useState();
  const [org, setOrg] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [new_password, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const { user, isUserPending } = getUser();

  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  const handleUserUpdate = () => {
    if (!password || !new_password) {
      return enqueueSnackbar("비밀번호를 입력해주세요.");
    } else if (password !== new_password) {
      return enqueueSnackbar("비밀번호가 일치하지 않습니다.");
    }
    openModal({
      modal: "needconfirm",
      content: {
        text: "개인정보수정을 진행하시겠습니까?",
        action: async () => {
          const res = await Axios.Post("user/signin_info", {
            token: getAccessToken(),
            id: id,
            password: password,
            name: name,
            email: email,
            phone: phone,
          });

          if (res?.code) {
            setNewPassword("");
            setPassword("");
            enqueueSnackbar("회원정보가 수정되었습니다.", {
              variant: "success",
              autoHideDuration: 2000,
            });
            closeModal();
          }
        },
      },
    });
  };

  useEffect(() => {
    setStatus(user?.status);
    setOrg(user?.head_office);
    setId(user?.id);
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setDate(user?.created_date);
  }, [isUserPending]);

  return (
    <Layout>
      <Column alignItems="center" sx={{ gap: "50px" }}>
        {/* <Row>
          <TopLabelContents title="상태">
            <Button text="상태" />
          </TopLabelContents>
        </Row>
        <Row>
          <TopLabelContents title="아이디">id</TopLabelContents>
          <TopLabelContents title="이용자명">id</TopLabelContents>
        </Row> */}

        <Row
          alignItems={rank === "관리자" ? "end" : "start"}
          justifyContent={"center"}
          wrap="wrap"
          sx={{ gap: "50px", mt: 14, width: "100%" }}
        >
          <Column
            wrap={"wrap"}
            sx={{
              gap: "50px",
              width: {
                lg: "auto",
                md: "auto",
                sm: "auto",
                xs: "100%",
              },
            }}
          >
            {rank === "부관리자" && (
              <TopLabelContents
                title="상태"
                fs="h6"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                <RoundColorBox background={"#0071D0"} w={90} fs={14}>
                  {status}
                </RoundColorBox>
              </TopLabelContents>
            )}
            <LabelUnderLineInput
              title="아이디"
              w={{ lg: 294, xs: "100%" }}
              value={id}
              setValue={setId}
            />
            <LabelUnderLineInput
              title="신규 비밀번호"
              placeholder={"변경시에만 입력하세요"}
              w={{ lg: 294, xs: "100%" }}
              value={new_password}
              setValue={setNewPassword}
              type="password"
            />
            {rank === "부관리자" && (
              <LabelUnderLineInput
                title="이메일"
                placeholder={"변경시에만 입력하세요"}
                w={{ lg: 294, xs: "100%" }}
                value={email}
                setValue={setEmail}
              />
            )}
            {rank === "부관리자" && (
              <LabelUnderLineInput
                title="등록일시"
                w={{ lg: 294, xs: "100%" }}
                disabled
                value={date}
              />
            )}
          </Column>

          <Column
            alignItems={"start"}
            wrap={"wrap"}
            sx={{
              gap: "50px",
              width: {
                lg: "auto",
                md: "auto",
                sm: "auto",
                xs: "100%",
              },
            }}
          >
            {rank === "부관리자" && (
              <LabelUnderLineInput
                title="조직명"
                placeholder={"변경시에만 입력하세요"}
                w={{ lg: 294, xs: "100%" }}
                value={org}
                setValue={setOrg}
              />
            )}
            {rank === "부관리자" && (
              <LabelUnderLineInput
                title="이용자명"
                placeholder={"변경시에만 입력하세요"}
                w={{ lg: 294, xs: "100%" }}
                value={name}
                setValue={setName}
              />
            )}
            <LabelUnderLineInput
              title="비밀번호 확인"
              placeholder={"변경시에만 입력하세요"}
              w={{ lg: 294, xs: "100%" }}
              value={password}
              setValue={setPassword}
              type="password"
            />
            {rank === "부관리자" && (
              <LabelUnderLineInput
                title="연락처"
                placeholder={"변경시에만 입력하세요"}
                w={{ lg: 294, xs: "100%" }}
                value={phone}
                setValue={setPhone}
              />
            )}
          </Column>
        </Row>

        <Button
          text="수정"
          fs={"h5"}
          w={120}
          h={35}
          action={handleUserUpdate}
        />
      </Column>
    </Layout>
  );
}
