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
  width: { lg: "715px", md: "715px", sm: "715px", xs: "90%" },
  height: "322px",
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

export default function Upload() {
  const { enqueueSnackbar } = useSnackbar();
  const { visible, closeModal, modalContent } = useContext(ModalContext);
  const { title, download, choiceFile, uploadFIle } = modalContent;
  return (
    <Modal open={visible} onClose={closeModal}>
      <Box>
        <Column alignItems={"center"} justifyContent={"center"} sx={style}>
          <TopLabelContents title={title} sx={{ pb: 1, gap: 1 }} />
          <RowLabel label="Sample">
            <Button
              text="다운로드"
              w={60}
              h={20}
              fs={"h6"}
              onClick={download}
            />
          </RowLabel>
          <RowLabel label="관련 파일">
            <OutLineInput />
            <Button
              text="파일선택"
              w={60}
              h={20}
              fs={"h6"}
              onClick={choiceFile}
            />
          </RowLabel>
          <Row sx={{ mt: 2.7, gap: 5 }}>
            <Button
              text="파일 업로드"
              w={166}
              h={52}
              fs={"h5"}
              onClick={uploadFIle}
            />
            <Button
              text="취소"
              bgColor={"gray"}
              w={166}
              h={52}
              fs={"h5"}
              color="primary.white"
              action={closeModal}
            />
          </Row>
        </Column>
      </Box>
    </Modal>
  );
}
