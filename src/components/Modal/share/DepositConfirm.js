import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  createRef,
} from "react";
import { Modal, Box, Typography, Grid } from "@mui/material";
import Column from "../../Box/Column";
import Row from "../../Box/Row";
import { LoadingButton } from "@mui/lab";
import Axios from "../../../utility/api";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { ModalContext } from "../../../contexts/ModalContext";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import { useRouter } from "next/router";

const style = {
  width: { lg: "411px", md: "411px", sm: "411px", xs: "90%" },
  height: "185px",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 2.7,
};

export default function DepositConfirm({ index }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfrmLoading] = useState(false);
  const [cookies] = useCookies();

  const { modal, closeModal, modalContent } = useContext(ModalContext);

  return (
    <Modal
      open={modal[index] === "depositconfirm" ? true : false}
      onClose={() => closeModal[index]}
    >
      <Box>
        <Column alignItems={"center"} justifyContent={"center"} sx={style}>
          <Column
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ width: "100%", height: "100%", gap: "25px" }}
          >
            <Row sx={{ width: "100%", pb: 1, borderBottom: "1px solid black" }}>
              <Typography variant="h4" color="primary.red">
                입금확인중
              </Typography>
            </Row>
            <Column alignItems={"center"} sx={{ gap: 2.5 }}>
              <Typography>관리자가 입금을 확인중입니다.</Typography>
              <Button
                text={"확인"}
                bgColor={"primary"}
                color="primary.white"
                w={97}
                h={30}
                fs={"h4"}
                action={() => {
                  closeModal();
                  router.push("/");
                }}
              />
            </Column>
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
