import { useState, useContext } from "react";
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
export default function Privacy() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [menu, setMenu] = useState("popup");
  const [area, setArea] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();
  const [rank, setRank] = useState(cookies?.user_info?.grade);
  const [status, setStatus] = useState(cookies?.user_info?.status);
  const [org, setOrg] = useState(cookies?.user_info?.head_office);
  const [id, setId] = useState(cookies?.user_info?.id);
  const [user, setUser] = useState(cookies?.user_info?.name);
  const [new_password, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [date, setDate]= useState(cookies?.user_info?.grade);

  const [date_range, setDateRange] = useState([null, null]);
  const { openModal, closeModal, modalContent } = useContext(ModalContext);

  const handleUserUpdate = async () => {
    // if(!user)

    const res = await Axios.Post("user/signin_info", {
      token: cookies.access_token,
      id: id,
      password: password,
      name: user,
      email: email,
      phone: phone,
    });

    if (res?.code) {
      return enqueueSnackbar("회원정보가 수정되었습니다.", {
        variant: "sucess",
        autoHideDuration: 2000,
      });
    }
  };

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
              <LabelUnderLineInput
                title="상태"
                placeholder={"변경시에만 입력하세요"}
                w={{ lg: 294, xs: "100%" }}
              />
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
                value={user}
                setValue={setUser}
              />
            )}
            <LabelUnderLineInput
              title="비밀번호 확인"
              placeholder={"변경시에만 입력하세요"}
              w={{ lg: 294, xs: "100%" }}
              value={password}
              setValue={setPassword}
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
          fs={"h6"}
          w={90}
          h={22}
          action={handleUserUpdate}
          //TODO enque 수정됫습니다 변경
        />
      </Column>
    </Layout>
  );
}
