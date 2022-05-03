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
import Router, { useRouter } from "next/router";

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

export default function Approve({ index, modal_props, deleteModalList }) {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user_info] = useState(cookies.user_info);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const { modal_list, modal_data, addModalList, addModalData } =
    useContext(ModalContext);

  const handleApprove = async () => {
    setLoading(true);
    const res = (
      await Axios.Post("insurance/apply", {
        platform: "web",
        token: cookies.access_token,
        status: "승인",
        pk: Array.isArray(modal_props.pk)
          ? modal_props.pk.join(",")
          : modal_props.pk,
      })
    )?.code;

    if (res === 200) {
      enqueueSnackbar("승인되었습니다.", {
        variant: "success",
        autoHideDuration: 2000,
      });
      deleteModalList(index);

      const iframe = document.querySelectorAll("#productManagement");

      Object.entries(iframe).map(([key, list], c) =>
        list.contentWindow.postMessage("product_reload", "*")
      );
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
      <Box sx={{ width: "411px", height: "185px", ...styles.modal }}>
        <Column justifyContent="between" sx={{ height: "100%" }}>
          <Row
            alignItems="center"
            justifyContent="start"
            sx={{ borderBottom: "1px solid #0D1D41", pb: "9px" }}
          >
            <Typography variant="h3">상품 신청</Typography>
          </Row>
          <Row alignItems="ceneter" justifyContent="center">
            <Typography variant="fs16">승인하시겠습니까?</Typography>
          </Row>
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
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              sx={{ width: "100px", height: "30px", p: 0 }}
              onClick={handleApprove}
            >
              {!loading && (
                <Typography variant="h4" color="primary.white">
                  승인
                </Typography>
              )}
            </LoadingButton>
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
