import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "../../../styles/js/modal";
import shareStyles from "../../../styles/js/modal";
import { useEffect, useState, useContext } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import Column from "../Box/Column";
import Row from "../Box/Row";
import TextBox from "../Box/Text";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import Axios from "../../utility/api";
import { useCookies } from "react-cookie";
import { ModalContext } from "../../contexts/ModalContext";
import { InformationSelectInput } from "../InformationInput";

const MessageBox = ({ text }) => {
  return (
    <Typography
      variant="normal"
      sx={{ wordBreak: "break-all", letterSpacing: "-0.05em" }}
    >
      {text.split("\n").map((txt) => (
        <>
          {txt}
          <br />
        </>
      ))}
    </Typography>
  );
};

export default function Improve({ index, modal_props, deleteModalList }) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user_info] = useState(cookies.user_info);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("서명");
  const [message, setMessage] = useState("");

  const { modal_list, modal_data, addModalList, addModalData } =
    useContext(ModalContext);

  useEffect(() => {
    if (reason === "서명") setMessage("서명을 확인해주세요.");
    else if (reason === "고객명") setMessage("고객명을 확인해주세요.");
    else if (reason === "증권번호") setMessage("증권번호를 확인해주세요.");
    else if (reason === "보험사") setMessage("보험사를 확인해주세요.");
    else setMessage("");
  }, [reason]);

  const handleImprove = async () => {
    setLoading(true);
    const res = (
      await Axios.Post("insurance/apply", {
        platform: "web",
        token: cookies.access_token,
        status: "반려",
        reason: message,
        document_codes: Array.isArray(modal_props.document_codes)
          ? modal_props.document_codes.join(",")
          : modal_props.document_codes,
      })
    )?.code;

    if (res === 200) {
      enqueueSnackbar("보완요청이 완료되었습니다..", {
        variant: "success",
        autoHideDuration: 2000,
      });
      deleteModalList(index);
    } else {
      enqueueSnackbar(res?.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    return () => {
      setLoading(false);
    };
  };

  return (
    <Modal
      open={modal_props.is_open}
      onClose={() => {
        deleteModalList(index);
        !modal_props && false;
      }}
    >
      <Box
        sx={{
          width: "443px",
          height: "272px",
          ...styles.modal,
          padding: "21px 38px 19px 38px",
        }}
      >
        <Column justifyContent="between" sx={{ height: "100%" }}>
          <Row
            alignItems="center"
            justifyContent="start"
            sx={{ borderBottom: "1px solid #0D1D41", pb: "9px" }}
          >
            <Typography variant="h3">보완 사유</Typography>
          </Row>

          <Row justifyContent="center">
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              variant="standard"
              sx={{ width: "148px", textAlign: "center" }}
            >
              <MenuItem value={"서명"}>서명</MenuItem>
              <MenuItem value={"고객명"}>고객명</MenuItem>
              <MenuItem value={"증권번호"}>증권번호</MenuItem>
              <MenuItem value={"보험사"}>보험사</MenuItem>
              <MenuItem value={"기타"}>기타</MenuItem>
            </Select>
          </Row>

          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="filled"
            name="message"
            inputProps={{
              style: {
                padding: "6px 0 0 12px",
                fontSize: "12px",
              },
            }}
            multiline
            rows={4}
            mt={1}
          />

          <Row justifyContent="center" sx={{ gap: "19px" }}>
            <Button
              variant="contained"
              color="dark_gray"
              sx={{ width: "100px", height: "30px", p: 0 }}
              onClick={() => deleteModalList(index)}
            >
              <Typography variant="h4" color="primary.white">
                취소
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "100px", height: "30px", p: 0 }}
              onClick={handleImprove}
            >
              <Typography variant="h4" color="primary.white">
                보완요청
              </Typography>
            </Button>
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
