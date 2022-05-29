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
import RowLabel from "../../Box/RowLabel";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import TopLabelContents from "../../Box/TopLableContents";
import Button from "../../Button";
import UnderLineSelectInput from "../../Input/Select";
import { OutLineInput } from "../../Input";
import Row from "../../Box/Row";
import { ModalContext } from "../../../contexts/ModalContext";

const style = {
  width: { lg: "660px", md: "715px", sm: "715px", xs: "90%" },
  height: "812px",
  overflowX: "hidden",
  background: "#FFFFFF",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function Result() {
  const { enqueueSnackbar } = useSnackbar();
  const { visible, closeModal, modalContent } = useContext(ModalContext);
  const { title, file } = modalContent;
  return (
    <Modal open={visible} onClose={closeModal}>
      <Box>
        <Column alignItems={"center"} justifyContent={"start"} sx={style}>
          <Row justifyContent={"end"} sx={{ width: "100%", cursor: "pointer" }}>
            <Image
              src="/black_x.png"
              width={19}
              height={19}
              alt="x"
              onClick={closeModal}
            />
          </Row>
          <TopLabelContents title={title} sx={{ pb: 1, gap: 1 }} />
          {file && (
            <Box sx={{ border: "1px solid #000000" }}>
              <Image src={file} width={518} height={707} alt="" />
            </Box>
          )}

          <Button
            text="다운로드"
            variant={"contained"}
            bgColor={"red"}
            fs="h6"
            color="primary.white"
            sx={{ mt: 1 }}
          />
        </Column>
      </Box>
    </Modal>
  );
}
