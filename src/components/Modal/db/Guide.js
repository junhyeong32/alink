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
import { Modal, Box, Typography, Grid, Checkbox } from "@mui/material";
import Column from "../../Box/Column";
import Row from "../../Box/Row";
import { LoadingButton } from "@mui/lab";
import Axios from "../../../utility/api";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { ModalContext } from "../../../contexts/ModalContext";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";

const style = {
  minWidth: { lg: "411px", md: "411px", sm: "411px", xs: "90%" },
  width: "auto",
  minHeight: 185,
  height: "auto",
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

export default function Guide({ index }) {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfrmLoading] = useState(false);
  const [cookies] = useCookies();
  const [check, setCheck] = useState(false);

  const { modal, closeModal, modalContent } = useContext(ModalContext);
  const {
    contents,
    guideText,
    text,
    close = true,
    action,
    buttonText = "승인",
    actionButtonColor,
    closeAction,
    cancel = true,
  } = modalContent[index];

  return (
    <Modal
      open={modal[index] === "guide" ? true : false}
      onClose={() => closeModal[index]}
    >
      <Box>
        <Column alignItems={"center"} justifyContent={"center"} sx={style}>
          <Column
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ width: "100%", height: "100%", gap: "25px" }}
          >
            <TopLabelContents title={guideText} sx={{ pb: 1 }} />
            {contents || <Typography variant="h5">{text}</Typography>}
            <Row sx={{ gap: 2.5 }}>
              <Button
                text={buttonText}
                bgColor={buttonText === "삭제" ? "red" : "primary"}
                color="primary.white"
                w={97}
                h={30}
                fs={"h4"}
                action={() => {
                  action(check);
                }}
              />
              {cancel && (
                <Button
                  text="취소"
                  w={97}
                  h={30}
                  bgColor={"gray"}
                  color={"primary.white"}
                  fs={"h4"}
                  action={() => {
                    closeAction && closeAction();
                    closeModal(index);
                  }}
                />
              )}
            </Row>
          </Column>
          {close && (
            <Row alignItems={"center"}>
              <Checkbox
                icon={
                  <Image
                    src="/checkbox_white.png"
                    width={15}
                    height={15}
                    alt=""
                  />
                }
                onClick={(e) => {
                  setCheck(e.target.checked);
                }}
              />
              <Typography variant="h5" color="primary">
                하루동안 열지않기
              </Typography>
            </Row>
          )}
        </Column>
      </Box>
    </Modal>
  );
}
